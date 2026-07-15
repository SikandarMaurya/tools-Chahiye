'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ExternalLink, MessageSquare, HeartHandshake, ShieldCheck, Zap, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How fast will I get a response?',
    answer: 'For premium users, we typically respond within 2 hours during business days. Free users can expect a response within 24-48 hours. Enterprise customers get 24/7 dedicated support.'
  },
  {
    question: 'Can I request a new tool or feature?',
    answer: 'Absolutely! We love hearing from our users. You can submit feature requests through our contact form by selecting the "Feature Request" subject line.'
  },
  {
    question: 'Do you offer refunds for premium plans?',
    answer: 'Yes, we offer a 14-day money-back guarantee for all our premium plans. If you are not satisfied, just contact our billing department for a full refund.'
  },
  {
    question: 'Is my uploaded data secure?',
    answer: 'Yes, security is our top priority. All files are encrypted during transfer and automatically deleted from our servers within 2 hours of processing. We do not store or share your data.'
  },
  {
    question: 'How do I report a bug?',
    answer: 'If you encounter a bug, please use the contact form and select "Report a Bug". Provide as much detail as possible, including your browser, OS, and screenshots if applicable.'
  }
];

const stats = [
  { label: 'Avg Response Time', value: '1.5', unit: 'hrs', icon: Zap, color: 'text-yellow-500' },
  { label: 'Customer Satisfaction', value: '98', unit: '%', icon: HeartHandshake, color: 'text-red-500' },
  { label: 'Tickets Resolved', value: '1M+', unit: '', icon: ShieldCheck, color: 'text-green-500' },
  { label: 'Active Support Staff', value: '50+', unit: '', icon: MessageSquare, color: 'text-blue-500' },
];

export function FaqStatsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto rounded-full bg-card border border-white/10 dark:border-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
                  {stat.value}<span className="text-xl text-muted-foreground">{stat.unit}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ & Help Center */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">
                Find quick answers to common questions about our platform and support.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} />
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary/5 border border-primary/20 rounded-3xl p-8 sticky top-24"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Visit our Help Center</h3>
              <p className="text-muted-foreground mb-8">
                Explore our comprehensive knowledge base, tutorials, and documentation for detailed guides on using all our tools.
              </p>
              
              <ul className="space-y-4 mb-8">
                {['Getting Started Guides', 'Billing & Subscriptions', 'API Documentation', 'Troubleshooting'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/help" className="inline-flex items-center justify-center w-full bg-primary text-primary-foreground h-12 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors gap-2">
                Browse Help Center
                <ExternalLink className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq }: { faq: { question: string, answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 dark:border-white/5 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-lg font-medium hover:text-primary transition-colors focus:outline-none"
      >
        {faq.question}
        <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground leading-relaxed text-base pt-4">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
