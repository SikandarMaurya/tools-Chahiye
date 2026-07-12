import { Metadata } from 'next';
import SplitPdfClient from '@/components/split-pdf-client';

export const metadata: Metadata = {
  title: 'Split PDF Online Free | Extract Pages from PDF Instantly',
  description: 'Split PDF files online for free. Extract selected pages, split by page range, or divide PDFs into multiple documents securely.',
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
              name: 'Split PDF',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Split PDF files online for free. Extract selected pages, split by page range, or divide PDFs into multiple documents securely.',
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
                  name: 'Split PDF',
                  item: 'https://toolschahiye.com/pdf-tools/split-pdf',
                }
              ],
            }
          ]),
        }}
      />
      <SplitPdfClient />
    </>
  );
}
