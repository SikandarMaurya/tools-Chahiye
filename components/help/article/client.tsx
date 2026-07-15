'use client';

import { motion } from 'framer-motion';
import { Clock, Calendar, User, BookOpen, ChevronRight, ChevronLeft, Hash, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import ArticleSidebar from './sidebar';

export default function ArticleClient({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-background text-foreground pb-24">
      {/* Article Header */}
      <section className="pt-32 pb-12 bg-muted/30 border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link>
            <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
            <Link href="/help/category/pdf-tools" className="hover:text-foreground transition-colors">PDF Tools</Link>
            <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
            <span className="text-foreground font-medium truncate">{title}</span>
          </nav>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              Beginner Guide
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight max-w-4xl">
              {title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground">Sarah Jenkins</span>
                <span>(Product Expert)</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Updated Oct 15, 2024</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>4 min read</span>
              </div>
            </div>
          </motion.div>
          
        </div>
      </section>

      {/* Article Content & Sidebar */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-a:text-primary">
                
                <div id="introduction" className="lead text-xl text-muted-foreground mb-8">
                  Learn how to safely compress your PDF documents to reduce file size without sacrificing readability or image quality. Perfect for meeting email attachment limits or optimizing web uploads.
                </div>
                
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-6 rounded-r-xl mb-10 text-base">
                  <strong className="block text-blue-500 mb-2">Prerequisites</strong>
                  Make sure you are logged into your ToolsChahiye account. Free users can compress files up to 50MB, while Premium users can compress files up to 2GB.
                </div>
                
                <h2 id="step-1" className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</div>
                  Select your files
                </h2>
                
                <p>
                  Navigate to the <Link href="/pdf-tools/compress-pdf">Compress PDF</Link> tool from the main dashboard. You can add files in several ways:
                </p>
                <ul>
                  <li>Drag and drop your PDF directly into the designated area.</li>
                  <li>Click the &quot;Select PDF files&quot; button to choose from your local device.</li>
                  <li>Import directly from Google Drive or Dropbox using the cloud icons.</li>
                </ul>
                
                <figure className="my-8 rounded-2xl overflow-hidden border border-white/10 dark:border-white/5 bg-card">
                   <div className="aspect-video bg-muted flex items-center justify-center">
                     <span className="text-muted-foreground font-mono">Image Placeholder: File Selection UI</span>
                   </div>
                   <figcaption className="text-center p-3 text-sm text-muted-foreground border-t border-white/10 dark:border-white/5">
                     The file selection interface allows multiple uploads for batch processing.
                   </figcaption>
                </figure>
                
                <h2 id="step-2" className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</div>
                  Choose compression level
                </h2>
                
                <p>
                  Once your files are uploaded, you&apos;ll need to select a compression level. We offer three distinct options tailored to different needs:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 not-prose">
                  <div className="p-4 rounded-xl border border-white/10 bg-card">
                    <h4 className="font-bold mb-2">Extreme Compression</h4>
                    <p className="text-sm text-muted-foreground mb-2">Smallest file size. Images will be downsampled significantly.</p>
                    <span className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-md">Low Quality</span>
                  </div>
                  <div className="p-4 rounded-xl border border-primary bg-primary/5">
                    <h4 className="font-bold mb-2">Recommended</h4>
                    <p className="text-sm text-muted-foreground mb-2">Perfect balance of size reduction and visual quality.</p>
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md">Good Quality</span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-card">
                    <h4 className="font-bold mb-2">Less Compression</h4>
                    <p className="text-sm text-muted-foreground mb-2">Minimal size reduction. Best for preserving high-res images.</p>
                    <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md">High Quality</span>
                  </div>
                </div>

                <h2 id="step-3" className="flex items-center gap-3 text-2xl font-bold mt-12 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</div>
                  Download and verify
                </h2>
                
                <p>
                  Click the <strong>Compress PDF</strong> button to start the process. Our cloud servers will optimize your document within seconds. Once complete, you will see a summary of how much space was saved.
                </p>
                <p>
                  You can download the compressed file, save it back to your cloud storage, or share a secure download link directly from the success page.
                </p>
                
                <hr className="my-12 border-white/10 dark:border-white/5" />
                
                <h2 id="troubleshooting" className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-yellow-500" />
                  Troubleshooting
                </h2>
                
                <div className="space-y-6 not-prose">
                  <details className="bg-card border border-white/10 rounded-xl group">
                    <summary className="font-medium p-4 cursor-pointer hover:text-primary transition-colors">
                      File size is still too large after compression
                    </summary>
                    <div className="p-4 pt-0 text-muted-foreground text-sm border-t border-white/5 mt-2">
                      If the file didn&apos;t shrink significantly, it might already be highly optimized, or it contains complex vector graphics that cannot be compressed further without rasterization. Try the &quot;Extreme&quot; setting.
                    </div>
                  </details>
                  <details className="bg-card border border-white/10 rounded-xl group">
                    <summary className="font-medium p-4 cursor-pointer hover:text-primary transition-colors">
                      Text looks blurry after compression
                    </summary>
                    <div className="p-4 pt-0 text-muted-foreground text-sm border-t border-white/5 mt-2">
                      This happens if the original PDF consisted of scanned images rather than actual text. Use the &quot;Less Compression&quot; setting, or use our OCR tool first to convert the images to text.
                    </div>
                  </details>
                </div>
                
              </article>
              
              {/* Next/Prev Navigation */}
              <div className="flex flex-col sm:flex-row gap-4 justify-between mt-16 pt-8 border-t border-white/10 dark:border-white/5">
                 <Link href="#" className="flex-1 p-6 rounded-2xl bg-card border border-white/10 hover:border-primary/50 transition-colors group">
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                     <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Previous
                   </div>
                   <div className="font-medium group-hover:text-primary transition-colors">How to Merge Multiple PDFs</div>
                 </Link>
                 <Link href="#" className="flex-1 p-6 rounded-2xl bg-card border border-white/10 hover:border-primary/50 transition-colors group text-right">
                   <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-end gap-1">
                     Next <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                   </div>
                   <div className="font-medium group-hover:text-primary transition-colors">Protecting PDFs with Passwords</div>
                 </Link>
              </div>
              
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <ArticleSidebar />
            </div>
            
          </div>
        </div>
      </section>
      
    </main>
  );
}
