import { Metadata } from 'next';
import { FileText, Image as ImageIcon, ArrowRight } from 'lucide-react';
import JpgToPdfClient from '@/components/jpg-to-pdf-client';

export const metadata: Metadata = {
  title: 'Universal Image to PDF Converter | JPG, PNG, WEBP, HEIC to PDF',
  description: 'Convert JPG, PNG, WEBP, AVIF, BMP, TIFF and HEIC images into professional PDF documents with AI enhancement, drag-and-drop sorting and batch conversion.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <div className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-1" />
                <ArrowRight className="w-4 h-4 mx-1" />
                <FileText className="w-5 h-5 ml-1" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Image to PDF Engine</h1>
              <p className="text-muted-foreground mt-1">Universal image converter with professional AI-ready quality.</p>
            </div>
          </div>
        </div>
      </div>
      
      <JpgToPdfClient />
    </div>
  );
}
