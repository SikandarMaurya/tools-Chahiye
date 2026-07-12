import { Metadata } from 'next';
import ExtractPdfPagesClient from '@/components/extract-pdf-pages-client';

export const metadata: Metadata = {
  title: 'Extract PDF Pages Online | Extract Pages from PDF Free',
  description: 'Extract one or multiple pages from PDF files online with AI-powered page detection, live preview, batch export and enterprise-grade security.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Extract PDF Pages Engine</h1>
              <p className="text-muted-foreground mt-1">Professional tool to extract individual pages, selected pages or a range from your PDF.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ExtractPdfPagesClient />
    </div>
  );
}
