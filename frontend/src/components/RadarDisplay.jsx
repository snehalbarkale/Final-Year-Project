import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const types = ["aircraft", "helicopter", "fighter"];

const RadarDisplay = ({ isScanning = true, blips: externalBlips, size = 300 }) => {
  const [blips, setBlips] = useState(externalBlips || []);

  useEffect(() => {
    if (externalBlips) {
      setBlips(externalBlips);
      return;
    }
    if (!isScanning) return;

    const interval = setInterval(() => {
      setBlips((prev) => {
        const newBlips = [...prev];
        if (newBlips.length > 8) newBlips.shift();
        const angle = Math.random() * Math.PI * 2;
        const dist = 0.2 + Math.random() * 0.7;
        newBlips.push({
          id: Date.now(),
          x: 50 + Math.cos(angle) * dist * 45,
          y: 50 + Math.sin(angle) * dist * 45,
          type: types[Math.floor(Math.random() * 3)],
        });
        return newBlips;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isScanning, externalBlips]);

  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="48" fill="hsl(140 100% 40% / 0.03)" stroke="hsl(140 100% 40% / 0.15)" strokeWidth="0.5" />
        {rings.map((r) => (
          <circle key={r} cx="50" cy="50" r={r * 45} fill="none" stroke="hsl(140 100% 40% / 0.1)" strokeWidth="0.3" />
        ))}
        <line x1="50" y1="5" x2="50" y2="95" stroke="hsl(140 100% 40% / 0.08)" strokeWidth="0.3" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="hsl(140 100% 40% / 0.08)" strokeWidth="0.3" />
        <line x1="15" y1="15" x2="85" y2="85" stroke="hsl(140 100% 40% / 0.05)" strokeWidth="0.3" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="hsl(140 100% 40% / 0.05)" strokeWidth="0.3" />
      </svg>

      {isScanning && (
        <div
          className="absolute top-0 left-0 w-full h-full animate-radar-sweep"
          style={{ transformOrigin: "50% 50%" }}
        >
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              width: "50%",
              height: "2px",
              background: "linear-gradient(90deg, hsl(140 100% 40% / 0.6), transparent)",
              transformOrigin: "0 50%",
              boxShadow: "0 0 15px hsl(140 100% 40% / 0.4)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: "2%",
              left: "2%",
              width: "96%",
              height: "96%",
              background: "conic-gradient(from 0deg, hsl(140 100% 40% / 0.08), transparent 60deg)",
              transformOrigin: "50% 50%",
            }}
          />
        </div>
      )}

      <AnimatePresence>
        {blips.map((blip) => (
          <motion.div
            key={blip.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute"
            style={{
              left: `${blip.x}%`,
              top: `${blip.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    blip.type === "aircraft"
                      ? "hsl(180 100% 50%)"
                      : blip.type === "helicopter"
                      ? "hsl(140 100% 50%)"
                      : "hsl(0 100% 60%)",
                  boxShadow: `0 0 8px ${
                    blip.type === "fighter"
                      ? "hsl(0 100% 60% / 0.6)"
                      : "hsl(140 100% 50% / 0.6)"
                  }`,
                }}
              />
              <div className="absolute inset-0 animate-pulse-ring rounded-full border border-neon-green/40" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div
        className="absolute rounded-full bg-neon-green animate-blink"
        style={{
          width: 4,
          height: 4,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: "0 0 8px hsl(140 100% 50% / 0.6)",
        }}
      />
    </div>
  );
};

export default RadarDisplay;
