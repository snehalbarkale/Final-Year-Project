import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Video, MapPin, Image, Play, Crosshair } from "lucide-react";

const airbases = [
  { name: "Mumbai International Airport", coords: "19°05′19″N, 72°52′05″E" },
  { name: "Edwards AFB", coords: "34.9054°N, 117.8837°W" },
  { name: "Nellis AFB", coords: "36.2360°N, 115.0341°W" },
  { name: "Langley AFB", coords: "37.0832°N, 76.3604°W" },
  { name: "Ramstein AB", coords: "49.4369°N, 7.6003°E" },
  { name: "Al Udeid AB", coords: "25.1175°N, 51.3150°E" },
];

const InputCards = ({ onDetect }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [selectedBase, setSelectedBase] = useState("");
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const cards = [
    {
      icon: Image,
      title: "Upload Image",
      description: "Drag & drop satellite or aerial imagery for instant analysis",
      content: (
        <div
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => imageRef.current?.click()}
          className="mt-4 border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-6 cursor-pointer transition-colors text-center"
        >
          <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">Drop image or click to browse</span>
            </div>
          )}
        </div>
      ),
      action: () => onDetect("image", imageFile || undefined),
      actionLabel: "Detect & Count",
      disabled: !imageFile,
    },
    {
      icon: Video,
      title: "Upload Video",
      description: "Analyze aerial video feeds for continuous tracking",
      content: (
        <div
          onClick={() => videoRef.current?.click()}
          className="mt-4 border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-6 cursor-pointer transition-colors text-center"
        >
          <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
          {videoFile ? (
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-primary" />
              <span className="font-mono text-xs text-foreground truncate">{videoFile.name}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Video className="w-8 h-8 text-muted-foreground" />
              <span className="font-mono text-xs text-muted-foreground">Select video file</span>
            </div>
          )}
        </div>
      ),
      action: () => onDetect("video", videoFile || undefined),
      actionLabel: "Analyze Video",
      disabled: !videoFile,
    },
    {
      icon: MapPin,
      title: "Select Airbase",
      description: "Choose a known airbase for satellite reconnaissance analysis",
      content: (
        <div className="mt-4 space-y-3">
          <select
            value={selectedBase}
            onChange={(e) => setSelectedBase(e.target.value)}
            className="w-full bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
          >
            <option value="">Select airbase...</option>
            {airbases.map((b) => (
              <option key={b.name} value={b.name}>{b.name}</option>
            ))}
          </select>
          {selectedBase && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-neon-green"
            >
              <Crosshair className="w-4 h-4" />
              <span className="font-mono text-xs">
                {airbases.find((b) => b.name === selectedBase)?.coords}
              </span>
            </motion.div>
          )}
        </div>
      ),
      action: () => onDetect("airbase", selectedBase || undefined),
      actionLabel: "Analyze Area",
      disabled: !selectedBase,
    },
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Detection <span className="text-primary neon-text">Modules</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Select your input source for AI-powered aerial vehicle detection and classification
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{
                y: -8,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 0 40px hsl(180 100% 50% / 0.15)",
              }}
              className="glass rounded-2xl p-6 flex flex-col transition-all duration-300 hover:border-primary/40"
              style={{ perspective: 1000 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                  <card.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{card.title}</h3>
              </div>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{card.description}</p>
              {card.content}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={card.action}
                disabled={card.disabled}
                className="mt-auto pt-4 w-full py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary font-display text-xs tracking-widest uppercase hover:bg-primary/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {card.actionLabel}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InputCards;
