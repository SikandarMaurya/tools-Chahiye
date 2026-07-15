import { Metadata } from 'next';
import { CookieClient } from '@/components/cookie/cookie-client';

export const metadata: Metadata = {
  title: 'Cookie Policy | toolschahiye',
  description: 'Learn how cookies help improve your experience while keeping your data secure.',
  alternates: {
    canonical: '/cookie',
  }
};

export default function CookiePage() {
  return <CookieClient />;
}
