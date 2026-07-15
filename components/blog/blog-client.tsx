'use client';

import BlogHero from './blog-hero';
import FeaturedArticle from './featured-article';
import TrendingArticles from './trending-articles';
import CategoryGrid from './category-grid';
import LatestArticles from './latest-articles';
import NewsletterCTA from './newsletter-cta';
import PopularTags from './popular-tags';
import { getFeaturedArticle, getTrendingArticles, getLatestArticles, blogCategories, blogTags } from '@/lib/blog-data';

export default function BlogClient() {
  const featuredArticle = getFeaturedArticle();
  const trendingArticles = getTrendingArticles();
  const latestArticles = getLatestArticles(6);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <BlogHero />
      
      <div className="container mx-auto px-4 py-12 md:py-16 space-y-24">
        {featuredArticle && <FeaturedArticle article={featuredArticle} />}
        
        <CategoryGrid categories={blogCategories} />
        
        {trendingArticles.length > 0 && <TrendingArticles articles={trendingArticles} />}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <LatestArticles articles={latestArticles} />
          </div>
          <div className="space-y-8">
            <PopularTags tags={blogTags} />
            <div className="sticky top-24">
              <NewsletterCTA variant="sidebar" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t mt-12 bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <NewsletterCTA variant="full" />
        </div>
      </div>
    </div>
  );
}
