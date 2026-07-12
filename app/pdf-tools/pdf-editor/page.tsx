import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PdfEditorClient = dynamic(() => import('@/components/pdf-editor-client'), {
  ssr: false,
});

export const metadata: Metadata = {
  title: 'Edit PDF Online Free | Enterprise AI PDF Editor',
  description: 'Edit PDF online with AI-powered text editing, image editing, OCR, annotations, signatures, forms, page management and enterprise-grade security.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">PDF Editor</h1>
              <p className="text-muted-foreground mt-1">Enterprise Visual PDF Workspace with AI</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col relative">
        <PdfEditorClient />
      </div>
    </div>
  );
}
