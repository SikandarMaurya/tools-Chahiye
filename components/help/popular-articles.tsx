'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Clock, Star, Flame, BookOpen } from 'lucide-react';
import Link from 'next/link';

const articles = [
  {
    title: 'How to compress PDF files without losing quality',
    category: 'PDF Tools',
    readTime: '4 min',
    difficulty: 'Beginner',
    views: '125k',
    tag: 'Trending',
    icon: Flame,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  },
  {
    title: 'Batch convert WebP to JPG using the Image Converter',
    category: 'Image Tools',
    readTime: '6 min',
    difficulty: 'Intermediate',
    views: '89k',
    tag: 'Editor Choice',
    icon: Star,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10'
  },
  {
    title: 'Using the AI Image Generator for Marketing Assets',
    category: 'AI Tools',
    readTime: '8 min',
    difficulty: 'Advanced',
    views: '210k',
    tag: 'Featured',
    icon: BookOpen,
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
];

export default function PopularArticles() {
  return (
    <section className="py-24 bg-muted/30 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Popular Articles</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Most frequently read guides and tutorials by our community this week.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/help/articles" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, index) => {
            const Icon = article.icon;
            return (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/help/article/${article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  <div className="group bg-card border border-white/10 dark:border-white/5 rounded-3xl p-6 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                        {article.category}
                      </span>
                      <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${article.bg} ${article.color}`}>
                        <Icon className="w-3 h-3" />
                        {article.tag}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center gap-4 text-sm text-muted-foreground pt-6 border-t border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <div>{article.difficulty}</div>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <div>{article.views} views</div>
                    </div>
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
