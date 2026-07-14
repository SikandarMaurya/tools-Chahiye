"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const milestones = [
  {
    year: "2022",
    title: "The Vision",
    desc: "Started with a simple idea: unify fragmented online tools into one premium platform.",
  },
  {
    year: "2023",
    title: "AI Integration",
    desc: "Launched our proprietary AI processing engines for image and text generation.",
  },
  {
    year: "2024",
    title: "Global Scaling",
    desc: "Reached 10M+ users globally, expanded server nodes across 12 countries.",
  },
  {
    year: "2025",
    title: "Enterprise Launch",
    desc: "Introduced SOC2 compliant infrastructure and enterprise-grade security features.",
  },
  {
    year: "Future",
    title: "Autonomous AI",
    desc: "Building self-healing, context-aware tools that anticipate your needs.",
  },
];

export default function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section
      ref={containerRef}
      className="py-32 bg-muted/30 border-y relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From a single utility to a billion-dollar platform infrastructure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />

          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex items-center justify-between mb-16 ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
            >
              <div className="w-5/12 text-right hidden md:block">
                {idx % 2 === 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {milestone.year}
                    </h3>
                    <h4 className="text-xl font-semibold mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground">{milestone.desc}</p>
                  </>
                ) : null}
              </div>

              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10" />

              <div className="w-5/12 hidden md:block">
                {idx % 2 !== 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {milestone.year}
                    </h3>
                    <h4 className="text-xl font-semibold mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-muted-foreground">{milestone.desc}</p>
                  </>
                ) : null}
              </div>

              {/* Mobile View */}
              <div className="w-full md:hidden pl-8 relative">
                <h3 className="text-xl font-bold text-primary mb-1">
                  {milestone.year}
                </h3>
                <h4 className="text-lg font-semibold mb-1">
                  {milestone.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {milestone.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
