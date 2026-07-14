with open('components/tool-search.tsx', 'r') as f:
    content = f.read()

popular_code = """      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 text-center text-sm text-muted-foreground">
          No tools found for &quot;{query}&quot;
        </div>
      )}
      {!query.trim() && (
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
                {i < arr.length - 1 && " \u2022 "}
              </span>
            ))}
        </div>
      )}"""

content = content.replace('      {isOpen && query.trim() && results.length === 0 && (\n        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 text-center text-sm text-muted-foreground">\n          No tools found for &quot;{query}&quot;\n        </div>\n      )}', popular_code)

with open('components/tool-search.tsx', 'w') as f:
    f.write(content)

