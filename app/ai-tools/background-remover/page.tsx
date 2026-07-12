import { Metadata } from 'next';
import { Image as ImageIcon, Zap, Upload } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Image Background Remover | ToolsChahiye',
  description: 'Remove background from any image instantly using AI.',
};

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Image Background Remover</h1>
              <p className="text-muted-foreground mt-1">Remove backgrounds automatically with precision.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="border-2 border-dashed rounded-2xl p-16 text-center transition-all border-border bg-card hover:border-primary/50 hover:bg-muted/50 cursor-pointer">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-semibold mb-2">Upload Image to Remove Background</h3>
          <p className="text-muted-foreground mb-8">Works with JPG, PNG, WebP (Max 10MB)</p>
          <button className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors">
            Select Image
          </button>
        </div>
        
        <div className="mt-8 text-center text-muted-foreground p-6 bg-muted/30 rounded-xl border">
          <p className="text-sm">Server-side AI models processing is temporarily unavailable. Interface restored.</p>
        </div>
      </div>
    </div>
  );
}
