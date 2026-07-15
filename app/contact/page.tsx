import { Metadata } from 'next';
import { ContactClient } from '@/components/contact/client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Contact Us | Premium Support & Sales',
  description: 'Get in touch with our team. We offer 24/7 world-class support, enterprise sales inquiries, and global office locations.',
  openGraph: {
    title: 'Contact Us | Premium Support & Sales',
    description: 'Get in touch with our team. We offer 24/7 world-class support, enterprise sales inquiries, and global office locations.',
    type: 'website',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Support & Sales",
    "description": "Get in touch with our team for support, sales, or partnerships.",
    "mainEntity": {
      "@type": "Organization",
      "name": "ToolsChahiye",
      "url": "https://toolschahiye.com",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+1-800-123-4567",
          "contactType": "customer support",
          "email": "support@toolschahiye.com",
          "availableLanguage": ["English", "Hindi"]
        },
        {
          "@type": "ContactPoint",
          "telephone": "+1-800-123-4568",
          "contactType": "sales",
          "email": "sales@toolschahiye.com"
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <ContactClient />
      <Footer />
    </>
  );
}
