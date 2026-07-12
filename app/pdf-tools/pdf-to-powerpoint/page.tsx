import { Metadata } from 'next';
import PdfToPowerpointClient from '@/components/pdf-to-powerpoint-client';

export const metadata: Metadata = {
  title: 'PDF to PowerPoint Converter Online | Convert PDF to Editable PPT',
  description: 'Convert PDF files into editable PowerPoint presentations with AI-powered slide detection, OCR, layout preservation and responsive cloud processing.',
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
              name: 'PDF to PowerPoint Converter',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Convert PDF files into editable PowerPoint presentations with AI-powered slide detection, OCR, layout preservation and responsive cloud processing.',
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
                  name: 'PDF to PowerPoint',
                  item: 'https://toolschahiye.com/pdf-tools/pdf-to-powerpoint',
                }
              ],
            }
          ]),
        }}
      />
      <PdfToPowerpointClient />
    </>
  );
}
