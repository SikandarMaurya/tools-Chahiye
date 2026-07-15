'use client';

import { motion } from 'framer-motion';
import { Activity, CheckCircle, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SystemStatus() {
  return (
    <section className="py-12 bg-muted/30 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card border border-white/10 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                All Systems Operational
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Updated just now
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 px-6 py-2 border-x border-transparent md:border-white/10 dark:md:border-white/5">
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">API Status</div>
              <div className="text-sm font-bold text-green-500 flex items-center gap-1 justify-center">
                <Activity className="w-3.5 h-3.5" /> 100%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Processing Engines</div>
              <div className="text-sm font-bold text-green-500 flex items-center gap-1 justify-center">
                <Activity className="w-3.5 h-3.5" /> 100%
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-1">Storage Network</div>
              <div className="text-sm font-bold text-green-500 flex items-center gap-1 justify-center">
                <Activity className="w-3.5 h-3.5" /> 100%
              </div>
            </div>
          </div>

          <div>
            <Link 
              href="https://status.toolschahiye.com" 
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground hover:bg-secondary/80 font-medium text-sm rounded-lg transition-colors"
            >
              View Status Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
