import { Metadata } from 'next';
import UnlockPdfClient from '@/components/unlock-pdf-client';

export const metadata: Metadata = {
  title: 'Unlock PDF Online | Remove Passwords & Security',
  description: 'Unlock password-protected PDF files online. Remove encryption, security restrictions, and owner passwords to edit and print PDFs freely.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <div className="text-primary w-8 h-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Unlock PDF Engine</h1>
              <p className="text-muted-foreground mt-1">Enterprise-grade tool to remove passwords and security restrictions from your PDF files.</p>
            </div>
          </div>
        </div>
      </div>
      
      <UnlockPdfClient />
    </div>
  );
}
