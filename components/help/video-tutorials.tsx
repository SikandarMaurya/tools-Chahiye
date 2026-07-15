'use client';

import { motion } from 'framer-motion';
import { Play, ArrowRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';

const videos = [
  {
    title: 'Getting Started with ToolsChahiye Workspace',
    duration: '5:24',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop',
    category: 'Getting Started'
  },
  {
    title: 'Advanced AI Image Generation Techniques',
    duration: '12:15',
    thumbnail: 'https://images.unsplash.com/photo-1678280521360-1e5cc28d447a?q=80&w=2070&auto=format&fit=crop',
    category: 'AI Masterclass'
  },
  {
    title: 'Automating Workflows with the Developer API',
    duration: '18:40',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    category: 'Developer Docs'
  }
];

export default function VideoTutorials() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <PlayCircle className="w-4 h-4" />
              Video Learning
            </div>
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Video Tutorials</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Learn faster with step-by-step video guides from our product experts.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/help/videos" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
              Browse video library <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/help/video/${video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                <div className="group relative rounded-3xl overflow-hidden bg-card border border-white/10 dark:border-white/5 aspect-video mb-4">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${video.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold px-2.5 py-1 rounded-md">
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 right-4">
                    <span className="bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-md">
                      {video.duration}
                    </span>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 group-hover:bg-primary group-hover:border-primary transition-all group-hover:scale-110">
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2 px-2">
                  {video.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
