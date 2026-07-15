export default function ArticleContent({ content, tags }: { content: string, tags: string[] }) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      <div className="mt-12 pt-8 border-t flex items-center gap-3 flex-wrap">
        <span className="font-semibold mr-2">Tags:</span>
        {tags.map(tag => (
          <a key={tag} href={`/blog/tag/${tag.toLowerCase()}`} className="px-3 py-1 bg-muted rounded-full text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
            {tag}
          </a>
        ))}
      </div>
    </article>
  );
}
