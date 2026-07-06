import { Metadata } from 'next';
import MergePdfClient from '@/components/merge-pdf-client';

export const metadata: Metadata = {
  title: 'Merge PDF Online Free | Combine Multiple PDF Files Instantly',
  description: 'Merge multiple PDF files online for free. Rearrange pages, preview documents, rotate pages and combine PDFs securely without installing software.',
};

export default function MergePdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Merge PDF',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Merge multiple PDF files online for free. Rearrange pages, preview documents, rotate pages and combine PDFs securely without installing software.',
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
                  name: 'Merge PDF',
                  item: 'https://toolschahiye.com/pdf-tools/merge-pdf',
                }
              ],
            }
          ]),
        }}
      />
      <MergePdfClient />
    </>
  );
}
