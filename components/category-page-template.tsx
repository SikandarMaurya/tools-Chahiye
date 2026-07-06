import { notFound } from 'next/navigation';
import Link from 'next/link';
import { toolsData } from '@/lib/tools';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

interface CategoryPageProps {
  categoryId: string;
}

export function generateCategoryMetadata(categoryId: string): Metadata {
  const categoryData = toolsData.find(c => c.id === categoryId);
  
  if (!categoryData) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryData.name} - ToolsChahiye`,
    description: categoryData.description,
  };
}

export default function CategoryPageTemplate({ categoryId }: CategoryPageProps) {
  const categoryData = toolsData.find(c => c.id === categoryId);

  if (!categoryData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-primary/10 text-primary rounded-xl">
              <categoryData.icon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{categoryData.name}</h1>
              <p className="text-xl text-muted-foreground mt-2">{categoryData.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categoryData.tools.length > 0 ? (
            categoryData.tools.map(tool => (
              <Link key={tool.id} href={tool.href} className="flex flex-col p-6 bg-card rounded-xl border shadow-sm hover:border-primary hover:shadow-md transition-all group relative overflow-hidden">
                {(tool.isNew || tool.isPopular) && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase rounded-bl-xl z-10">
                    {tool.isNew ? 'New' : 'Popular'}
                  </div>
                )}
                <div className="p-3 bg-muted rounded-xl w-fit mb-4 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <tool.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl">
              <p className="text-muted-foreground">New tools for this category are coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
