import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import InputCards from "@/components/InputCards";
import LoadingOverlay from "@/components/LoadingOverlay";
import ResultsSection from "@/components/ResultsSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import AboutModelSection from "@/components/AboutModelSection";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL;

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [outputImage, setOutputImage] = useState(null);
  const [mode, setMode] = useState("image");
  const [outputVideo, setOutputVideo] = useState(null);

  const handleDetect = async (detectMode, payload) => {
    const needsFile = detectMode === "image" || detectMode === "video";
    if (needsFile && !payload) {
      toast.error("Please upload a file first");
      return;
    }
    if (detectMode === "airbase" && !payload) {
      toast.error("Please select an airbase first");
      return;
    }

    setIsLoading(true);
    setResults(null);
    setMode(detectMode);
    setOutputImage(null);
    setOutputVideo(null);
    setOriginalImage(null);

    if (needsFile) {
      setOriginalImage(URL.createObjectURL(payload));
    }

    toast.info("Detection initiated", {
      description: `Processing ${detectMode} input...`,
    });

    try {
      let response;
      if (detectMode === "airbase") {
        response = await fetch(`${API}/detect-airbase`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ area_name: payload }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", payload);

        const url =
          detectMode === "video"
            ? `${API}/predict-video`
            : `${API}/predict-image`;
        response = await fetch(url, {
          method: "POST",
          body: formData,
        });
      }

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();

      const realResults = {
        aircraft: data.aircraft ?? 0,
        helicopters: data.helicopters ?? 0,
        fighter_jets: data.fighter_jets ?? 0,
        tiles_processed: data.tiles_processed ?? 0,
        sample_tiles: data.sample_tiles ?? [],
      };

      setResults(realResults);

      if (detectMode === "image" && data.output_image) {
        setOutputImage(`data:image/jpeg;base64,${data.output_image}`);
      } else if (detectMode === "video" && data.video_url) {
        setOutputVideo(data.video_url);
      }

      toast.success("Detection complete", {
        description: `Found ${
          data.aircraft + data.helicopters + data.fighter_jets
        } targets`,
      });

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      <Navbar />
      <HeroSection />
      <InputCards onDetect={handleDetect} />

      <div id="results">
        <ResultsSection
          results={results}
          originalImage={originalImage}
          outputImage={outputImage}
          mode={mode}
          outputVideo={outputVideo}
        />
      </div>

      <AdvantagesSection />
      <AboutModelSection />
      <Footer />
      <LoadingOverlay isVisible={isLoading} />
    </div>
  );
};

export default Index;
