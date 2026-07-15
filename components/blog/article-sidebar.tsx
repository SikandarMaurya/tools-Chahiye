import { Share2, Link as LinkIcon, Twitter, Linkedin, Facebook, Bookmark } from 'lucide-react';
import NewsletterCTA from './newsletter-cta';

export default function ArticleSidebar() {
  return (
    <>
      <div className="bg-card border rounded-2xl p-6">
        <h3 className="font-bold font-display text-lg mb-4">Table of Contents</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-primary transition-colors block">Introduction</a></li>
          <li><a href="#" className="hover:text-primary transition-colors block">Why Compress PDFs?</a></li>
          <li><a href="#" className="hover:text-primary transition-colors block pl-4">Top Techniques</a></li>
          <li><a href="#" className="hover:text-primary transition-colors block">Step-by-Step Guide</a></li>
          <li><a href="#" className="hover:text-primary transition-colors block">Conclusion</a></li>
        </ul>
      </div>

      <div className="bg-card border rounded-2xl p-6">
        <h3 className="font-bold font-display text-lg mb-4">Share this article</h3>
        <div className="flex flex-wrap gap-2">
          <button className="p-2.5 rounded-xl border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group" aria-label="Share on Twitter">
            <Twitter className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          </button>
          <button className="p-2.5 rounded-xl border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group" aria-label="Share on LinkedIn">
            <Linkedin className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          </button>
          <button className="p-2.5 rounded-xl border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group" aria-label="Share on Facebook">
            <Facebook className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          </button>
          <button className="p-2.5 rounded-xl border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group" aria-label="Copy Link">
            <LinkIcon className="w-5 h-5 opacity-70 group-hover:opacity-100" />
          </button>
          <div className="w-px h-10 bg-border mx-1 hidden sm:block" />
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 p-2.5 rounded-xl border bg-background hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all group" aria-label="Bookmark">
            <Bookmark className="w-5 h-5 opacity-70 group-hover:opacity-100" />
            <span className="text-sm font-medium sm:hidden">Save</span>
          </button>
        </div>
      </div>

      <NewsletterCTA variant="sidebar" />
    </>
  );
}
