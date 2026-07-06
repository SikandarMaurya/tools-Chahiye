import AiImageGenerator from '@/components/ai-image-generator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Image Generator Online | Create Images from Text',
  description: 'Generate stunning AI images, thumbnails, logos, wallpapers and artwork from text prompts using advanced AI models.',
};

export default function AiImageGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Image Generator',
              applicationCategory: 'MultimediaApplication',
              operatingSystem: 'Any',
              description: 'Generate stunning AI images, thumbnails, logos, wallpapers and artwork from text prompts using advanced AI models.',
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
                  name: 'AI Image Generator',
                  item: 'https://toolschahiye.com/ai-image-generator',
                },
              ],
            }
          ]),
        }}
      />
      <AiImageGenerator />
    </>
  );
}
