import { Metadata } from 'next';
import ImageResizerClient from '@/components/image-resizer-client';

export const metadata: Metadata = {
  title: 'Resize Image Online | AI Image Resizer Free',
  description: 'Resize JPG, PNG, WEBP, AVIF and other images online with AI-powered scaling, batch processing, social media presets and enterprise-grade performance.',
};

export default function ResizeImagePage() {
  return <ImageResizerClient />;
}
