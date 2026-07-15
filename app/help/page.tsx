import { Metadata } from 'next';
import { HelpClient } from '@/components/help/client';



export const metadata: Metadata = {
  title: 'Help Center | Tutorials & Documentation',
  description: 'Find answers, video tutorials, API documentation and troubleshooting guides for our premium AI-powered tools platform.',
  openGraph: {
    title: 'Help Center | ToolsChahiye',
    description: 'Find answers, video tutorials, API documentation and troubleshooting guides for our premium AI-powered tools platform.',
    type: 'website',
  },
  alternates: {
    canonical: '/help',
  },
};

export default function HelpPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I cancel my subscription?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can cancel your subscription at any time from your Account Settings. Go to Billing > Subscription and click on Cancel Subscription."
        }
      },
      {
        "@type": "Question",
        "name": "Is my data secure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. All file transfers are encrypted using AES-256 SSL. Files uploaded for processing are automatically permanently deleted from our servers within 2 hours."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <HelpClient />
      
    </>
  );
}
