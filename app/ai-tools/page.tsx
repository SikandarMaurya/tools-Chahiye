import CategoryPageTemplate, { generateCategoryMetadata } from '@/components/category-page-template';
import { Metadata } from 'next';

export const metadata: Metadata = generateCategoryMetadata('ai-tools');

export default function AiToolsPage() {
  return <CategoryPageTemplate categoryId="ai-tools" />;
}
