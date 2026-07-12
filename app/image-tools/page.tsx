import CategoryPageTemplate, { generateCategoryMetadata } from '@/components/category-page-template';
import { Metadata } from 'next';

export const metadata: Metadata = generateCategoryMetadata('image-tools');

export default function Page() {
  return <CategoryPageTemplate categoryId="image-tools" />;
}
