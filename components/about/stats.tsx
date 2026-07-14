"use client";
import { motion } from "motion/react";
import { Users, FileText, Globe, Cpu } from "lucide-react";

const stats = [
  { icon: Users, value: "10M+", label: "Active Users" },
  { icon: FileText, value: "500M+", label: "Files Processed" },
  { icon: Globe, value: "195", label: "Countries" },
  { icon: Cpu, value: "1B+", label: "AI Requests" },
];

export default function StatisticsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:32px_32px]" />
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <div className="text-4xl md:text-6xl font-black mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-lg font-medium opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
