"use client";
import { motion } from "motion/react";
import { FAQAccordion } from "@/components/faq-accordion";

const faqs = [
  {
    question: "What is toolschahiye?",
    answer:
      "toolschahiye is a comprehensive platform offering over 100 free online tools for PDF, Image, Developer, SEO, and AI tasks.",
  },
  {
    question: "Is the platform really free?",
    answer:
      "Yes, our core tools are entirely free to use. We offer premium features for enterprise usage and bulk processing.",
  },
  {
    question: "Are my files secure?",
    answer:
      "Absolutely. All uploads are encrypted via HTTPS/SSL, processed securely, and permanently deleted from our servers within 2 hours.",
  },
  {
    question: "Do you train AI on my data?",
    answer:
      "No. We respect your privacy and explicitly opt-out of using user-submitted data to train our generative AI models.",
  },
  {
    question: "Can I use the tools commercially?",
    answer:
      "Yes, generated outputs and processed files can be used for commercial purposes without attribution.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required for most of our tools. You can start using them immediately.",
  },
  {
    question: "What is the maximum file size limit?",
    answer:
      "Guest users can upload files up to 50MB. Premium users enjoy larger limits up to 2GB.",
  },
  {
    question: "Which platforms are supported?",
    answer:
      "Our web-based tools work perfectly across Windows, Mac, Linux, iOS, and Android.",
  },
  {
    question: "Is there a mobile app available?",
    answer:
      "Currently, we offer a highly optimized mobile web experience. Native apps are on our roadmap.",
  },
  {
    question: "How fast is the processing?",
    answer:
      "We leverage edge computing and AI optimizations to process most tasks in under 2 seconds.",
  },
  {
    question: "Can I process multiple files at once?",
    answer:
      "Yes, batch processing is supported for many of our Image and PDF tools.",
  },
  {
    question: "Do you offer an API for developers?",
    answer:
      "Our Developer API is currently in beta. Contact our enterprise team for early access.",
  },
  {
    question: "What AI models do you use?",
    answer:
      "We use a mix of state-of-the-art models including Gemini, custom Vision models, and optimized open-source architectures.",
  },
  {
    question: "How do you handle PDF encryption?",
    answer:
      "We use industry-standard AES-256 encryption for all PDF protection tools.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "We use Stripe for payment processing. We do not store any credit card information on our servers.",
  },
  {
    question: "Can I request a new tool?",
    answer:
      "Absolutely! We love community feedback. Use our contact form to suggest new features.",
  },
  {
    question: "Do you support multiple languages?",
    answer:
      "The platform is currently available in English, with Spanish, French, and German coming soon.",
  },
  {
    question: "Are the SEO tools accurate?",
    answer:
      "Our SEO tools use live data and adhere to the latest search engine guidelines for maximum accuracy.",
  },
  {
    question: "How do I report a bug?",
    answer:
      "You can report bugs through our support portal or by emailing our engineering team directly.",
  },
  {
    question: "What is the Enterprise plan?",
    answer:
      "The Enterprise plan includes dedicated server nodes, SLA guarantees, priority support, and custom integrations.",
  },
];

export default function FAQSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about our platform.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <FAQAccordion faqs={faqs} />
        </motion.div>
      </div>
    </section>
  );
}
