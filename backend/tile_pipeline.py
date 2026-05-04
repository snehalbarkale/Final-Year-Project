import base64
import math
from typing import Dict, List, Optional, Tuple

import contextily as ctx
import cv2
import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
from shapely.geometry import box

MUMBAI_AIRBASE_NAME = "Chhatrapati Shivaji Maharaj International Airport Mumbai"
MUMBAI_ALIASES = {
    MUMBAI_AIRBASE_NAME.lower(),
    "mumbai airport",
    "mumbai international airport",
    "csm international airport mumbai",
}

AIRBASES = {
    MUMBAI_AIRBASE_NAME: {
        "top_left": {"lat": 19.101372, "lon": 72.847982},
        "top_right": {"lat": 19.101859, "lon": 72.879739},
        "bottom_left": {"lat": 19.078848, "lon": 72.847335},
        "bottom_right": {"lat": 19.078529, "lon": 72.879280},
    }
}


def _normalize_area_name(area_name: str) -> str:
    return (area_name or "").strip().lower()


def is_supported_airbase(area_name: str) -> bool:
    normalized = _normalize_area_name(area_name)
    return normalized in MUMBAI_ALIASES


def get_airbase_polygon(area_name: str) -> Optional[Dict[str, Dict[str, float]]]:
    if is_supported_airbase(area_name):
        return AIRBASES[MUMBAI_AIRBASE_NAME]
    return None


def compute_tile_steps(tile_size_m: int, lat_mid: float) -> Tuple[float, float]:
    meters_per_degree_lat = 111_000
    meters_per_degree_lon = 111_000 * math.cos(math.radians(lat_mid))
    lat_step = tile_size_m / meters_per_degree_lat
    lon_step = tile_size_m / meters_per_degree_lon
    return lat_step, lon_step


def generate_tile_bboxes(
    coords: Dict[str, Dict[str, float]], tile_size_m: int = 750
) -> List[Dict[str, float]]:
    top_left = coords["top_left"]
    top_right = coords["top_right"]
    bottom_left = coords["bottom_left"]

    lat_mid = (top_left["lat"] + bottom_left["lat"]) / 2
    lat_step, lon_step = compute_tile_steps(tile_size_m, lat_mid)

    tiles = []
    row_idx = 0
    current_lat = top_left["lat"]
    while current_lat > bottom_left["lat"]:
        current_lon = top_left["lon"]
        col_idx = 0
        while current_lon < top_right["lon"]:
            tiles.append(
                {
                    "row": row_idx,
                    "col": col_idx,
                    "min_lat": current_lat - lat_step,
                    "max_lat": current_lat,
                    "min_lon": current_lon,
                    "max_lon": current_lon + lon_step,
                }
            )
            current_lon += lon_step
            col_idx += 1
        current_lat -= lat_step
        row_idx += 1
    return tiles


def render_satellite_tile(tile_bbox: Dict[str, float]) -> np.ndarray:
    geom_wgs84 = box(
        tile_bbox["min_lon"],
        tile_bbox["min_lat"],
        tile_bbox["max_lon"],
        tile_bbox["max_lat"],
    )
    tile_gdf = gpd.GeoDataFrame(
        [{"geometry": geom_wgs84}],
        geometry="geometry",
        crs="EPSG:4326",
    ).to_crs(epsg=3857)

    geom_3857 = tile_gdf.geometry.iloc[0]
    minx, miny, maxx, maxy = geom_3857.bounds

    fig, ax = plt.subplots(figsize=(6.4, 6.4), dpi=100)
    try:
        ax.set_xlim(minx, maxx)
        ax.set_ylim(miny, maxy)
        ctx.add_basemap(
            ax,
            source=ctx.providers.Esri.WorldImagery,
            crs=tile_gdf.crs.to_string(),
            attribution=False,
        )
        ax.set_axis_off()
        fig.tight_layout(pad=0)
        fig.canvas.draw()

        width, height = fig.canvas.get_width_height()
        rgb = np.frombuffer(fig.canvas.buffer_rgba(), dtype=np.uint8).reshape(
            (height, width, 4)
        )[:, :, :3]
        return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    finally:
        plt.close(fig)


def _encode_image_to_base64(image_bgr: np.ndarray) -> str:
    ok, buffer = cv2.imencode(".jpg", image_bgr)
    if not ok:
        return ""
    return base64.b64encode(buffer).decode("utf-8")


def run_tile_inference(model, tile_img: np.ndarray, conf: float = 0.4) -> Dict:
    results = model(tile_img, conf=conf, verbose=False)
    result = results[0]

    aircraft = 0
    helicopters = 0
    fighter_jets = 0

    boxes = result.boxes
    if boxes is not None and len(boxes) > 0:
        for box in boxes:
            cls = int(box.cls[0])
            score = float(box.conf[0])
            if score < conf:
                continue
            if cls == 0:
                fighter_jets += 1
            elif cls == 1:
                aircraft += 1
            elif cls == 2:
                helicopters += 1

    annotated = result.plot()
    return {
        "aircraft": aircraft,
        "helicopters": helicopters,
        "fighter_jets": fighter_jets,
        "annotated_tile": annotated,
    }


def collect_sample_tiles(sample_tiles: List[str], annotated_tile: np.ndarray, limit: int = 6):
    if len(sample_tiles) >= limit:
        return
    encoded = _encode_image_to_base64(annotated_tile)
    if encoded:
        sample_tiles.append(encoded)


def get_dummy_airbase_response(area_name: str) -> Dict:
    seed = sum(ord(ch) for ch in (area_name or "unknown"))
    return {
        "mode": "airbase",
        "aircraft": 2 + (seed % 5),
        "helicopters": 1 + (seed % 3),
        "fighter_jets": 1 + (seed % 4),
        "tiles_processed": 0,
        "sample_tiles": [],
    }


def run_airbase_detection(
    model=None,
    area_name: str = MUMBAI_AIRBASE_NAME,
    tile_size_m: int = 700,
    max_tiles: int = 30,
    conf: float = 0.4,
) -> Dict:
    coords = get_airbase_polygon(area_name)
    if coords is None:
        return get_dummy_airbase_response(area_name)

    if model is None:
        raise ValueError("A loaded YOLO model instance is required")

    bounded_tile_size = min(max(tile_size_m, 500), 800)
    tiles = generate_tile_bboxes(coords, tile_size_m=bounded_tile_size)
    tiles = tiles[:max_tiles]
    totals = {
        "mode": "airbase",
        "aircraft": 0,
        "helicopters": 0,
        "fighter_jets": 0,
        "tiles_processed": 0,
        "sample_tiles": [],
    }

    for tile in tiles:
        tile_img = render_satellite_tile(tile)
        tile_result = run_tile_inference(model, tile_img, conf=conf)
        totals["aircraft"] += tile_result["aircraft"]
        totals["helicopters"] += tile_result["helicopters"]
        totals["fighter_jets"] += tile_result["fighter_jets"]
        totals["tiles_processed"] += 1

        if (
            tile_result["aircraft"] > 0
            or tile_result["helicopters"] > 0
            or tile_result["fighter_jets"] > 0
            or len(totals["sample_tiles"]) < 4
        ):
            collect_sample_tiles(
                totals["sample_tiles"], tile_result["annotated_tile"], limit=6
            )

    return totals
