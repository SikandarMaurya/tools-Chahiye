import Link from "next/link";
import { Layers, Twitter, Github, Linkedin, Wrench, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-[#6b46c1] text-white p-1.5 rounded-xl relative flex items-center justify-center w-10 h-10">
                <Wrench className="w-5 h-5 -rotate-45" strokeWidth={2.5} />
                <Sparkles className="w-3 h-3 absolute top-1.5 right-1.5 text-yellow-300 fill-yellow-300" />
              </div>
              <span className="font-bold text-2xl tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
                <span className="text-[#5a67d8]">tools</span>
                <span className="text-slate-900 dark:text-slate-100">chahiye</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-6">
              Your professional, fast, and modern platform for AI, Developer, and Utility tools.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors"><Twitter className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Github className="h-4 w-4" /></Link>
              <Link href="#" className="hover:text-foreground transition-colors"><Linkedin className="h-4 w-4" /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Categories</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/ai-tools" className="hover:text-foreground transition-colors">AI Tools</Link></li>
              <li><Link href="/developer-tools" className="hover:text-foreground transition-colors">Developer Tools</Link></li>
              <li><Link href="/pdf-tools" className="hover:text-foreground transition-colors">PDF Utilities</Link></li>
              <li><Link href="/image-tools" className="hover:text-foreground transition-colors">Image Tools</Link></li>
              <li><Link href="/seo-tools" className="hover:text-foreground transition-colors">SEO Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li><li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link></li>
              <li><Link href="/cookie" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} toolschahiye. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Status</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
