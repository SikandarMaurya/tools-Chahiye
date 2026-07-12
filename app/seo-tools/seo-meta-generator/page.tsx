import SeoMetaGenerator from '@/components/seo-meta-generator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI SEO Meta Tag Generator | Generate Meta Tags, Open Graph & Schema',
  description: 'Generate SEO meta tags, Open Graph tags, Twitter Cards, JSON-LD schema, canonical URLs and optimize your website with AI.',
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
              name: 'AI SEO Meta Generator',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              description: 'Generate complete SEO elements for your web page including Meta tags, Open Graph, Twitter Cards, and Schema markup.',
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
                  name: 'AI SEO Meta Generator',
                  item: 'https://toolschahiye.com/seo-meta-generator',
                },
              ],
            }
          ]),
        }}
      />
      <SeoMetaGenerator />
    </>
  );
}
