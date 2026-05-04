import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import RadarDisplay from "./RadarDisplay";

const messages = [
  "Initializing detection array...",
  "Scanning airspace...",
  "Analyzing aerial signatures...",
  "Processing neural network inference...",
  "Classifying detected objects...",
];

const LoadingOverlay = ({ isVisible }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMsgIndex((p) => (p + 1) % messages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <RadarDisplay size={250} isScanning />
          </motion.div>

          <motion.div
            className="absolute"
            animate={{
              x: [0, 100, -80, 60, -30, 0],
              y: [0, -60, 40, -80, 50, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
              <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
              <line x1="20" y1="2" x2="20" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="20" y1="26" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" />
              <line x1="2" y1="20" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <line x1="26" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.6" />
            </svg>
          </motion.div>

          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="font-mono text-sm text-neon-green neon-text-green tracking-wider"
          >
            {messages[msgIndex]}
          </motion.div>

          <div className="w-64 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-green to-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
