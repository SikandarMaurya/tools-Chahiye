import RegexTester from '@/components/regex-tester';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Regex Tester & Regular Expression Validator',
  description: 'Test, debug and validate regular expressions online with live matching, explanations, templates and search & replace.',
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
              name: 'Regex Tester',
              applicationCategory: 'DeveloperApplication',
              operatingSystem: 'Any',
              description: 'Free online Regex Tester and Validator with real-time matching, explanations, and templates.',
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
                  name: 'Regex Tester',
                  item: 'https://toolschahiye.com/regex-tester',
                },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is Regex?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Regex (Regular Expression) is a sequence of characters that specifies a search pattern in text.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Which Regex engine is used?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'This tool uses the standard JavaScript (V8/Browser) RegExp engine running directly in your browser.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Are my patterns stored?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'No, all processing is done locally in your browser. Nothing is sent to a server.',
                  },
                },
              ],
            },
          ]),
        }}
      />
      <RegexTester />
    </>
  );
}
