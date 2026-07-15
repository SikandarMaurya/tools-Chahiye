'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock, Calendar } from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import ArticleContent from './article-content';
import ArticleSidebar from './article-sidebar';
import AuthorCard from './author-card';
import RelatedArticles from './related-articles';
import NewsletterCTA from './newsletter-cta';
import { getRelatedArticles } from '@/lib/blog-data';

export default function ArticleClient({ article }: { article: any }) {
  const relatedArticles = getRelatedArticles(article.slug, article.category, 3);
  const { scrollYProgress } = useScroll();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50" style={{ scaleX: scrollYProgress }} />
      <div className="container mx-auto px-4 pt-8 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <Link href={`/blog/category/${article.category.toLowerCase()}`} className="hover:text-primary transition-colors">{article.category}</Link>
        </nav>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-primary/10 text-primary mb-6">
            {article.category}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-6 leading-tight">
            {article.title}
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image src={article.author.avatar} alt={article.author.name} fill className="object-cover" />
              </div>
              <span className="font-medium text-foreground">{article.author.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {article.readingTime}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto relative aspect-[2/1] rounded-3xl overflow-hidden mb-16 shadow-xl border">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <ArticleContent content={article.content} tags={article.tags} />
              <div className="mt-12 pt-8 border-t">
                <AuthorCard author={article.author} />
              </div>
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-2xl font-bold font-display mb-6">Comments</h3>
                <div className="bg-muted/30 p-8 rounded-2xl border text-center">
                  <p className="text-muted-foreground mb-4">Join the discussion! Comments are currently in read-only mode while we upgrade our systems.</p>
                  <button className="px-6 py-2 rounded-lg bg-primary/10 text-primary font-medium" disabled>Sign in to Comment</button>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 relative">
              <div className="sticky top-24 space-y-8">
                <ArticleSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 py-20 mt-12 border-y">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold font-display text-center mb-12">Keep Reading</h2>
          <RelatedArticles articles={relatedArticles} />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <NewsletterCTA />
      </div>
    </div>
  );
}
