import { Metadata } from 'next';
import RotatePdfClient from '@/components/rotate-pdf-client';

export const metadata: Metadata = {
  title: 'Rotate PDF Online Free | Rotate PDF Pages Instantly',
  description: 'Rotate PDF pages online without losing quality. Rotate entire documents or selected pages with live preview, AI orientation detection and batch processing.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Rotate PDF Pages Engine</h1>
              <p className="text-muted-foreground mt-1">Professional tool to rotate individual pages, selected pages or the entire PDF.</p>
            </div>
          </div>
        </div>
      </div>
      
      <RotatePdfClient />
    </div>
  );
}
