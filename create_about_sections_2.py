import os

sections = {
    "why-choose-us.tsx": """
'use client';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground text-lg">See how we compare against traditional platforms.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-muted/50 border opacity-80"
          >
            <h3 className="text-2xl font-bold text-muted-foreground mb-6 text-center">Traditional Tools</h3>
            <ul className="space-y-4">
              {['Slow page loads', 'Intrusive ads & popups', 'Paywalls for basic features', 'Scattered across different sites', 'Poor mobile experience'].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
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
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Our Platform</h3>
            <ul className="space-y-4 relative z-10">
              {['Blazing fast processing', 'Ad-free clean interface', 'Free core features', 'All tools in one dashboard', 'Native-like mobile apps'].map((text, i) => (
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
""",
    "ai-platform.tsx": """
'use client';
import { motion } from 'motion/react';
import { Brain, Sparkles, Image as ImageIcon, FileText } from 'lucide-react';

export default function AIPlatformSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI-Native Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet Our AI Engines</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We don't just use AI; we've built our platform around it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Vision AI", desc: "Advanced object detection, background removal, and generative inpainting.", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: FileText, title: "Document AI", desc: "Intelligent OCR, context-aware summarization, and semantic analysis.", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: ImageIcon, title: "Generative AI", desc: "Text-to-image, style transfer, and intelligent upscaling models.", color: "text-green-500", bg: "bg-green-500/10" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "categories.tsx": """
'use client';
import { motion } from 'motion/react';
import { FileText, ImageIcon, Settings, Search, Code, Play } from 'lucide-react';
import Link from 'next/link';

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
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Unified Ecosystem</h2>
          <p className="text-muted-foreground text-lg">Hundreds of specialized tools, organized perfectly.</p>
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
                    <p className="text-sm text-muted-foreground">{cat.count} tools</p>
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
// Stub for Sparkles to avoid missing import
import { Sparkles } from 'lucide-react';
""",
    "global-availability.tsx": """
'use client';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

export default function GlobalAvailabilitySection() {
  return (
    <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Global Scale. Local Speed.</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12">
          Deployed across 24 edge regions worldwide, ensuring sub-50ms latency no matter where you are.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          {['North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East'].map(region => (
            <span key={region} className="px-4 py-2 bg-primary-foreground/10 rounded-full backdrop-blur-sm border border-primary-foreground/20">
              {region}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
"""
}

for filename, code in sections.items():
    with open(f"components/about/{filename}", "w") as f:
        f.write(code.strip())

print("More components created.")
