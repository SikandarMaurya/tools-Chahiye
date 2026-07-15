import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "Are my uploaded files safe?",
    a: "Yes. All file transfers are encrypted using TLS 1.3. Once processed, files are permanently deleted from our servers automatically."
  },
  {
    q: "Do you read my documents?",
    a: "No. The entire process is automated. No human has access to your files or their contents."
  },
  {
    q: "Do you sell my personal data?",
    a: "Absolutely not. We never sell your personal information to third parties. We make money by providing premium tools, not by selling data."
  },
  {
    q: "Can I request my data to be deleted?",
    a: "Yes. You can delete your account and all associated data at any time from your account settings, or by contacting our privacy team."
  },
  {
    q: "Are your AI models trained on my data?",
    a: "No. We explicitly opt out of data sharing for training purposes with all our AI providers."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-32 pt-20 border-t">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold font-display tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Common questions about privacy and data security.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border bg-background rounded-2xl overflow-hidden shadow-sm"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-4 flex items-center justify-between font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {faq.q}
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-5 text-muted-foreground text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
