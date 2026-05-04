import { motion } from "framer-motion";
import RadarDisplay from "./RadarDisplay";
import FighterBackground from "./FighterBackground";
import jetLeft from "@/assets/jet3-left.png";
import jetRight from "@/assets/jet2-right.png";

const HeroSection = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden grid-overlay">
      <div className="absolute inset-0 scanline pointer-events-none z-10" />

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80 z-10 pointer-events-none" />

      <FighterBackground leftImage={jetLeft} rightImage={jetRight} />

      <div className="absolute inset-0 flex items-center justify-center opacity-60">
        <RadarDisplay size={700} />
      </div>

      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-1.5 glass rounded-full border border-primary/30"
        >
          <div className="w-2 h-2 rounded-full bg-neon-green animate-blink" />
          <span className="font-mono text-xs tracking-widest text-neon-green uppercase">
            System Online • All Sensors Active
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl"
        >
          <span className="text-foreground">AI-Powered </span>
          <span className="text-primary neon-text">Aircraft Detection</span>
          <br />
          <span className="text-foreground">& Monitoring System</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Advanced aerial monitoring with real-time classification and precision analytics.
          Powered by YOLOv8 deep learning architecture.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(180 100% 50% / 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToFeatures}
          className="px-8 py-4 bg-primary text-primary-foreground font-display text-sm tracking-widest uppercase rounded-lg neon-glow transition-all"
        >
          Start Detection
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex gap-8 md:gap-16 mt-8"
        >
          {[
            { label: "Accuracy", value: "93.2%" },
            { label: "Classes", value: "3+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl font-bold text-primary neon-text">{stat.value}</div>
              <div className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
