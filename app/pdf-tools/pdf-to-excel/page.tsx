import { Metadata } from 'next';
import PdfToExcelClient from '@/components/pdf-to-excel-client';

export const metadata: Metadata = {
  title: 'PDF to Excel Converter Online Free | Convert PDF Tables to XLSX',
  description: 'Convert PDF tables into editable Excel spreadsheets with AI-powered table detection, OCR support and high accuracy.',
};

export default function PdfToExcelPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'PDF to Excel Converter',
              applicationCategory: 'BrowserApplication',
              operatingSystem: 'Any',
              description: 'Convert PDF tables into editable Excel spreadsheets with AI-powered table detection, OCR support and high accuracy.',
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
                  name: 'PDF to Excel',
                  item: 'https://toolschahiye.com/pdf-tools/pdf-to-excel',
                }
              ],
            }
          ]),
        }}
      />
      <PdfToExcelClient />
    </>
  );
}
