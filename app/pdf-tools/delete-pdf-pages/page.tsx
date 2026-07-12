import { Metadata } from 'next';
import DeletePdfPagesClient from '@/components/delete-pdf-pages-client';

export const metadata: Metadata = {
  title: 'Delete PDF Pages Online | Remove Pages from PDF',
  description: 'Delete single, multiple, or a range of pages from your PDF document easily and securely. Live preview and zero quality loss.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Delete PDF Pages Engine</h1>
              <p className="text-muted-foreground mt-1">Professional tool to remove individual pages, selected pages or a range from your PDF.</p>
            </div>
          </div>
        </div>
      </div>
      
      <DeletePdfPagesClient />
    </div>
  );
}
