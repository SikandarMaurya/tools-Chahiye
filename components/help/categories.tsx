'use client';

import { motion } from 'framer-motion';
import { FileText, Image, Video, Music, Code2, Search, FileDown, Settings, ShieldCheck, Smartphone, Cpu, Box } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    icon: FileText,
    name: 'PDF Tools',
    description: 'Merge, split, compress, and edit PDFs.',
    articles: 42,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'hover:border-red-500/50',
  },
  {
    icon: Image,
    name: 'Image Tools',
    description: 'Resize, compress, convert, and edit images.',
    articles: 38,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    border: 'hover:border-blue-500/50',
  },
  {
    icon: Cpu,
    name: 'AI Tools',
    description: 'Generators, upscalers, and smart editors.',
    articles: 56,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    border: 'hover:border-purple-500/50',
  },
  {
    icon: Video,
    name: 'Video Tools',
    description: 'Trim, compress, and convert videos.',
    articles: 24,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    border: 'hover:border-green-500/50',
  },
  {
    icon: Music,
    name: 'Audio Tools',
    description: 'Edit, compress, and convert audio files.',
    articles: 18,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    border: 'hover:border-yellow-500/50',
  },
  {
    icon: Code2,
    name: 'Developer Tools',
    description: 'Formatters, validators, and generators.',
    articles: 31,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    border: 'hover:border-orange-500/50',
  },
  {
    icon: Search,
    name: 'SEO Tools',
    description: 'Meta tags, keywords, and analytics.',
    articles: 27,
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
    border: 'hover:border-teal-500/50',
  },
  {
    icon: Settings,
    name: 'Account & Billing',
    description: 'Manage subscriptions and settings.',
    articles: 15,
    color: 'text-gray-500',
    bg: 'bg-gray-500/10',
    border: 'hover:border-gray-500/50',
  },
];

export default function HelpCategories() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4 tracking-tight"
          >
            Browse by Category
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Explore our comprehensive knowledge base organized by tool family and features.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/help/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className={`group bg-card/50 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-3xl p-6 h-full transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl ${category.border}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${category.bg} ${category.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {category.articles} articles
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
