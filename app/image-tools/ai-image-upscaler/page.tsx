import AIImageUpscalerClient from "@/components/ai-image-upscaler-client";
import { FAQAccordion } from "@/components/faq-accordion";

export default function AIImageUpscalerPage() {
  const faqs = [
    {
      question: "Is AI Image Upscaler free?",
      answer: "Yes. Basic upscaling is free. Premium users receive higher upload limits, faster AI models, batch processing, 8× Upscaling, and a priority queue."
    },
    {
      question: "Which image formats are supported?",
      answer: "Supported Input: JPG, PNG, WEBP, AVIF, TIFF, BMP, HEIC. Supported Output: PNG, JPG, WEBP, AVIF."
    },
    {
      question: "Will AI reduce image quality?",
      answer: "No. Instead of stretching pixels, AI predicts and reconstructs missing details to improve clarity."
    },
    {
      question: "Can I upscale multiple images?",
      answer: "Yes. Batch Mode allows multiple images to be processed simultaneously and downloaded as a ZIP archive."
    },
    {
      question: "Does AI improve faces?",
      answer: "Yes. Portrait AI restores eyes, hair, skin, lips, and facial details."
    },
    {
      question: "Does it work on mobile?",
      answer: "Yes. The tool is fully responsive and optimized for Android, iPhone, tablets and desktops."
    },
    {
      question: "Is my uploaded image stored?",
      answer: "No. Images are temporarily processed and automatically deleted after completion."
    },
    {
      question: "Which upscale level should I choose?",
      answer: "2× → Small improvements, 4× → Best balance, 8× → Maximum enhancement (Premium). Auto Mode selects the recommended level."
    },
    {
      question: "Can AI restore old photos?",
      answer: "Yes. It can improve sharpness, reduce noise and recover details. For damaged photos, use the dedicated AI Photo Restoration tool for best results."
    },
    {
      question: "Does it sharpen text?",
      answer: "Yes. Document AI enhances screenshots, scanned pages and text-based graphics."
    },
    {
      question: "Can I use images commercially?",
      answer: "Yes. The processed output is yours, provided you have the rights to use the original image."
    },
    {
      question: "Is batch processing available?",
      answer: "Yes. Upload multiple images, monitor progress and download everything as a ZIP file."
    },
    {
      question: "How long does processing take?",
      answer: "Typically small images take 2–5 seconds, medium images 5–10 seconds, and large images 10–30 seconds."
    },
    {
      question: "Can I cancel processing?",
      answer: "Yes. You can cancel running jobs before they finish."
    },
    {
      question: "Do I need to install software?",
      answer: "No. Everything runs directly in your browser."
    },
    {
      question: "Does AI support anime images?",
      answer: "Yes. Anime AI uses a model optimized for illustrations and animated artwork."
    },
    {
      question: "Can AI remove blur?",
      answer: "It reduces blur and reconstructs details, but extremely blurred images may still have limitations."
    },
    {
      question: "What is Face Restoration?",
      answer: "Face Restoration enhances facial features such as eyes, eyebrows, lips, skin texture and hair while preserving a natural appearance."
    },
    {
      question: "Why does AI recommend another model?",
      answer: "The system automatically detects whether the image is a portrait, product, document or artwork and recommends the model best suited for that content."
    },
    {
      question: "Is my data secure?",
      answer: "Yes. Security includes HTTPS encryption, temporary storage only, automatic deletion, and no AI training using your uploaded images."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AIImageUpscalerClient />
      
      {/* SEO Content & FAQ Section */}
      <div className="bg-muted/10 border-t py-20 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Enterprise AI Image Upscaling</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Learn how our Super Resolution Engine transforms your low-quality images into crisp, high-definition masterpieces.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                How AI Upscaling Works
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Traditional upscaling simply stretches existing pixels, resulting in blurry and blocky images. 
                Our AI Super Resolution Engine uses advanced machine learning models to predict and intelligently 
                reconstruct missing details. It analyzes textures, edges, and patterns to generate new, high-fidelity 
                pixels that perfectly match the context of your image.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                Benefits of AI Super Resolution
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> 
                  Recover lost details in old or compressed photos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> 
                  Enhance e-commerce product images for higher conversions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> 
                  Prepare low-res graphics for large format printing
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> 
                  Improve the clarity of screenshots and scanned documents
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about the AI Image Upscaler.
              </p>
            </div>
            <FAQAccordion faqs={faqs} />
          </div>

        </div>
      </div>
    </div>
  );
}
