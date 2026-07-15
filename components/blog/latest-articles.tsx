import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

export default function LatestArticles({ articles }: { articles: any[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold font-display tracking-tight">Latest Articles</h2>
        <div className="hidden sm:flex gap-2">
          <button className="px-4 py-2 text-sm font-medium bg-primary/10 text-primary rounded-full">Newest</button>
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-full transition-colors">Popular</button>
        </div>
      </div>
      
      <div className="space-y-6">
        {articles.map((article) => (
          <div key={article.id} className="group flex flex-col sm:flex-row gap-6 bg-card border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
            <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">Read {article.title}</span>
            </Link>
            <div className="relative sm:w-1/3 aspect-[16/10] sm:aspect-auto overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </div>
            <div className="p-6 sm:pl-0 sm:w-2/3 flex flex-col justify-center relative">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {article.readingTime}
                </span>
              </div>
              <h3 className="text-xl font-bold font-display mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                  <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{article.author.name}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <button className="px-6 py-3 rounded-full border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
          Load More Articles
        </button>
      </div>
    </section>
  );
}
