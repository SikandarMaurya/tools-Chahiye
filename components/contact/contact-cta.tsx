'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function ContactCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-white/10 dark:border-white/5 rounded-3xl p-12 shadow-2xl overflow-hidden relative"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Still need help?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Our support team is standing by to assist you with any questions or technical issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/help" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors gap-2">
                Browse Help Center
              </Link>
              <Link href="/community" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors gap-2">
                Join Community
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
