import { Metadata } from 'next';
import { Code, Copy, Trash2, Check, Download } from 'lucide-react';
import JsonBeautifierClient from './client';

export const metadata: Metadata = {
  title: 'JSON Beautifier | Format and Validate JSON | ToolsChahiye',
  description: 'Format, validate, and beautify JSON data online.',
};

export default function JsonBeautifierPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Code className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">JSON Beautifier</h1>
              <p className="text-muted-foreground mt-1">Format, validate, and beautify your JSON data instantly.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <JsonBeautifierClient />
      </div>
    </div>
  );
}
