import { Metadata } from "next";
import AIPhotoEnhancerClient from "@/components/ai-photo-enhancer-client";
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
  title: "AI Photo Enhancer | Enterprise Image Quality Improvement",
  description:
    "Enhance photo quality, fix colors, reduce noise, and recover details automatically with our Enterprise AI Photo Enhancer. Free online tool.",
};

const faqs = [
  {
    question: "Is AI Photo Enhancer free?",
    answer:
      "Yes. Basic enhancement is completely free.\n\nPremium provides:\n• Faster AI Engine\n• Batch Enhancement\n• Priority Queue\n• HD Export\n• Advanced AI Models",
  },
  {
    question: "Which image formats are supported?",
    answer:
      "Supported Input:\n• JPG\n• PNG\n• WEBP\n• AVIF\n• TIFF\n• BMP\n• HEIC\n\nOutput:\n• JPG\n• PNG\n• WEBP\n• AVIF",
  },
  {
    question: "Does AI reduce image quality?",
    answer:
      "No. AI improves image quality by correcting colors, removing noise and restoring details.",
  },
  {
    question: "Can I enhance multiple photos together?",
    answer: "Yes. Batch Enhancement supports multiple images and ZIP download.",
  },
  {
    question: "Does it improve faces?",
    answer:
      "Yes. AI enhances:\n• Eyes\n• Hair\n• Lips\n• Skin\n• Facial Details",
  },
  {
    question: "Can AI improve dark photos?",
    answer:
      "Yes. Night Enhancement automatically adjusts brightness, exposure and shadow details.",
  },
  {
    question: "Does it remove image noise?",
    answer:
      "Yes. AI removes camera noise, grain and JPEG compression artifacts.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes. Optimized for Android, iPhone, Tablets and Desktop.",
  },
  {
    question: "Will my uploaded photos be stored?",
    answer: "No. Files are automatically deleted after processing.",
  },
  {
    question: "Can I use enhanced images commercially?",
    answer:
      "Yes. You retain responsibility for having the rights to use the original image.",
  },
  {
    question: "How long does enhancement take?",
    answer: "Normally 2–10 Seconds depending on image size.",
  },
  {
    question: "Can AI fix blurry photos?",
    answer:
      "Partially. For severe blur, use AI Image Upscaler after enhancement.",
  },
  {
    question: "Does AI restore old photos?",
    answer:
      "Basic restoration is supported. For damaged photos, use AI Old Photo Restoration.",
  },
  {
    question: "Can I cancel processing?",
    answer: "Yes. Running jobs can be cancelled before completion.",
  },
  {
    question: "Can I enhance screenshots?",
    answer: "Yes. AI improves screenshots, UI images and documents.",
  },
  {
    question: "Can AI improve product images?",
    answer: "Yes. Product AI enhances colors, edges and textures.",
  },
  {
    question: "Do I need Photoshop?",
    answer: "No. Everything runs directly inside your browser.",
  },
  {
    question: "Why did AI recommend Portrait Mode?",
    answer:
      "The system detected one or more human faces and selected the Portrait AI model automatically for better facial enhancement.",
  },
  {
    question: "Can I compare before and after?",
    answer:
      "Yes. The tool provides Side-by-Side, Split View and Slider Comparison modes.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Security includes:\n• HTTPS Encryption\n• Temporary Storage\n• Automatic File Deletion\n• No AI Training Using Uploaded Images",
  },
];

const relatedTools = [
  {
    title: "AI Image Upscaler",
    description: "Enlarge images up to 4x without losing quality.",
    icon: <Maximize className="w-6 h-6 text-primary" />,
    href: "/image-tools/ai-image-upscaler",
  },
  {
    title: "AI Background Remover",
    description: "Automatically remove backgrounds from photos.",
    icon: <Eraser className="w-6 h-6 text-primary" />,
    href: "/image-tools/ai-background-remover",
  },
  {
    title: "Image Resizer",
    description: "Resize images for social media in one click.",
    icon: <Crop className="w-6 h-6 text-primary" />,
    href: "/image-tools/image-resizer",
  },
  {
    title: "Image Converter",
    description: "Convert images to JPG, PNG, WEBP, and more.",
    icon: <FileImage className="w-6 h-6 text-primary" />,
    href: "/image-tools/image-converter",
  },
];

export default function AIPhotoEnhancerPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AIPhotoEnhancerClient />

      <div className="bg-muted/10 py-20 border-t">
        <div className="container mx-auto px-4 max-w-4xl space-y-20">
          {/* How to Use Section */}
          <section>
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">
              How to Use AI Photo Enhancer
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Upload Photo</h3>
                <p className="text-muted-foreground text-sm">
                  Drag and drop or browse to upload your image. We support JPG,
                  PNG, WEBP, AVIF, TIFF, and HEIC up to 20MB.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  AI Analyzes & Enhances
                </h3>
                <p className="text-muted-foreground text-sm">
                  Our Enterprise AI automatically analyzes your image, detecting
                  faces, noise, and color issues, then applies the optimal
                  enhancements.
                </p>
              </div>
              <div className="bg-background p-6 rounded-xl border shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Compare & Download
                </h3>
                <p className="text-muted-foreground text-sm">
                  Use the interactive slider to compare the before and after,
                  adjust manual settings if needed, and download your
                  high-resolution result.
                </p>
              </div>
            </div>
          </section>

          {/* About / SEO Content */}
          <section className="prose prose-slate dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              Enterprise-Grade AI Photo Enhancement
            </h2>
            <p>
              Transform your ordinary photos into stunning, professional-quality
              images with our AI Photo Enhancer. Powered by state-of-the-art
              vision models, our tool intelligently analyzes every pixel to
              correct colors, remove noise, sharpen details, and enhance faces
              without the need for complex editing software like Photoshop.
            </p>
            <p>
              Whether you're a photographer looking to rescue a poorly lit
              portrait, a business preparing e-commerce product images, or just
              wanting to improve a favorite memory, our one-click AI does the
              heavy lifting instantly in your browser.
            </p>

            <h3 className="text-xl font-semibold mt-8 mb-4">
              Key Benefits of AI Image Enhancement
            </h3>
            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Instant Color Correction:</strong> Automatically
                  balances white levels, exposure, and saturation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Intelligent Noise Reduction:</strong> Removes grainy
                  artifacts from low-light photography.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>Face & Detail Recovery:</strong> Enhances facial
                  features and sharpens soft edges automatically.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  <strong>100% Private:</strong> Your files are processed
                  securely and deleted automatically.
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
