import re

with open('app/page.tsx', 'r') as f:
    content = f.read()

popular_regex = r'<div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">.*?</div>'
content = re.sub(popular_regex, '', content, flags=re.DOTALL)

with open('app/page.tsx', 'w') as f:
    f.write(content)

with open('components/tool-search.tsx', 'r') as f:
    content = f.read()

content = content.replace("import { searchTools, Tool } from '@/lib/tools';", "import { searchTools, Tool, allTools } from '@/lib/tools';")

popular_code = """      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-xl p-4 text-center text-sm text-muted-foreground">
          No tools found for &quot;{query}&quot;
        </div>
      )}
      {!query.trim() && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
          <span className="font-medium mr-2">Popular:</span>
          {allTools.filter((t) => t.isPopular).slice(0, 4).map((tool, i, arr) => (
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

content = content.replace("      {isOpen && query.trim() && results.length === 0 && (", popular_code.split("      {isOpen && query.trim() && results.length === 0 && (")[0] + "      {isOpen && query.trim() && results.length === 0 && (")

with open('components/tool-search.tsx', 'w') as f:
    f.write(content)

