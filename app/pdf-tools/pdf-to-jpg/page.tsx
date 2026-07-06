import { Metadata } from 'next';
import { FileText, Image as ImageIcon, ArrowRight, Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PDF to JPG Converter | ToolsChahiye',
  description: 'Convert PDF pages to high-quality JPG images online for free.',
};

export default function PdfToJpgPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-1" />
                <ArrowRight className="w-4 h-4 mx-1" />
                <ImageIcon className="w-5 h-5 ml-1" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">PDF to JPG</h1>
              <p className="text-muted-foreground mt-1">Extract pages from PDF to high-quality images.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Drag & Drop PDF here</h3>
          <p className="text-muted-foreground mb-8">Or click to browse from your device</p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select PDF File
          </button>
        </div>
        
        <div className="mt-8 text-center text-muted-foreground p-6 bg-muted/30 rounded-xl border">
          <p className="text-sm">Client-side PDF to image processor is currently being restored. Interface placeholder active.</p>
        </div>
      </div>
    </div>
  );
}
