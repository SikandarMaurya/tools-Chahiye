import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden border-b bg-muted/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-background to-background pointer-events-none" />
      <div className="absolute top-0 left-0 -mt-20 -ml-20 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 -mb-20 -mr-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-background rounded-2xl flex items-center justify-center shadow-sm border mb-8"
          >
            <Cookie className="w-10 h-10 text-orange-500" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-display tracking-tight mb-6"
          >
            Cookie Policy
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10"
          >
            Learn how cookies help improve your experience while keeping your data secure.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground bg-background/50 backdrop-blur-md py-3 px-6 rounded-full border shadow-sm"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div>Version 1.2.0</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
