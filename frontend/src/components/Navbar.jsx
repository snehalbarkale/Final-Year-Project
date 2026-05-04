import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Radar } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "About Model", href: "#about-model" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <Radar className="w-8 h-8 text-primary" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full border border-primary/30" />
          </div>
          <span className="font-display text-xl font-bold tracking-wider text-primary neon-text">
            AeroVision
          </span>
        </motion.div>

        <div className="hidden md:flex items-center gap-7 lg:gap-8">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors relative group"
              whileHover={{ y: -2 }}
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300 shadow-[0_0_8px_hsl(var(--neon-cyan)/0.5)]" />
            </motion.a>
          ))}
        </div>

        <button
          className="md:hidden text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden glass border-t border-border"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block px-6 py-3 font-body text-sm tracking-widest uppercase text-muted-foreground hover:text-primary hover:bg-muted/30 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
