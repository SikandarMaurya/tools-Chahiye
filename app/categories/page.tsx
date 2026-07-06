import Link from "next/link";
import { toolsData } from "@/lib/tools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Tool Categories | ToolsChahiye",
  description: "Browse our entire collection of AI, Developer, Image, PDF, and Utility tools organized by category.",
};

export default function Categories() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">All Categories</h1>
        <p className="text-xl text-muted-foreground">Browse our entire collection of specialized tools organized by category.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {toolsData.map((cat) => (
          <Link key={cat.id} href={cat.href} className="group flex flex-col p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all hover:border-primary/50">
            <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg mb-4 group-hover:scale-110 transition-transform">
              <cat.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">{cat.description}</p>
            <div className="mt-auto text-xs font-medium text-muted-foreground pt-4 border-t">
              {cat.tools.length} tools available
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
