export default function Privacy() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          At toolschahiye, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Data Collection</h2>
        <p className="mb-4">
          We collect minimal data required to provide our services. For most tools (like local PDF processors or formatters), your data never leaves your browser.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Tool Usage</h2>
        <p className="mb-4">
          When using server-processed tools (like AI generation), we temporarily process your input to generate the result, after which the data is immediately discarded. We do not use your inputs to train our models.
        </p>
      </div>
    </div>
  );
}
