"use client";
import { motion } from "motion/react";
import { Zap, Shield, Sparkles, Heart, Globe, Lock } from "lucide-react";

const values = [
  {
    icon: Sparkles,
    title: "Innovation First",
    desc: "Pushing boundaries with cutting-edge AI.",
  },
  {
    icon: Shield,
    title: "Uncompromising Privacy",
    desc: "Your data never becomes our product.",
  },
  {
    icon: Zap,
    title: "Blazing Speed",
    desc: "Optimized infrastructure for instant results.",
  },
  {
    icon: Heart,
    title: "Crafted Quality",
    desc: "Pixel-perfect UI and flawless UX.",
  },
  {
    icon: Lock,
    title: "Enterprise Trust",
    desc: "SOC2 compliant, military-grade encryption.",
  },
  {
    icon: Globe,
    title: "Global Accessibility",
    desc: "Tools built for everyone, everywhere.",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="py-32 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Values</h2>
          <p className="text-muted-foreground text-lg">
            The principles that drive every line of code we write.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
              <p className="text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
