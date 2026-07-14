"use client";
import { motion } from "motion/react";
import {
  FileText,
  Image as ImageIcon,
  Settings,
  Search,
  Code,
  Play,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function CategoriesSection() {
  const categories = [
    { icon: FileText, title: "PDF Tools", count: 24, href: "/pdf-tools" },
    { icon: ImageIcon, title: "Image Tools", count: 18, href: "/image-tools" },
    { icon: Sparkles, title: "AI Tools", count: 12, href: "/ai-tools" },
    { icon: Search, title: "SEO Tools", count: 15, href: "/seo-tools" },
    { icon: Code, title: "Developer", count: 20, href: "/developer-tools" },
    { icon: Play, title: "Video Tools", count: 8, href: "/categories" },
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Unified Ecosystem
          </h2>
          <p className="text-muted-foreground text-lg">
            Hundreds of specialized tools, organized perfectly.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.count} tools
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
