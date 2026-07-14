"use client";
import { motion } from "motion/react";
import { Leaf } from "lucide-react";

export default function SustainabilitySection() {
  return (
    <section className="py-24 border-y">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Committed to Sustainability
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our entire infrastructure is hosted on 100% renewable energy data
            centers. We optimize our AI models to be energy-efficient,
            minimizing our carbon footprint while maximizing performance.
          </p>
          <div className="flex justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              100% Green Hosting
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Carbon Neutral
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
