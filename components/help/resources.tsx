'use client';

import { motion } from 'framer-motion';
import { Download, FileText, LayoutTemplate, FileCode, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const resources = [
  { icon: FileText, name: 'User Manuals', type: 'PDF', size: '2.4 MB' },
  { icon: LayoutTemplate, name: 'Workflow Templates', type: 'ZIP', size: '15 MB' },
  { icon: FileCode, name: 'API Documentation', type: 'Web', size: 'Live' },
  { icon: Download, name: 'Offline Installers', type: 'EXE/DMG', size: '124 MB' }
];

export default function DownloadsResources() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-br from-primary/10 via-card to-card border border-white/10 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold mb-4 tracking-tight"
              >
                Downloads & Resources
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg mb-8 max-w-lg"
              >
                Get access to official guides, templates, cheat sheets, and API documentation to maximize your productivity.
              </motion.p>
              
              <motion.ul 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {['Updated weekly', 'Verified secure files', 'Free for all users'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    {item}
                  </li>
                ))}
              </motion.ul>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {resources.map((res, index) => {
                const Icon = res.icon;
                return (
                  <motion.div
                    key={res.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href="#">
                      <div className="bg-background/50 backdrop-blur-sm border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:bg-muted hover:border-primary/50 transition-all group h-full flex flex-col justify-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{res.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-medium">
                          <span>{res.type}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span>{res.size}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
