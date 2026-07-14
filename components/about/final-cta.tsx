"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function FinalCTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-3xl bg-card border shadow-2xl"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Supercharge Your Workflow?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join millions of users who have transformed the way they work with
            documents, images, and AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/categories">
              <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                Start Exploring Free
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
