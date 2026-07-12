import { Metadata } from 'next';
import ReorderPdfPagesClient from '@/components/reorder-pdf-pages-client';

export const metadata: Metadata = {
  title: 'Reorder PDF Pages Online | Organize PDF Pages Free',
  description: 'Reorder PDF pages online with drag-and-drop editing, live preview, AI document organization, batch page management and enterprise-grade security.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="m3 15 3-3 3 3"/><path d="M6 12v10"/><path d="m21 15-3-3-3 3"/><path d="M18 12v10"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Reorder PDF Pages Engine</h1>
              <p className="text-muted-foreground mt-1">Professional tool to organize, copy, duplicate, rotate, and delete PDF pages.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ReorderPdfPagesClient />
    </div>
  );
}
