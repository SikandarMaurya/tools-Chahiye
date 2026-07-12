import { Metadata } from 'next';
import ProtectPdfClient from '@/components/protect-pdf-client';

export const metadata: Metadata = {
  title: 'Protect PDF Online | Add Password & Secure PDF Files',
  description: 'Protect PDF files online with password encryption, permission controls, AES security, batch processing and enterprise-grade PDF protection.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Protect PDF Engine</h1>
              <p className="text-muted-foreground mt-1">Enterprise-grade tool to secure your PDF with passwords and permissions.</p>
            </div>
          </div>
        </div>
      </div>
      
      <ProtectPdfClient />
    </div>
  );
}
