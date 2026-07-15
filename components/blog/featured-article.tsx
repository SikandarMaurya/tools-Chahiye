import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FeaturedArticle({ article }: { article: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-card border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative aspect-video lg:aspect-auto lg:h-full overflow-hidden">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" /> {article.readingTime}
            </span>
          </div>
          <Link href={`/blog/${article.slug}`}>
            <h2 className="text-3xl md:text-4xl font-bold font-display tracking-tight mb-4 group-hover:text-primary transition-colors">
              {article.title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-lg mb-8 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-sm">
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-medium">{article.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <Link 
              href={`/blog/${article.slug}`}
              className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              Read Article
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
