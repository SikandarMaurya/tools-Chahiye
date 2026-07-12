'use client';

import { usePathname } from 'next/navigation';
import Breadcrumbs from './breadcrumbs';

import { Suspense } from "react";

export default function GlobalBreadcrumbs() {
  return (
    <Suspense fallback={<div className="h-10" />}>
      <GlobalBreadcrumbsInner />
    </Suspense>
  );
}

function GlobalBreadcrumbsInner() {
  const pathname = usePathname();
  
  if (pathname === '/') return null;
  
  return (
    <div className="container mx-auto px-4 pt-6 pb-2">
      <Breadcrumbs />
    </div>
  );
}
