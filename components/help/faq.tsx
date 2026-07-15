'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel your subscription at any time from your Account Settings. Go to Billing > Subscription and click on "Cancel Subscription". You will retain access to premium features until the end of your current billing cycle.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. All file transfers are encrypted using AES-256 SSL. Files uploaded for processing are automatically permanently deleted from our servers within 2 hours. We do not store, share, or analyze your personal documents.'
  },
  {
    question: 'What is the maximum file size limit?',
    answer: 'Free users can upload files up to 50MB. Premium users enjoy a limit of up to 2GB per file, depending on the specific tool being used.'
  },
  {
    question: 'Do you offer an API for developers?',
    answer: 'Yes! We offer a robust REST API for enterprise and developer plans. You can find the full API documentation in the Developer section of this Help Center.'
  },
  {
    question: 'Can I use ToolsChahiye offline?',
    answer: 'Currently, ToolsChahiye requires an active internet connection as our heavy processing (like AI generation and large file compression) is handled on our powerful cloud servers.'
  }
];

export default function FAQCenter() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            Quick Answers
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold mb-4 tracking-tight"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-card border border-white/10 dark:border-white/5 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-medium hover:text-primary transition-colors">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${openIndex === index ? 'rotate-180 text-primary' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4 }}
           className="mt-12 text-center"
        >
          <p className="text-muted-foreground">
            Don&apos;t see your question here? <a href="/contact" className="text-primary hover:underline font-medium">Contact our support team</a>.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
