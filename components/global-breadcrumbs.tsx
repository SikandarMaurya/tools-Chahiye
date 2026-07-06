'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from './breadcrumbs';

export function GlobalBreadcrumbs() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-2">
      <Breadcrumbs />
    </div>
  );
}
