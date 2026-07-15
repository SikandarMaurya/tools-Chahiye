import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TrendingArticles({ articles }: { articles: any[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold font-display tracking-tight">Trending Now</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <Link href={`/blog/${article.slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">Read {article.title}</span>
            </Link>
            
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-sm text-xs font-semibold uppercase tracking-wider shadow-sm">
                  {article.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold font-display leading-tight mb-3 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                {article.excerpt}
              </p>
              
              <div className="flex items-center justify-between mt-auto text-xs text-muted-foreground font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    {(article.views / 1000).toFixed(1)}k views
                  </span>
                </div>
                <span>
                  {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
