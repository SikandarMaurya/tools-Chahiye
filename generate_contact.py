import os

sections = {
    "hero.tsx": """
'use client';
import { motion } from 'motion/react';
import { MessageSquare, Mail, Phone } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-background pt-20 border-b">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      
      <div className="container relative mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium border border-primary/20 backdrop-blur-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>24/7 Premium Support</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground max-w-4xl mx-auto leading-tight"
        >
          We'd Love to Hear From You
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-medium"
        >
          Need help? Have a business proposal? Found a bug? Want to collaborate? We're always ready.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            <Mail className="w-5 h-5" />
            Contact Support
          </button>
          <button onClick={() => document.getElementById('departments')?.scrollIntoView({ behavior: 'smooth' })} className="h-14 px-8 rounded-full bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 border">
            Business Inquiry
          </button>
        </motion.div>
      </div>
    </section>
  );
}
""",
    "quick-cards.tsx": """
'use client';
import { motion } from 'motion/react';
import { Headphones, Shield, Briefcase, Zap, Search, LifeBuoy, FileCode2, Globe } from 'lucide-react';

const departments = [
  { icon: Headphones, title: "Customer Support", desc: "General inquiries and account help.", time: "< 2 hours", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: FileCode2, title: "Technical Support", desc: "API, integrations, and dev issues.", time: "< 1 hour", color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Briefcase, title: "Business & Sales", desc: "Enterprise plans and custom solutions.", time: "< 12 hours", color: "text-green-500", bg: "bg-green-500/10" },
  { icon: Globe, title: "Partnership", desc: "Collaborations and media inquiries.", time: "< 24 hours", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Shield, title: "Security & Legal", desc: "Data protection and compliance.", time: "< 4 hours", color: "text-red-500", bg: "bg-red-500/10" },
  { icon: Zap, title: "Feature Request", desc: "Suggest new tools or features.", time: "Weekly review", color: "text-yellow-500", bg: "bg-yellow-500/10" },
];

export default function DepartmentsSection() {
  return (
    <section id="departments" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Direct Lines to Our Teams</h2>
          <p className="text-muted-foreground text-lg">Route your inquiry to the right department for the fastest response.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-card border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors" />
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${dept.bg} ${dept.color} group-hover:scale-110 transition-transform`}>
                <dept.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{dept.title}</h3>
              <p className="text-muted-foreground text-sm mb-6">{dept.desc}</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-medium px-2 py-1 bg-muted rounded-md text-muted-foreground">Response: {dept.time}</span>
                <span className="text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform">Contact →</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "smart-form.tsx": """
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
"""
}

os.makedirs('components/contact', exist_ok=True)
for filename, code in sections.items():
    with open(f"components/contact/{filename}", "w") as f:
        f.write(code.strip())

print("Generated part 1 of contact page.")
