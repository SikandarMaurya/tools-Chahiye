"use client";
import { motion } from "motion/react";
import { Globe } from "lucide-react";

export default function GlobalAvailabilitySection() {
  return (
    <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Global Scale. Local Speed.
        </h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12">
          Deployed across 24 edge regions worldwide, ensuring sub-50ms latency
          no matter where you are.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          {[
            "North America",
            "Europe",
            "Asia Pacific",
            "South America",
            "Middle East",
          ].map((region) => (
            <span
              key={region}
              className="px-4 py-2 bg-primary-foreground/10 rounded-full backdrop-blur-sm border border-primary-foreground/20"
            >
              {region}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
