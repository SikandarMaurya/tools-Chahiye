import CategoryPageTemplate, { generateCategoryMetadata } from '@/components/category-page-template';
import { Metadata } from 'next';

export const metadata: Metadata = generateCategoryMetadata('pdf-tools');

export default function PdfToolsPage() {
  return <CategoryPageTemplate categoryId="pdf-tools" />;
}
