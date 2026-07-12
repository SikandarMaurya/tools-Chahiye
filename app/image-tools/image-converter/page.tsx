import { Metadata } from 'next';
import ImageConverterClient from '@/components/image-converter-client';

export const metadata: Metadata = {
  title: 'Universal Image Converter Online | Convert JPG, PNG, WebP, AVIF & More',
  description: 'Convert images between JPG, PNG, WebP, AVIF, BMP, TIFF, ICO and more using AI-powered optimization, batch conversion and enterprise-grade processing.',
};

export default function ImageConverterPage() {
  return <ImageConverterClient />;
}
