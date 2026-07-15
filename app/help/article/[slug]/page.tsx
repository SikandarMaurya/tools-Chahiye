import { Metadata } from 'next';
import ArticleClient from '@/components/help/article/client';



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // In a real app, fetch article details based on slug
  const title = "How to Compress PDF Files Without Losing Quality";
  const description = "Learn how to safely compress your PDF documents to reduce file size without sacrificing readability or image quality.";
  
  return {
    title: `${title} | ToolsChahiye Help Center`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    }
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Simulated article data
  const title = "How to Compress PDF Files Without Losing Quality";
  const description = "Learn how to safely compress your PDF documents to reduce file size without sacrificing readability or image quality.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": "Sarah Jenkins"
    },
    "datePublished": "2024-10-15T08:00:00+08:00",
    "dateModified": "2024-10-15T08:00:00+08:00",
    "publisher": {
      "@type": "Organization",
      "name": "ToolsChahiye",
      "logo": {
        "@type": "ImageObject",
        "url": "https://toolschahiye.com/logo.png"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <ArticleClient title={title} />
      
    </>
  );
}
