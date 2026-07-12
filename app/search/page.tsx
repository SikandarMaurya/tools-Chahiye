import Link from "next/link";
import { Search } from "lucide-react";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-6">Search Tools</h1>
      <p className="text-xl text-muted-foreground mb-10">
        Find the perfect tool for your needs.
      </p>
      
      <div className="relative flex-grow max-w-xl mx-auto mb-10">
        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search for any tool (e.g. 'PDF to Word')..."
          className="h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-11"
          autoFocus
        />
      </div>

      <div className="text-muted-foreground">
        <p>Start typing to search through our database of 100+ tools...</p>
      </div>
    </div>
  );
}
