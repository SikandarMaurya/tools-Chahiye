import CategoryPageTemplate, { generateCategoryMetadata } from '@/components/category-page-template';
import { Metadata } from 'next';

export const metadata: Metadata = generateCategoryMetadata('developer-tools');

export default function DeveloperToolsPage() {
  return <CategoryPageTemplate categoryId="developer-tools" />;
}
