import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    question: "Can I use the tools for commercial purposes?",
    answer: "Yes, our tools can be used for both personal and commercial purposes, provided you comply with our Acceptable Use Policy and do not attempt to resell or reverse-engineer our services."
  },
  {
    question: "Do I own the files I upload?",
    answer: "Absolutely. You retain full ownership and all intellectual property rights to any files you upload. We only claim the temporary right to process them as requested by you."
  },
  {
    question: "Do you permanently store uploaded files?",
    answer: "No. All files uploaded for processing (like PDF conversions or image compressions) are temporarily stored on secure servers and are automatically deleted shortly after processing is complete."
  },
  {
    question: "Can my account be suspended?",
    answer: "Yes, we reserve the right to suspend or terminate accounts that violate our Terms & Conditions, such as through automated abuse, uploading illegal content, or payment fraud."
  },
  {
    question: "What happens if I violate the Terms?",
    answer: "Depending on the severity of the violation, actions may range from a warning to immediate account termination and, in severe cases involving illegal activities, reporting to relevant authorities."
  },
  {
    question: "How can I cancel my subscription?",
    answer: "You can cancel your subscription at any time through your account billing settings. Your premium access will remain active until the end of your current billing cycle."
  },
  {
    question: "Can I request account deletion?",
    answer: "Yes, you can permanently delete your account and associated data from your account settings page at any time."
  },
  {
    question: "Are AI-generated results guaranteed?",
    answer: "No. While we strive to provide high-quality AI services, AI outputs can vary and may occasionally be inaccurate. You should always review critical outputs before relying on them."
  },
  {
    question: "How are premium subscriptions billed?",
    answer: "Premium subscriptions are billed automatically on a recurring basis (monthly or annually, depending on your plan) using the payment method attached to your account."
  },
  {
    question: "How can I contact the legal team?",
    answer: "You can reach our legal team directly by emailing legal@toolschahiye.com or by using the contact form on our Support page."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mt-32 border-t pt-20" id="faq">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display mb-3">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Quick answers to common legal and usage questions.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'bg-muted/30 border-primary/20' : 'bg-background'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium pr-8">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                  openIndex === index ? 'rotate-180 text-primary' : ''
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
                  <div className="px-6 pb-6 pt-2 text-muted-foreground text-sm leading-relaxed border-t border-border/50">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No questions found matching your search.</p>
          </div>
        )}
      </div>
      
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />
    </section>
  );
}
