"use client";

import { motion, useScroll, useSpring } from 'framer-motion';
import { HeroSection } from './hero-section';
import { QuickSummary } from './quick-summary';
import { TableOfContents } from './table-of-contents';
import { ContentSections } from './content-sections';
import { FAQSection } from './faq-section';
import { TrustSection } from './trust-section';
import { FinalCTA } from './final-cta';

export function PrivacyClient() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-blue-600 origin-left z-50"
        style={{ scaleX }}
      />
      
      <HeroSection />
      
      <div className="container mx-auto px-4 py-20 max-w-7xl">
        <QuickSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-20 relative">
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <TableOfContents />
            </div>
          </div>
          
          <div className="lg:col-span-9 space-y-24">
            <ContentSections />
            <FAQSection />
            <TrustSection />
          </div>
        </div>
      </div>
      
      <FinalCTA />
    </div>
  );
}
