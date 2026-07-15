"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import { searchTools, Tool, allTools } from "@/lib/tools";

export default function ToolSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const results = query.trim() ? searchTools(query) : [];

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(!!newQuery.trim());
  };

  return (
    <div className="relative flex-grow z-50">
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => {
            setIsFocused(true);
            if (query.trim()) setIsOpen(true);
          }}
          onBlur={() => {
            // delay onBlur to allow clicking links
            setTimeout(() => setIsFocused(false), 200);
          }}
          placeholder="Search for any tool (e.g. 'PDF to Word')..."
          className="h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pl-11"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl overflow-hidden max-h-96 overflow-y-auto">
          {results.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center p-3 hover:bg-muted transition-colors border-b last:border-0"
            >
              <div className="p-2 bg-primary/10 text-primary rounded-md mr-3">
                <tool.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-medium text-sm">{tool.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 text-center text-sm text-muted-foreground">
          No tools found for &quot;{query}&quot;
        </div>
      )}

      {!query.trim() && !isFocused && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
          <span className="font-medium mr-2">Popular:</span>
          {allTools
            .filter((t) => t.isPopular)
            .slice(0, 4)
            .map((tool, i, arr) => (
              <span key={tool.id}>
                <Link
                  href={tool.href}
                  className="hover:text-primary transition-colors hover:underline"
                >
                  {tool.title}
                </Link>
                {i < arr.length - 1 && " • "}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
