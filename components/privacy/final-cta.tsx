import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="bg-primary text-primary-foreground py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <h2 className="text-4xl font-bold font-display tracking-tight mb-6">
          Still have questions?
        </h2>
        <p className="text-primary-foreground/80 text-lg mb-10">
          Our privacy team is available to help clarify any details about how we handle your data.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-background text-primary font-medium text-sm hover:bg-background/90 transition-colors w-full sm:w-auto"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Privacy Team
          </Link>
          <Link 
            href="/help"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-primary-foreground/10 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/20 transition-colors w-full sm:w-auto border border-primary-foreground/20"
          >
            Visit Help Center
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
