import { Metadata } from 'next';
import { PowerPointToPdfClient } from '@/components/powerpoint-to-pdf-client';

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter Online | Convert PPT & PPTX to PDF',
  description: 'Convert PowerPoint presentations into professional PDF documents with high-quality layout preservation, batch conversion and AI-powered optimization.',
};

export default function Page() {
  return <PowerPointToPdfClient />;
}
