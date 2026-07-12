import { Metadata } from 'next';
import OcrPdfClient from '@/components/ocr-pdf-client';

export const metadata: Metadata = {
  title: 'OCR PDF Online | Extract Text from Scanned PDFs with AI',
  description: 'Extract editable text from scanned PDF files using AI OCR. Convert PDFs into searchable documents, Word, Excel, Text and more with enterprise-grade accuracy.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15-2 3"/><path d="m11 15 2 3"/><path d="M8 17h4"/><path d="M15 15h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2v-5z"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI OCR Engine</h1>
              <p className="text-muted-foreground mt-1">Enterprise-grade AI to extract text from scanned PDFs, images, and documents.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col relative">
        <OcrPdfClient />
      </div>
    </div>
  );
}
