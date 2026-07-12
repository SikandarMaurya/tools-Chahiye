import BackgroundRemoverClient from '@/components/background-remover-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Background Remover | Remove Image Background Online',
  description: 'Enterprise AI Background Remover. Remove image backgrounds instantly using our advanced AI vision engine. Export as transparent PNG.',
};

export default function Page() {
  return (
    <>
      <BackgroundRemoverClient />
      
      {/* SEO Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 prose prose-neutral dark:prose-invert">
        
        {/* About This Tool */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise AI Vision Engine for Background Removal</h2>
          <p>
            Experience the world&apos;s most accurate browser-based background removal platform. Our AI Background Remover is not just a simple delete tool; it&apos;s a core AI Vision Engine designed to deliver professional photo editing software accuracy with just one click. Perfect for e-commerce product photos, social media posts, presentations, and professional photography.
          </p>
        </section>

        {/* Why Choose This Tool */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Why Choose Our AI Background Remover?</h3>
          <ul>
            <li><strong>Speed:</strong> One click processing in less than 5 seconds.</li>
            <li><strong>Accuracy:</strong> AI Precision with dedicated Hair Detection.</li>
            <li><strong>Privacy:</strong> Automatic file deletion. Images are never used for AI training.</li>
            <li><strong>Professional Quality:</strong> Studio quality output with True Alpha edge refinement.</li>
            <li><strong>Batch Support:</strong> Process up to 100 images simultaneously (Premium).</li>
            <li><strong>Multi-Platform:</strong> Works flawlessly on Desktop, Tablet, and Mobile devices.</li>
          </ul>
        </section>

        {/* How to Use */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">How to Use (Step-by-Step Guide)</h3>
          
          <h4>Method 1 — Quick Background Removal</h4>
          <ol>
            <li><strong>Upload Image:</strong> Drag & drop, browse, or paste (Ctrl + V) an image. Supported formats include JPG, PNG, WEBP, AVIF, and HEIC.</li>
            <li><strong>AI Processing:</strong> Our engine automatically analyzes the image, detects the subject, and removes the background.</li>
            <li><strong>Preview & Edit:</strong> View the transparent result. You can switch to a solid color or custom background. If needed, use the manual brush/eraser to refine.</li>
            <li><strong>Export:</strong> Choose your format (PNG for transparency) and click Download.</li>
          </ol>

          <h4>Method 2 — Replace Background</h4>
          <p>After uploading and removing the background, select a new background from our library of gradients, solid colors, office settings, nature scenes, or upload a custom image. Preview the composition and download.</p>
        </section>

        {/* Supported Formats */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Supported Formats</h3>
          <p><strong>Upload:</strong> JPG, PNG, WEBP, HEIC, TIFF, BMP, AVIF</p>
          <p><strong>Download:</strong> PNG (Transparent), WEBP, JPG, AVIF</p>
        </section>
        
        {/* Best Practices */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Best Practices for Perfect Results</h3>
          <ul>
            <li>Use high-resolution images where the subject is in sharp focus.</li>
            <li>Ensure there is good contrast between the subject and the background.</li>
            <li>Avoid heavy motion blur or subjects that blend entirely into the background color.</li>
          </ul>
        </section>

        {/* Common Use Cases */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Real World Use Cases</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-bold mb-1">E-commerce</h4>
              <p className="text-sm text-muted-foreground">Create perfectly isolated white product images for Amazon, Shopify, or eBay.</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-bold mb-1">Social Media & YouTube</h4>
              <p className="text-sm text-muted-foreground">Create eye-catching YouTube thumbnails and Instagram posts.</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-bold mb-1">Business & ID Photos</h4>
              <p className="text-sm text-muted-foreground">Standardize employee headshots and professional ID cards instantly.</p>
            </div>
            <div className="p-4 bg-muted/20 rounded-lg">
              <h4 className="font-bold mb-1">Design Agencies</h4>
              <p className="text-sm text-muted-foreground">Bulk image editing and client deliverables delivered 10x faster.</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-lg">1. Is AI Background Remover free?</h4>
              <p>Yes. Basic processing is free for everyday use.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">2. Can I download a Transparent PNG?</h4>
              <p>Yes, simply select PNG as the export format to retain the transparent background.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">3. Will image quality reduce?</h4>
              <p>No. Our AI keeps the original resolution intact whenever possible.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">4. Can AI detect hair and fur?</h4>
              <p>Yes. We use a dedicated Hair Refinement Engine to accurately process complex edges.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">5. Are my images stored safely?</h4>
              <p>Files are automatically deleted after processing. No images are used for AI training.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">6. Can I use it on mobile?</h4>
              <p>Yes, it works perfectly on Android, iPhone, Tablet, and Desktop browsers.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">7. Can I manually fix AI mistakes?</h4>
              <p>Yes, we provide manual Brush, Erase, and Restore tools for fine-tuning.</p>
            </div>
            <div>
              <h4 className="font-bold text-lg">8. Does it work for complex backgrounds?</h4>
              <p>Yes, our AI handles complex backgrounds like trees, sky, and furniture with ease.</p>
            </div>
          </div>
        </section>

        {/* Future Roadmap */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-4">Future AI Roadmap</h3>
          <p>We are constantly improving. Upcoming features include:</p>
          <ul>
            <li><strong>v6.1:</strong> Better Hair Detection, Faster Processing, More Background Templates.</li>
            <li><strong>v6.2:</strong> AI Shadow Generator, Reflection Generator, and Lighting Adjustment.</li>
            <li><strong>v7.0:</strong> AI Scene Generator, Product Photography Studio, Video Background Removal, and Enterprise API.</li>
          </ul>
        </section>

      </div>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'AI Background Remover',
            applicationCategory: 'DesignApplication',
            operatingSystem: 'Any',
            description: 'Remove backgrounds from images instantly using advanced AI.',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </>
  );
}
