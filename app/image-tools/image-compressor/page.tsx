import { Metadata } from 'next';
import ImageCompressor from '@/components/image-compressor';

export const metadata: Metadata = {
  title: 'Compress Image Online | AI Image Compressor Free',
  description: 'Compress JPG, PNG, WEBP, AVIF and other image formats online using AI-powered optimization with batch compression and enterprise-grade performance.',
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Smart Image Compressor',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              description: 'Compress JPG, PNG, WEBP, AVIF and other image formats online using AI-powered optimization with batch compression and enterprise-grade performance.',
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
                  name: 'Smart Image Compressor',
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
