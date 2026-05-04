import { Radar } from "lucide-react";

const Footer = () => (
  <footer id="contact" className="py-12 border-t border-border">
    <div className="container mx-auto px-6 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Radar className="w-5 h-5 text-primary" />
        <span className="font-display text-sm tracking-widest text-primary neon-text">AeroVision </span>
      </div>
      <p className="font-mono text-xs text-muted-foreground tracking-wider">
        Powered by AeroVision — Defense-Grade Aerial Intelligence
      </p>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <p className="font-mono text-[10px] text-muted-foreground/50 tracking-wider uppercase">
        © 2026 Shivraj Chavan. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
