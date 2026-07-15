'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const popularSearches = [
  "Merge PDF files",
  "Compress large images",
  "Cancel subscription",
  "Remove background",
  "API limits"
];

export default function HelpHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  return (
    <section className="relative pt-32 pb-24 overflow-hidden border-b border-white/5">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Support
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Find answers, tutorials and troubleshooting guides in seconds. Our smart search understands what you need.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <div className={`relative flex items-center bg-card border rounded-2xl transition-all duration-300 ${isFocused ? 'ring-2 ring-primary border-primary shadow-2xl shadow-primary/20' : 'border-white/10 dark:border-white/5 shadow-xl hover:border-primary/50'}`}>
            <Search className={`absolute left-6 w-6 h-6 transition-colors ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
            <input
              type="text"
              placeholder="Describe your issue or search for a tool..."
              className="w-full bg-transparent border-none py-6 pl-16 pr-24 outline-none text-lg rounded-2xl placeholder:text-muted-foreground/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button className="absolute right-4 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors">
              <Mic className="w-5 h-5" />
            </button>
          </div>
          
          {/* Mock Autocomplete Dropdown (if focused and typing) */}
          {isFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 dark:border-white/5 rounded-2xl shadow-2xl overflow-hidden z-50 text-left">
              <div className="p-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Suggested Articles</div>
                {['How to merge PDF files on mobile', 'Merge PDF API Documentation', 'Troubleshooting: PDF merge failed'].map((item, i) => (
                  <button key={i} className="w-full text-left px-4 py-3 hover:bg-muted rounded-xl flex items-center gap-3 transition-colors">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{item}</span>
                  </button>
                ))}
              </div>
              <div className="bg-muted/50 p-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Press Enter to see all results</span>
                <span className="text-xs font-medium text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  Search with AI <Sparkles className="w-3 h-3" />
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Popular Searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <span className="text-sm text-muted-foreground font-medium">Popular:</span>
          {popularSearches.map((term) => (
            <Link
              key={term}
              href={`/help/search?q=${encodeURIComponent(term)}`}
              className="px-4 py-1.5 rounded-full bg-card/50 border border-white/10 dark:border-white/5 text-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            >
              {term}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
