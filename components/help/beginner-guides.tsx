'use client';

import { motion } from 'framer-motion';
import { Book, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const guides = [
  {
    title: 'Getting Started Guide',
    description: 'Learn the basics of navigating the workspace, uploading files, and accessing your tools.',
    steps: ['Account Setup', 'Workspace Overview', 'Your First Conversion'],
    link: '/help/guides/getting-started'
  },
  {
    title: 'Mastering AI Tools',
    description: 'Discover how to write better prompts and use our AI features for maximum productivity.',
    steps: ['Prompt Engineering 101', 'Image Generation', 'Text Summarization'],
    link: '/help/guides/mastering-ai'
  },
  {
    title: 'Batch Processing Files',
    description: 'Save hours by converting, resizing, or compressing hundreds of files at once.',
    steps: ['Selecting Multiple Files', 'Configuring Output', 'Downloading ZIPs'],
    link: '/help/guides/batch-processing'
  }
];

export default function BeginnerGuides() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Book className="w-4 h-4" />
            Step-by-Step Learning
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-4 tracking-tight"
          >
            Beginner Guides
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            New to the platform? These comprehensive guides will take you from novice to power user.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((guide, index) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-3xl p-8 hover:border-primary/50 transition-all shadow-lg flex flex-col"
            >
              <h3 className="text-xl font-bold mb-3">{guide.title}</h3>
              <p className="text-muted-foreground mb-6 line-clamp-2">{guide.description}</p>
              
              <div className="space-y-3 mb-8 flex-grow">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              
              <Link 
                href={guide.link}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Read Guide <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
