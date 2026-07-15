import { FileText, Image as ImageIcon, Zap, Video, Music, Code, Target, BookOpen, Laptop, Lightbulb } from 'lucide-react';

export const blogCategories = [
  { id: 'ai', name: 'AI', icon: Zap, articleCount: 42 },
  { id: 'pdf', name: 'PDF', icon: FileText, articleCount: 35 },
  { id: 'image', name: 'Image', icon: ImageIcon, articleCount: 28 },
  { id: 'developer', name: 'Developer', icon: Code, articleCount: 24 },
  { id: 'seo', name: 'SEO', icon: Target, articleCount: 19 },
  { id: 'productivity', name: 'Productivity', icon: Lightbulb, articleCount: 31 },
];

export const blogTags = ['AI', 'PDF', 'OCR', 'Image', 'Compression', 'Programming', 'JavaScript', 'SEO', 'Tools', 'Automation'];

export const blogAuthors = {
  'sarah-jenkins': {
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    bio: 'Senior Content Strategist & Tech Writer. Passionate about AI, productivity, and web tools.',
    social: { twitter: '#', linkedin: '#' }
  },
  'alex-chen': {
    name: 'Alex Chen',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    bio: 'Frontend Engineer & SEO Specialist. Writes about web performance, development, and marketing.',
    social: { twitter: '#', github: '#' }
  },
  'maria-garcia': {
    name: 'Maria Garcia',
    avatar: 'https://i.pravatar.cc/150?u=maria',
    bio: 'Product Designer focusing on UI/UX, accessibility, and design systems.',
    social: { twitter: '#', dribbble: '#' }
  }
};

export const blogArticles = [
  {
    id: '1',
    slug: 'how-to-compress-pdf-without-losing-quality',
    title: 'How to Compress PDF Files Without Losing Quality',
    excerpt: 'Learn the best techniques and tools to safely compress your PDF documents to reduce file size without sacrificing readability or image quality.',
    content: `
      <h2>Introduction</h2>
      <p>PDF files are everywhere, but they can quickly become too large to email or share easily. In this guide, we'll explore how you can reduce the file size of your PDFs while maintaining pristine quality.</p>
      
      <h2>Why Compress PDFs?</h2>
      <p>Large PDF files can be a hassle. They take longer to upload and download, consume more storage space, and often exceed email attachment limits. Compressing your PDFs solves these issues, making them easier to manage and share.</p>

      <h2>Top Techniques for PDF Compression</h2>
      <ul>
        <li><strong>Use built-in tools:</strong> Many operating systems offer basic PDF compression options.</li>
        <li><strong>Optimize images:</strong> Images are often the biggest culprits in bloated PDFs. Using our PDF compression tool automatically optimizes embedded images.</li>
        <li><strong>Remove unnecessary fonts:</strong> Subsetting fonts can significantly reduce file size.</li>
      </ul>

      <h2>Step-by-Step Guide Using ToolsChahiye</h2>
      <p>Our intelligent PDF compressor uses advanced algorithms to analyze your document and apply the optimal compression settings automatically.</p>
      <ol>
        <li>Go to our <a href="/pdf-tools/compress-pdf">PDF Compressor tool</a>.</li>
        <li>Upload your file.</li>
        <li>Choose your compression level (Recommended is best for most).</li>
        <li>Download the optimized file!</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>Compressing PDFs doesn't have to mean blurry text or pixelated images. With the right tools and techniques, you can achieve significant file size reductions while keeping your documents looking professional.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['sarah-jenkins'],
    date: '2024-10-15T08:00:00Z',
    updatedAt: '2024-10-16T08:00:00Z',
    category: 'PDF',
    readingTime: '5 min read',
    views: 12450,
    tags: ['PDF', 'Compression', 'Productivity'],
    isFeatured: true,
    isTrending: false,
  },
  {
    id: '2',
    slug: 'future-of-ai-in-web-development',
    title: 'The Future of AI in Web Development: What to Expect in 2025',
    excerpt: 'Explore how Artificial Intelligence is reshaping the web development landscape, from automated code generation to intelligent testing and deployment.',
    content: '<p>Content for the future of AI in web development...</p>',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['alex-chen'],
    date: '2024-10-12T08:00:00Z',
    category: 'AI',
    readingTime: '8 min read',
    views: 8900,
    tags: ['AI', 'Programming', 'Web Dev'],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: '3',
    slug: 'essential-seo-metrics-to-track',
    title: '10 Essential SEO Metrics You Should Be Tracking Today',
    excerpt: 'Stop guessing and start measuring. Discover the core SEO metrics that actually move the needle for your website\'s organic traffic and visibility.',
    content: '<p>Content for SEO metrics...</p>',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['alex-chen'],
    date: '2024-10-10T08:00:00Z',
    category: 'SEO',
    readingTime: '6 min read',
    views: 15600,
    tags: ['SEO', 'Analytics', 'Growth'],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: '4',
    slug: 'mastering-image-optimization-for-web',
    title: 'Mastering Image Optimization for Core Web Vitals',
    excerpt: 'A comprehensive guide to modern image formats, responsive sizing, and lazy loading techniques to ace your Core Web Vitals scores.',
    content: '<p>Content for image optimization...</p>',
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['maria-garcia'],
    date: '2024-10-08T08:00:00Z',
    category: 'Image',
    readingTime: '7 min read',
    views: 7200,
    tags: ['Image', 'Performance', 'Web Dev'],
    isFeatured: false,
    isTrending: true,
  },
  {
    id: '5',
    slug: 'how-to-extract-text-from-images-using-ocr',
    title: 'How to Extract Text from Images Using AI OCR',
    excerpt: 'Discover how Optical Character Recognition (OCR) powered by AI can turn your scanned documents and images into editable text in seconds.',
    content: '<p>Content for OCR...</p>',
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['sarah-jenkins'],
    date: '2024-10-05T08:00:00Z',
    category: 'Productivity',
    readingTime: '4 min read',
    views: 5400,
    tags: ['OCR', 'Productivity', 'Tools'],
    isFeatured: false,
    isTrending: false,
  },
  {
    id: '6',
    slug: 'top-developer-tools-2024',
    title: 'Top 20 Developer Tools You Can\'t Live Without in 2024',
    excerpt: 'From code formatters to API testers, here is the curated list of the best developer utilities that will supercharge your workflow.',
    content: '<p>Content for dev tools...</p>',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    author: blogAuthors['alex-chen'],
    date: '2024-10-01T08:00:00Z',
    category: 'Developer',
    readingTime: '10 min read',
    views: 11200,
    tags: ['Programming', 'Tools', 'Productivity'],
    isFeatured: false,
    isTrending: false,
  }
];

export function getFeaturedArticle() {
  return blogArticles.find(article => article.isFeatured) || blogArticles[0];
}

export function getTrendingArticles() {
  return blogArticles.filter(article => article.isTrending);
}

export function getLatestArticles(limit = 6) {
  return [...blogArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
}

export function getArticleBySlug(slug: string) {
  return blogArticles.find(article => article.slug === slug);
}

export function getRelatedArticles(currentSlug: string, category: string, limit = 3) {
  return blogArticles
    .filter(article => article.slug !== currentSlug && article.category === category)
    .slice(0, limit);
}
