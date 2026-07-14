"use client";
import { motion } from "motion/react";
import { Target, Eye } from "lucide-react";

export default function MissionVisionSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-card border shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <Target className="w-12 h-12 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize professional-grade digital tools. We believe
              everyone deserves access to fast, secure, and intelligent
              utilities without complex software or expensive subscriptions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-card border shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <Eye className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A future where artificial intelligence seamlessly augments human
              creativity and productivity, processing complex workflows with a
              single click across a universally accessible platform.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
