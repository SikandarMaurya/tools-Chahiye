export default function Disclaimer() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Disclaimer</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          The information and tools provided by toolschahiye are for general informational and utility purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tool on the site.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Use at Your Own Risk</h2>
        <p className="mb-4">
          Your use of the site and our tools is solely at your own risk. This is particularly relevant for developer tools, file converters, and AI generators. Please verify outputs before using them in production environments.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. External Links</h2>
        <p className="mb-4">
          Our platform may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
        </p>
      </div>
    </div>
  );
}
