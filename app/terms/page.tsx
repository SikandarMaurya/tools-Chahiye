export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-3xl">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Terms & Conditions</h1>
      <div className="prose prose-neutral dark:prose-invert">
        <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        <p className="mb-4">
          By accessing and using toolschahiye, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptable Use</h2>
        <p className="mb-4">
          You agree to use our tools for lawful purposes only. You must not use our platform to process illegal, copyrighted (without permission), or malicious content.
        </p>
        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Availability</h2>
        <p className="mb-4">
          While we strive for 99.9% uptime, we do not guarantee continuous, uninterrupted access to our platform. We reserve the right to modify or discontinue any tool at any time.
        </p>
      </div>
    </div>
  );
}
