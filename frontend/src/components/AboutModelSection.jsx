import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const sections = [
  {
    number: "01",
    title: "What is YOLOv8?",
    image: "./src/assets/first_image.jpg",
    description:
      "YOLOv8 is the latest generation in the YOLO family released by Ultralytics for fast and accurate computer vision tasks. It is designed for real-time object detection, where the model predicts both object class and location in one forward pass. Built on a modern convolutional neural network architecture, it balances speed with strong localization quality. This single-pass design makes it especially effective in environments where quick decisions matter and latency must stay low.",
    bullets: [
      "Latest YOLO release by Ultralytics",
      "Real-time object detection with one-pass inference",
      "CNN-based architecture optimized for speed and precision",
    ],
  },
  {
    number: "02",
    title: "Why YOLOv8 for Aircraft Detection?",
    image: "./src/assets/second_image.jpg",
    description:
      "Aircraft monitoring demands reliable detection across variable altitude, scale, and visibility conditions. YOLOv8 performs well on both small and large targets, helping detect distant aircraft as well as closer objects in the same frame. Its robustness to diverse lighting, weather, and background noise improves consistency for outdoor and aerial scenes. The model's high throughput and accuracy make it a strong fit for continuous airspace monitoring workflows.",
    bullets: [
      "Captures small and large aircraft across varying scales",
      "Handles changing weather and lighting conditions",
      "Delivers strong speed-accuracy tradeoff for aerial monitoring",
    ],
  },
  {
    number: "03",
    title: "How It Works in This Project",
    image: "./src/assets/third_image.jpg",
    description:
      "The workflow starts when a user uploads an image or video through the interface. The input is processed by the YOLOv8 detection pipeline, which scans each frame or image for aircraft patterns. Detected objects are localized with bounding boxes and classified into supported aircraft categories. The output is then returned as labeled results with confidence scores, giving users a clear and interpretable view of model predictions.",
    bullets: [
      "User uploads image or video from the frontend",
      "Model processes input and detects aircraft via bounding boxes",
      "UI returns labeled detections with confidence values",
    ],
  },
  {
    number: "04",
    title: "Applications",
    image: "./src/assets/fourth_image.png",
    description:
      "Aircraft detection with YOLOv8 can support a wide range of operational and safety-oriented scenarios. In civil contexts, it helps monitor air traffic activity and improve situational awareness around critical zones. In defense and security, it strengthens surveillance capability by providing rapid identification and tracking support. It is also valuable for airport operations and search-and-rescue missions where fast visual analysis can accelerate response time.",
    bullets: [
      "Air traffic observation and monitoring support",
      "Defense surveillance and perimeter intelligence workflows",
      "Airport oversight plus search-and-rescue assistance",
    ],
  },
];

const AboutModelSection = () => {
  return (
    <section id="about-model" className="py-24 md:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="max-w-3xl mb-14 md:mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
            YOLOv8 <span className="text-primary neon-text">Aircraft Detection Model</span>
          </h2>
          <p className="font-body text-muted-foreground leading-relaxed">
            This section outlines how YOLOv8 powers aircraft recognition in this platform, from core
            model capabilities to project-specific detection flow and real-world use cases.
          </p>
        </motion.div>

        <div className="space-y-10 md:space-y-12">
          {sections.map((section, index) => {
            const imageOrder = index % 2 === 0 ? "md:order-1" : "md:order-2";
            const textOrder = index % 2 === 0 ? "md:order-2" : "md:order-1";

            return (
              <motion.article
                key={section.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"
              >
                <div
                  className={`${imageOrder} glass rounded-2xl border border-glass-border/40 p-6 shadow-[0_10px_30px_hsl(var(--background)/0.4)] transition-all duration-300 hover:border-primary/45 hover:shadow-[0_0_28px_hsl(var(--neon-cyan)/0.18)]`}
                >
                  <div className="h-full min-h-64 rounded-xl border border-dashed border-primary/40 bg-gradient-to-br from-muted/45 to-primary/10 p-4 md:p-5 flex items-center justify-center">
                    <img
                      src={section.image}
                      alt="Aircraft detection model visualization"
                      className="w-full h-60 md:h-64 object-cover rounded-xl transition-transform duration-300 hover:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className={`${textOrder} glass rounded-2xl border border-glass-border/35 p-6 lg:p-7`}>
                  <p className="font-display text-sm tracking-[0.3em] text-primary/90 mb-3">{section.number}</p>
                  <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
                    {section.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-5">{section.description}</p>
                  <ul className="space-y-2.5">
                    {section.bullets.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-body">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutModelSection;
