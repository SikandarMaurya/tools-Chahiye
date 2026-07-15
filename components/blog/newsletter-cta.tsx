import { Mail } from 'lucide-react';

export default function NewsletterCTA({ variant = 'full' }: { variant?: 'full' | 'sidebar' }) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-lg mb-2">Subscribe to our Newsletter</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Get the latest tools, tips, and tutorials directly in your inbox.
        </p>
        <form className="space-y-3">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="w-full h-10 px-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <button 
            type="submit" 
            className="w-full h-10 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground mt-3">
          By subscribing, you agree to our Privacy Policy.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center max-w-4xl mx-auto overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Level up your workflow</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Join 50,000+ professionals getting the best tools, insights, and guides delivered weekly. No spam, ever.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="name@company.com" 
            className="flex-grow h-12 px-4 rounded-xl border bg-background shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            required
          />
          <button 
            type="submit" 
            className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap shadow-md shadow-primary/20"
          >
            Subscribe Now
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-4">
          Unsubscribe at any time. Read our <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
