import { Metadata } from 'next';
import CompressPdfClient from '@/components/compress-pdf-client';

export const metadata: Metadata = {
  title: 'Compress PDF Online Free | Reduce PDF File Size Without Losing Quality',
  description: 'Compress PDF files online with smart optimization. Reduce file size while maintaining quality using advanced compression techniques.',
};

export default function CompressPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Compress PDF',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Compress PDF files online with smart optimization. Reduce file size while maintaining quality using advanced compression techniques.',
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
                  name: 'PDF Utilities',
                  item: 'https://toolschahiye.com/pdf-tools',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Compress PDF',
                  item: 'https://toolschahiye.com/pdf-tools/compress-pdf',
                }
              ],
            }
          ]),
        }}
      />
      <CompressPdfClient />
    </>
  );
}
