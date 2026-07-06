import CategoryPageTemplate, { generateCategoryMetadata } from '@/components/category-page-template';
import { Metadata } from 'next';

export const metadata: Metadata = generateCategoryMetadata('text-tools');

export default function TextToolsPage() {
  return <CategoryPageTemplate categoryId="text-tools" />;
}
