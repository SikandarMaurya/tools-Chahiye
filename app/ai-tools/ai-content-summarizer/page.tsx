import ContentSummarizer from '@/components/content-summarizer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free AI Content Summarizer Online',
  description: 'Summarize articles, reports, PDFs and documents instantly with AI. Generate concise, accurate summaries, bullet points and key takeaways.',
};

export default function ContentSummarizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'AI Content Summarizer',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              description: 'Free AI Content Summarizer. Summarize long texts, articles, and documents into clear, concise summaries.',
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
                  name: 'AI Content Summarizer',
                  item: 'https://toolschahiye.com/ai-content-summarizer',
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Is it free?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, this tool is free to use for summarizing text and documents.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which file formats are supported?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'We support TXT, PDF, DOCX, and MD file formats.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Can I summarize PDFs?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes! Simply upload your PDF and our tool will extract and summarize the text.',
                  },
                },
              ],
            },
          ]),
        }}
      />
      <ContentSummarizer />
    </>
  );
}
