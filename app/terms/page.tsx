import { Metadata } from 'next';
import { TermsClient } from '@/components/terms/terms-client';

export const metadata: Metadata = {
  title: 'Terms & Conditions | toolschahiye',
  description: 'Please read these terms carefully before using our platform.',
  alternates: {
    canonical: '/terms',
  }
};

export default function TermsPage() {
  return <TermsClient />;
}
