export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          This Cookie Policy explains how toolschahiye uses cookies and similar technologies to recognize you when you visit our platform. It explains what these technologies are and why we use them.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. What are cookies?</h2>
        <p className="mb-4">
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide reporting information.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Why do we use cookies?</h2>
        <p className="mb-4">
          We use first-party cookies for essential platform operations, such as saving your theme preference (Light/Dark mode) and remembering your recently used tools.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-party cookies</h2>
        <p className="mb-4">
          In the future, we may use third-party cookies for analytics (like Google Analytics) to understand how our platform is being used, or for monetization purposes.
        </p>
      </div>
    </div>
  );
}
