import { Metadata } from 'next';
import BlogClient from '@/components/blog/blog-client';

export const metadata: Metadata = {
  title: 'Blog | Learn, Create, Grow | ToolsChahiye',
  description: 'Discover tutorials, productivity tips, AI guides and expert resources on the ToolsChahiye blog.',
  openGraph: {
    title: 'Blog | Learn, Create, Grow',
    description: 'Discover tutorials, productivity tips, AI guides and expert resources on the ToolsChahiye blog.',
    type: 'website',
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
