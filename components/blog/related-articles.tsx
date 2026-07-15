import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

export default function RelatedArticles({ articles }: { articles: any[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {articles.map((article) => (
        <div key={article.id} className="group relative flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
          <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10">
            <span className="sr-only">Read {article.title}</span>
          </Link>
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{article.category}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readingTime}</span>
            </div>
            <h3 className="text-lg font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
              {article.title}
            </h3>
            <div className="mt-auto pt-4 flex items-center gap-3">
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{article.author.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
