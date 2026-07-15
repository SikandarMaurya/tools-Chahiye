import Image from 'next/image';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function AuthorCard({ author }: { author: any }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-muted/50 p-6 md:p-8 rounded-2xl border">
      <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0 border-4 border-background shadow-sm">
        <Image src={author.avatar} alt={author.name} fill className="object-cover" />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-bold font-display mb-1">{author.name}</h3>
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{author.bio}</p>
        <div className="flex gap-3">
          {author.social?.twitter && (
            <a href={author.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          )}
          {author.social?.linkedin && (
            <a href={author.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {author.social?.github && (
            <a href={author.social.github} className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
