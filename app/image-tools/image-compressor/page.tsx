import { Metadata } from 'next';
import ImageCompressor from '@/components/image-compressor';

export const metadata: Metadata = {
  title: 'Free AI Image Compressor | Compress JPG, PNG, WebP & AVIF Online',
  description: 'Compress images online without losing quality. Supports JPG, PNG, WebP and AVIF with AI-powered optimization and batch compression.',
};

export default function ImageCompressorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Image Compressor',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              description: 'Compress images online without losing quality. Supports JPG, PNG, WebP and AVIF with AI-powered optimization and batch compression.',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://toolschahiye.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Image Tools',
                  item: 'https://toolschahiye.com/image-tools',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'AI Image Compressor',
                  item: 'https://toolschahiye.com/image-tools/image-compressor',
                }
              ],
            }
          ]),
        }}
      />
      <ImageCompressor />
    </>
  );
}
