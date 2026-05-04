import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plane, CircleDot } from "lucide-react";

const AnimatedCounter = ({ target, label, icon: Icon, color }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-xl p-6 text-center flex flex-col items-center gap-3 hover:border-primary/40 transition-colors"
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <motion.span
        key={count}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        className="font-display text-4xl font-bold text-foreground"
      >
        {count}
      </motion.span>
      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
        {label}
      </span>
    </motion.div>
  );
};

const ResultsSection = ({
  results,
  originalImage,
  outputImage,
  outputVideo,
  mode,
}) => {
  if (!results) return null;

  if (mode === "airbase") {
    const sampleTiles = Array.isArray(results.sample_tiles)
      ? results.sample_tiles
      : [];
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-20"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Airbase <span className="text-primary neon-text">Scan Results</span>
            </h2>
            <p className="font-body text-muted-foreground">
              Aggregated detections across tiled area analysis
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <AnimatedCounter
              target={results.aircraft}
              label="Aircraft"
              icon={Plane}
              color="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
            />
            <AnimatedCounter
              target={results.helicopters}
              label="Helicopters"
              icon={CircleDot}
              color="bg-neon-green/10 text-neon-green border border-neon-green/20"
            />
            <AnimatedCounter
              target={results.fighter_jets}
              label="Fighter Jets"
              icon={Plane}
              color="bg-destructive/10 text-destructive border border-destructive/20"
            />
          </div>

          <div className="glass rounded-xl p-4 max-w-2xl mx-auto mb-8 text-center border border-primary/20">
            <div className="font-mono text-xs text-primary mb-2 tracking-widest uppercase">
              Tiles Processed
            </div>
            <div className="font-display text-3xl font-bold text-foreground">
              {results.tiles_processed ?? 0}
            </div>
          </div>

          {sampleTiles.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <div className="font-mono text-xs text-muted-foreground mb-3 tracking-widest uppercase text-center">
                Sample Annotated Tiles
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleTiles.map((tile, index) => (
                  <div
                    key={`${index}-${tile.length}`}
                    className="glass rounded-xl p-2 border border-border hover:border-primary/40 transition-colors"
                  >
                    <img
                      src={`data:image/jpeg;base64,${tile}`}
                      alt={`Tile ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-20"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Detection <span className="text-primary neon-text">Results</span>
          </h2>
          <p className="font-body text-muted-foreground">
            AI analysis complete — classified targets identified
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          <AnimatedCounter
            target={results.aircraft}
            label="Aircraft"
            icon={Plane}
            color="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
          />
          <AnimatedCounter
            target={results.helicopters}
            label="Helicopters"
            icon={CircleDot}
            color="bg-neon-green/10 text-neon-green border border-neon-green/20"
          />
          <AnimatedCounter
            target={results.fighter_jets}
            label="Fighter Jets"
            icon={Plane}
            color="bg-destructive/10 text-destructive border border-destructive/20"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="glass rounded-xl p-4">
            <div className="font-mono text-xs text-muted-foreground mb-2 tracking-widest uppercase">
              Original Input
            </div>
            <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center border border-border overflow-hidden">
              {mode === "image" ? (
                originalImage ? (
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span className="font-mono text-sm text-muted-foreground">
                    No image
                  </span>
                )
              ) : originalImage ? (
                <video
                  src={originalImage}
                  controls
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span className="font-mono text-sm text-muted-foreground">
                  No video
                </span>
              )}
            </div>
          </div>
          <div className="glass rounded-xl p-4 border-primary/20">
            <div className="font-mono text-xs text-primary mb-2 tracking-widest uppercase">
              Detected Output
            </div>
            <div className="aspect-video bg-primary/5 rounded-lg flex items-center justify-center border border-primary/20 neon-glow overflow-hidden">
              {mode === "image" ? (
                outputImage ? (
                  <img
                    src={outputImage}
                    alt="Detected"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <span>No output</span>
                )
              ) : outputVideo ? (
                <video
                  key={outputVideo}
                  src={outputVideo}
                  controls
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span>Processing video...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ResultsSection;
