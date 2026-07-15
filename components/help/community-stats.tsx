'use client';

import { motion } from 'framer-motion';
import { Users, MessagesSquare, Code, Globe, CheckCircle2, Search, Smile } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Articles', value: '850+', icon: Search },
  { label: 'Countries Supported', value: '195', icon: Globe },
  { label: 'Issues Resolved', value: '2.4M', icon: CheckCircle2 },
  { label: 'Satisfaction Rate', value: '98.5%', icon: Smile },
];

export default function CommunityStats() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Community Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/10 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 text-[#5865F2] flex items-center justify-center mb-6">
                  <MessagesSquare className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Join our Community</h3>
                <p className="text-muted-foreground mb-8">
                  Connect with thousands of other users, share tips, report bugs, and get early access to new features.
                </p>
                <Link 
                  href="/community"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-xl transition-colors"
                >
                  Join the Discord Server
                </Link>
             </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-white/10 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6">
                  <Code className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Developer Forum</h3>
                <p className="text-muted-foreground mb-8">
                  Discuss API integrations, share scripts, and collaborate on open-source ToolsChahiye extensions.
                </p>
                <Link 
                  href="/developers/forum"
                  className="inline-flex items-center justify-center px-6 py-3 bg-card border border-white/10 hover:bg-muted text-foreground font-medium rounded-xl transition-colors"
                >
                  Visit Developer Forum
                </Link>
             </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
