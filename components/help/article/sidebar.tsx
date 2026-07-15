'use client';

import { motion } from 'framer-motion';
import { Share2, Link as LinkIcon, Printer, Download, ThumbsUp, ThumbsDown, MessageSquare, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ArticleSidebar() {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="sticky top-24 space-y-8">
      {/* Table of Contents */}
      <div className="bg-card border border-white/10 dark:border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">On this page</h3>
        <ul className="space-y-3 text-sm">
          <li><a href="#introduction" className="text-primary font-medium hover:underline">Introduction</a></li>
          <li><a href="#step-1" className="text-muted-foreground hover:text-foreground transition-colors">Step 1: Select your files</a></li>
          <li><a href="#step-2" className="text-muted-foreground hover:text-foreground transition-colors">Step 2: Choose compression level</a></li>
          <li><a href="#step-3" className="text-muted-foreground hover:text-foreground transition-colors">Step 3: Download and verify</a></li>
          <li><a href="#troubleshooting" className="text-muted-foreground hover:text-foreground transition-colors">Troubleshooting</a></li>
        </ul>
      </div>

      {/* Actions */}
      <div className="bg-card border border-white/10 dark:border-white/5 rounded-2xl p-6">
        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Share & Export</h3>
        <div className="space-y-2">
          <button onClick={handleCopyLink} className="flex items-center gap-3 w-full p-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-medium">
            <LinkIcon className="w-4 h-4 text-muted-foreground" />
            {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
          <button className="flex items-center gap-3 w-full p-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-medium">
            <Share2 className="w-4 h-4 text-muted-foreground" />
            Share Article
          </button>
          <button onClick={handlePrint} className="flex items-center gap-3 w-full p-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-medium">
            <Printer className="w-4 h-4 text-muted-foreground" />
            Print Article
          </button>
          <button className="flex items-center gap-3 w-full p-2.5 hover:bg-muted rounded-xl transition-colors text-sm font-medium">
            <Download className="w-4 h-4 text-muted-foreground" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Helpful Rating */}
      <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 text-center">
        <h3 className="font-semibold mb-2">Was this article helpful?</h3>
        <p className="text-xs text-muted-foreground mb-4">Your feedback helps us improve.</p>
        
        {feedback === null ? (
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setFeedback(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-white/10 dark:border-white/5 hover:border-green-500/50 hover:bg-green-500/10 rounded-xl transition-all text-sm font-medium"
            >
              <ThumbsUp className="w-4 h-4" /> Yes
            </button>
            <button 
              onClick={() => setFeedback(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-background border border-white/10 dark:border-white/5 hover:border-red-500/50 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
            >
              <ThumbsDown className="w-4 h-4" /> No
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-medium text-green-500 bg-green-500/10 py-2 rounded-lg"
          >
            Thank you for your feedback!
          </motion.div>
        )}
      </div>

    </div>
  );
}
