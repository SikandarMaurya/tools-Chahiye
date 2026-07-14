"use client";
import { motion } from "motion/react";
import { Code2, Server, Database, Cloud } from "lucide-react";

export default function TechStackSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Enterprise Architecture
        </h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">
          Built on a modern, scalable stack designed for maximum performance,
          security, and reliability.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              icon: Code2,
              title: "Frontend",
              stack: "Next.js 14, React, Tailwind CSS, Framer Motion",
            },
            {
              icon: Server,
              title: "Backend",
              stack: "Node.js, Edge Functions, WebAssembly",
            },
            {
              icon: Database,
              title: "AI Models",
              stack: "TensorFlow, PyTorch, Gemini, Custom Vision",
            },
            {
              icon: Cloud,
              title: "Infrastructure",
              stack: "Global CDN, Kubernetes, Cloud SQL",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-muted/50 border hover:bg-muted transition-colors"
            >
              <item.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.stack}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
