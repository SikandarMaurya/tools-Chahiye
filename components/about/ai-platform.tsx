"use client";
import { motion } from "motion/react";
import { Brain, Sparkles, Image as ImageIcon, FileText } from "lucide-react";

export default function AIPlatformSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI-Native Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Meet Our AI Engines
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We don't just use AI; we've built our platform around it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "Vision AI",
              desc: "Advanced object detection, background removal, and generative inpainting.",
              color: "text-purple-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: FileText,
              title: "Document AI",
              desc: "Intelligent OCR, context-aware summarization, and semantic analysis.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: ImageIcon,
              title: "Generative AI",
              desc: "Text-to-image, style transfer, and intelligent upscaling models.",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border shadow-lg hover:shadow-xl transition-all"
            >
              <div
                className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}
              >
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
