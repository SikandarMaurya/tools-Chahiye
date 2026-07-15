export default function PopularTags({ tags }: { tags: string[] }) {
  return (
    <div className="bg-card border rounded-2xl p-6">
      <h3 className="font-bold text-lg mb-4">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a
            key={tag}
            href={`/blog/tag/${tag.toLowerCase()}`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border bg-background text-xs font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {tag}
          </a>
        ))}
      </div>
    </div>
  );
}
