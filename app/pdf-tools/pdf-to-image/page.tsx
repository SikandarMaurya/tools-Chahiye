import { Metadata } from 'next';
import PDFToImageClient from '@/components/pdf-to-image-client';

export const metadata: Metadata = {
  title: 'Universal PDF to Image Converter | Convert PDF to JPG, PNG, WebP & TIFF',
  description: 'Convert PDF pages into JPG, PNG, WebP, AVIF and TIFF images with AI-powered rendering, high DPI export and batch processing.',
};

export default function Page() {
  return <PDFToImageClient />;
}
