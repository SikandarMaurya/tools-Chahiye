import { Metadata } from 'next';
import { PrivacyClient } from '@/components/privacy/privacy-client';

export const metadata: Metadata = {
  title: 'Privacy Policy | toolschahiye',
  description: 'Learn how we collect, use and protect your information.',
  alternates: {
    canonical: '/privacy',
  }
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
