export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Contact Us</h1>
      <p className="text-muted-foreground mb-8">Have a question, feature request, or found a bug? We&apos;d love to hear from you.</p>
      
      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input type="text" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Your name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="your@email.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea rows={5} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="How can we help?"></textarea>
        </div>
        <button type="button" className="inline-flex items-center justify-center rounded-md bg-primary px-8 h-10 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
          Send Message
        </button>
      </form>
    </div>
  );
}
