import { Metadata } from "next";
import AIObjectRemoverClient from "@/components/ai-object-remover-client";
import { FAQAccordion } from "@/components/faq-accordion";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  Maximize,
  Crop,
  FileImage,
  Image as ImageIcon,
  Eraser,
  Settings2,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Object Remover | Enterprise AI Inpainting Engine",
  description:
    "Remove unwanted objects, people, or text from photos and seamlessly reconstruct the background using our Enterprise AI Inpainting Engine. Free online tool.",
};

const faqs = [
  {
    question: "How does AI Object Remover work?",
    answer:
      "Our AI analyzes the selected object and the surrounding pixels. It then seamlessly removes the object and reconstructs the background using advanced AI inpainting technology to match textures, lighting, and colors.",
  },
  {
    question: "Is AI Object Remover free?",
    answer:
      "Yes. Basic object removal is completely free.\n\nPremium provides:\n• Faster AI Engine\n• Batch Processing\n• Priority Queue\n• High-Precision Inpainting Models",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "Supported Input:\n• JPG\n• PNG\n• WEBP\n• AVIF\n• TIFF\n• BMP\n• HEIC\n\nOutput:\n• JPG\n• PNG\n• WEBP\n• AVIF",
  },
  {
    question: "Can it remove people from photos?",
    answer:
      "Yes. The AI Person Removal feature can identify and remove photobombers, tourists, or unwanted people while preserving the natural background.",
  },
  {
    question: "Can I remove text or watermarks?",
    answer:
      "Yes. You can use it to remove printed text, logos, or date stamps, provided you own the rights to edit the image.",
  },
  {
    question: "What if the background is complex?",
    answer:
      "Our Scene Reconstruction engine handles complex backgrounds like brick walls, grass, and detailed textures by synthesizing matching patterns.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Security includes:\n• HTTPS Encryption\n• Temporary Storage\n• Automatic File Deletion\n• No AI Training Using Uploaded Images",
  },
];

const relatedTools = [
  {
    title: "AI Photo Enhancer",
    description:
      "Enhance image quality, fix colors, and reduce noise automatically.",
    icon: <Wand2 className="w-6 h-6 text-primary" />,
    href: "/image-tools/ai-photo-enhancer",
  },
  {
    title: "AI Background Remover",
    description:
      "Automatically remove backgrounds from photos with high precision.",
    icon: <Eraser className="w-6 h-6 text-primary" />,
    href: "/image-tools/ai-background-remover",
  },
  {
    title: "Image Resizer",
    description: "Resize images for social media platforms in one click.",
    icon: <Crop className="w-6 h-6 text-primary" />,
    href: "/image-tools/image-resizer",
  },
  {
    title: "Image Converter",
    description: "Convert images between JPG, PNG, WEBP, and more.",
    icon: <FileImage className="w-6 h-6 text-primary" />,
    href: "/image-tools/image-converter",
  },
];

export default function AIObjectRemoverPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AIObjectRemoverClient />

      <div className="bg-muted/10 py-20 border-t">
        <div className="container mx-auto px-4 max-w-4xl space-y-20">
          {/* How to Use Section */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              How to Use AI Object Remover
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Photo</h3>
                <p className="text-muted-foreground text-sm">
                  Drag and drop or browse to upload your image. We support JPG,
                  PNG, WEBP, AVIF up to 25MB.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Paint the Object</h3>
                <p className="text-muted-foreground text-sm">
                  Use the brush or lasso tool to paint over the unwanted object,
                  person, or text you want to remove.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  AI Reconstruction
                </h3>
                <p className="text-muted-foreground text-sm">
                  Click &apos;Remove Object&apos;. Our AI seamlessly deletes the selection
                  and perfectly recreates the background behind it.
                </p>
              </div>
            </div>
          </section>

          {/* About / SEO Content */}
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Enterprise-Grade AI Inpainting Engine
            </h2>
            <p>
              Say goodbye to photobombers, stray power lines, date stamps, and
              distracting background elements. The AI Object Remover utilizes a
              state-of-the-art vision inpainting engine to not only delete what
              you select but to synthetically reconstruct the missing scene
              pixels with incredible accuracy.
            </p>
            <p>
              Whether you are an e-commerce seller cleaning up product shots, a
              real estate professional removing clutter from room photos, or
              simply saving a perfect vacation memory, this tool performs
              complex clone-stamping and texture blending in a matter of
              seconds.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              Core Capabilities
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>AI Person Removal:</strong> Effortlessly erase
                  tourists and photobombers.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Texture Synthesis:</strong> Rebuilds grass, sky,
                  walls, and roads flawlessly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Text & Logo Cleaner:</strong> Clean up unwanted
                  watermarks and overlays.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Blemish & Dust Removal:</strong> Fix small scratches
                  and camera lens dust spots.
                </span>
              </li>
            </ul>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">
              Related Tools
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="bg-background p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group"
                >
                  <div className="p-3 bg-muted rounded-full mb-3 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <FAQAccordion faqs={faqs} />
          </section>
        </div>
      </div>
    </div>
  );
}
