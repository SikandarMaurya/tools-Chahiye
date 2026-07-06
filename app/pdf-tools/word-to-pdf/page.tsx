import { Metadata } from 'next';
import WordToPdfClient from '@/components/word-to-pdf-client';

export const metadata: Metadata = {
  title: 'Word to PDF Converter Online Free | Convert DOC & DOCX to PDF',
  description: 'Convert Word documents to professional PDF files online. Preserve formatting, fonts, tables and images with high-quality PDF generation.',
};

export default function WordToPdfPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Word to PDF Converter',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Convert Word documents to professional PDF files online. Preserve formatting, fonts, tables and images with high-quality PDF generation.',
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
                  name: 'Word to PDF',
                  item: 'https://toolschahiye.com/pdf-tools/word-to-pdf',
                }
              ],
            }
          ]),
        }}
      />
      <WordToPdfClient />
    </>
  );
}
