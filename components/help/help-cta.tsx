'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

export default function HelpCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-card border border-white/10 dark:border-white/5 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Need More Help?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              If you couldn&apos;t find the answer you were looking for, our support team is standing by to assist you.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/contact" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-xl transition-colors gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
              >
                Contact Support Team
              </Link>
              <Link 
                href="/help/articles" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-xl transition-colors gap-2"
              >
                Browse All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10 dark:border-white/5 max-w-md mx-auto">
              <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Subscribe to updates
              </h3>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-grow bg-background border border-white/10 dark:border-white/5 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
                />
                <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">Get the latest feature updates and tutorials.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
