'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Paperclip, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function SmartContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  return (
    <section id="contact-form" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Send a Message</h2>
          <p className="text-muted-foreground text-lg">Our AI routing system will ensure your message reaches the right expert instantly.</p>
        </div>
        
        <div className="bg-card border rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden glass">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onSubmit={handleSubmit} className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input required className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input required className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <input required type="email" className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="john@company.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <select required className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none">
                      <option value="">Select Department...</option>
                      <option value="support">Customer Support</option>
                      <option value="tech">Technical & API</option>
                      <option value="billing">Billing & Sales</option>
                      <option value="partners">Partnerships</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <input required className="w-full h-12 px-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="How can we help?" />
                </div>
                
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium">Message</label>
                  <textarea required rows={5} className="w-full p-4 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" placeholder="Please provide as much detail as possible..." />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <button type="button" className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-primary transition-colors">
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" required className="rounded border-input text-primary focus:ring-primary" id="consent" />
                  <label htmlFor="consent">I agree to the privacy policy and terms of service.</label>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing AI Routing...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Send Message</>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Message Sent Successfully!</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Your ticket <span className="font-mono text-primary bg-primary/10 px-2 py-1 rounded">#TC-8492</span> has been routed to the appropriate team. Estimated response time: 45 minutes.
                </p>
                <button onClick={() => setIsSuccess(false)} className="h-12 px-8 rounded-full border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors">
                  Submit Another Request
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}