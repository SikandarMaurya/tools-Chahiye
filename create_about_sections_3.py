import os

sections = {
    "testimonials.tsx": """
'use client';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: "Sarah Jenkins", role: "Product Designer at TechFlow", text: "It replaced four different subscriptions for our team. The AI upscaler alone is worth it.", rating: 5 },
  { name: "David Chen", role: "Senior Developer", text: "Blazing fast. No ads, no BS. Just tools that work exactly as described. The regex tester is my daily driver.", rating: 5 },
  { name: "Emily Rodriguez", role: "Marketing Director", text: "We use the PDF and SEO tools every single day. The batch processing feature saves us hours each week.", rating: 5 }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-secondary/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Professionals</h2>
          <p className="text-muted-foreground text-lg">Don't just take our word for it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border shadow-sm relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg font-medium mb-8">"{t.text}"</p>
              <div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "sustainability.tsx": """
'use client';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

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
          <h2 className="text-3xl font-bold mb-4">Committed to Sustainability</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our entire infrastructure is hosted on 100% renewable energy data centers. We optimize our AI models to be energy-efficient, minimizing our carbon footprint while maximizing performance.
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
"""
}

for filename, code in sections.items():
    with open(f"components/about/{filename}", "w") as f:
        f.write(code.strip())

print("Sustainability & Testimonials created.")
