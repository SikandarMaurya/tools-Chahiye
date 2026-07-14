"use client";
import { motion } from "motion/react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground text-lg">
            See how we compare against traditional platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-muted/50 border opacity-80"
          >
            <h3 className="text-2xl font-bold text-muted-foreground mb-6 text-center">
              Traditional Tools
            </h3>
            <ul className="space-y-4">
              {[
                "Slow page loads",
                "Intrusive ads & popups",
                "Paywalls for basic features",
                "Scattered across different sites",
                "Poor mobile experience",
              ].map((text, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <XCircle className="w-5 h-5 text-red-400" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-card border-2 border-primary shadow-xl shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">
              Our Platform
            </h3>
            <ul className="space-y-4 relative z-10">
              {[
                "Blazing fast processing",
                "Ad-free clean interface",
                "Free core features",
                "All tools in one dashboard",
                "Native-like mobile apps",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
