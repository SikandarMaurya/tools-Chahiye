'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { toolsData } from '@/lib/tools';

import { Suspense } from "react";

export default function Breadcrumbs() {
  return (
    <Suspense fallback={<div className="h-4" />}>
      <BreadcrumbsInner />
    </Suspense>
  );
}

function BreadcrumbsInner() {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page
  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);
  
  let breadcrumbs = [];
  
  if (paths.length > 0) {
    const categoryId = paths[0];
    const category = toolsData.find(c => c.id === categoryId);
    
    if (category) {
      breadcrumbs.push({
        name: category.name,
        href: category.href
      });
      
      if (paths.length > 1) {
        const toolId = paths[1];
        const tool = category.tools.find(t => t.id === toolId);
        
        if (tool) {
          breadcrumbs.push({
            name: tool.title,
            href: tool.href
          });
        }
      }
    } else {
      // Fallback for non-tool pages like /about, /categories
      breadcrumbs = paths.map((path, index) => {
        const href = '/' + paths.slice(0, index + 1).join('/');
        const name = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
        return { name, href };
      });
    }
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center">
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <div key={crumb.href} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
            {isLast ? (
              <span className="font-medium text-foreground" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <Link href={crumb.href} className="hover:text-foreground transition-colors">
                {crumb.name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
