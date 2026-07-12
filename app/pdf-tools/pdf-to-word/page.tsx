import { Metadata } from 'next';
import PdfToWordClient from '@/components/pdf-to-word-client';

export const metadata: Metadata = {
  title: 'PDF to Word Converter Online Free | Convert PDF to Editable DOCX',
  description: 'Convert PDF files into editable Word documents online with AI-powered layout preservation, OCR support, and high accuracy.',
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
              name: 'PDF to Word Converter',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Convert PDF files into editable Word documents online with AI-powered layout preservation, OCR support, and high accuracy.',
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
                  name: 'PDF to Word',
                  item: 'https://toolschahiye.com/pdf-tools/pdf-to-word',
                }
              ],
            }
          ]),
        }}
      />
      <PdfToWordClient />
    </>
  );
}
