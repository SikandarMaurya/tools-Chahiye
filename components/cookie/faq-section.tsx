import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    question: "What are cookies?",
    answer: "Cookies are small text files stored on your device by your web browser when you visit a website. They help the site remember information about your visit, like your preferences and login status."
  },
  {
    question: "Do cookies store personal information?",
    answer: "Most of our cookies do not store personal information that can directly identify you. They usually contain anonymous identifiers and configuration settings. Some analytics cookies may track your IP address."
  },
  {
    question: "Can I disable cookies?",
    answer: "Yes. You can manage your preferences through our Cookie Preference Center on this page, or you can configure your browser to block or delete cookies. However, blocking essential cookies will break some site functionality."
  },
  {
    question: "Will the website work without cookies?",
    answer: "The website will load, but essential features like logging in, accessing premium tools, or remembering your theme preferences will not function without essential cookies enabled."
  },
  {
    question: "How do I delete cookies?",
    answer: "You can clear cookies directly from your browser's privacy or security settings. We have provided links to official guides for popular browsers in the Browser Management section above."
  },
  {
    question: "Why do you use analytics cookies?",
    answer: "We use analytics cookies to understand how users interact with our platform (e.g., which tools are most popular, where errors occur). This aggregated, anonymous data helps us prioritize updates and fix issues."
  },
  {
    question: "Can I change my preferences later?",
    answer: "Absolutely. You can revisit this Cookie Policy page at any time and update your settings in the Cookie Preferences center."
  },
  {
    question: "How long are cookies stored?",
    answer: "Session cookies are deleted as soon as you close your browser. Persistent cookies (like theme preferences) can remain on your device for up to a year unless you manually delete them."
  },
  {
    question: "Do you sell cookie data?",
    answer: "No. We strictly use cookie data to maintain and improve our platform. We do not sell your data or browsing habits to third-party data brokers."
  },
  {
    question: "How do I contact the privacy team?",
    answer: "You can email our privacy team directly at privacy@toolschahiye.com or reach out via our main Contact page."
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
          <p className="text-muted-foreground">Quick answers to common questions about our use of cookies.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-full border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-colors ${openIndex === index ? 'bg-muted/30 border-orange-500/20' : 'bg-background'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <span className="font-medium pr-8">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${
                  openIndex === index ? 'rotate-180 text-orange-500' : ''
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
