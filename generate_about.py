import os

sections = {
    "hero.tsx": """
'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>
      
      <div className="container relative mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium border border-primary/20 backdrop-blur-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>The Next-Generation Tools Platform</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground max-w-5xl mx-auto leading-tight"
        >
          Building the Future of Digital Workflows
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium"
        >
          We empower millions of creators, developers, and businesses with blazing-fast AI, PDF, and Design tools—all beautifully unified in one secure platform.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/categories">
            <button className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
              Explore Platform
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/contact">
            <button className="h-14 px-8 rounded-full bg-secondary text-secondary-foreground font-semibold text-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 border">
              Contact Enterprise
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
""",
    "timeline.tsx": """
'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const milestones = [
  { year: '2022', title: 'The Vision', desc: 'Started with a simple idea: unify fragmented online tools into one premium platform.' },
  { year: '2023', title: 'AI Integration', desc: 'Launched our proprietary AI processing engines for image and text generation.' },
  { year: '2024', title: 'Global Scaling', desc: 'Reached 10M+ users globally, expanded server nodes across 12 countries.' },
  { year: '2025', title: 'Enterprise Launch', desc: 'Introduced SOC2 compliant infrastructure and enterprise-grade security features.' },
  { year: 'Future', title: 'Autonomous AI', desc: 'Building self-healing, context-aware tools that anticipate your needs.' },
];

export default function TimelineSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section ref={containerRef} className="py-32 bg-muted/30 border-y relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Journey</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">From a single utility to a billion-dollar platform infrastructure.</p>
        </div>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
          
          {milestones.map((milestone, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex items-center justify-between mb-16 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
            >
              <div className="w-5/12 text-right hidden md:block">
                {idx % 2 === 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-primary mb-2">{milestone.year}</h3>
                    <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                    <p className="text-muted-foreground">{milestone.desc}</p>
                  </>
                ) : null}
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] z-10" />
              
              <div className="w-5/12 hidden md:block">
                {idx % 2 !== 0 ? (
                  <>
                    <h3 className="text-2xl font-bold text-primary mb-2">{milestone.year}</h3>
                    <h4 className="text-xl font-semibold mb-2">{milestone.title}</h4>
                    <p className="text-muted-foreground">{milestone.desc}</p>
                  </>
                ) : null}
              </div>

              {/* Mobile View */}
              <div className="w-full md:hidden pl-8 relative">
                <h3 className="text-xl font-bold text-primary mb-1">{milestone.year}</h3>
                <h4 className="text-lg font-semibold mb-1">{milestone.title}</h4>
                <p className="text-muted-foreground text-sm">{milestone.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "mission-vision.tsx": """
'use client';
import { motion } from 'motion/react';
import { Target, Eye } from 'lucide-react';

export default function MissionVisionSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-card border shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <Target className="w-12 h-12 text-primary mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize professional-grade digital tools. We believe everyone deserves access to fast, secure, and intelligent utilities without complex software or expensive subscriptions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-10 rounded-3xl bg-card border shadow-xl relative overflow-hidden group hover:border-primary/50 transition-colors"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
            <Eye className="w-12 h-12 text-blue-500 mb-6" />
            <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A future where artificial intelligence seamlessly augments human creativity and productivity, processing complex workflows with a single click across a universally accessible platform.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
""",
    "core-values.tsx": """
'use client';
import { motion } from 'motion/react';
import { Zap, Shield, Sparkles, Heart, Globe, Lock } from 'lucide-react';

const values = [
  { icon: Sparkles, title: "Innovation First", desc: "Pushing boundaries with cutting-edge AI." },
  { icon: Shield, title: "Uncompromising Privacy", desc: "Your data never becomes our product." },
  { icon: Zap, title: "Blazing Speed", desc: "Optimized infrastructure for instant results." },
  { icon: Heart, title: "Crafted Quality", desc: "Pixel-perfect UI and flawless UX." },
  { icon: Lock, title: "Enterprise Trust", desc: "SOC2 compliant, military-grade encryption." },
  { icon: Globe, title: "Global Accessibility", desc: "Tools built for everyone, everywhere." },
];

export default function CoreValuesSection() {
  return (
    <section className="py-32 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Core Values</h2>
          <p className="text-muted-foreground text-lg">The principles that drive every line of code we write.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-card border shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <v.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{v.title}</h3>
              <p className="text-muted-foreground">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "stats.tsx": """
'use client';
import { motion } from 'motion/react';
import { Users, FileText, Globe, Cpu } from 'lucide-react';

const stats = [
  { icon: Users, value: "10M+", label: "Active Users" },
  { icon: FileText, value: "500M+", label: "Files Processed" },
  { icon: Globe, value: "195", label: "Countries" },
  { icon: Cpu, value: "1B+", label: "AI Requests" },
];

export default function StatisticsSection() {
  return (
    <section className="py-32 relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:32px_32px]" />
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <stat.icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <div className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{stat.value}</div>
              <div className="text-lg font-medium opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "tech-stack.tsx": """
'use client';
import { motion } from 'motion/react';
import { Code2, Server, Database, Cloud } from 'lucide-react';

export default function TechStackSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Enterprise Architecture</h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto">Built on a modern, scalable stack designed for maximum performance, security, and reliability.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Code2, title: "Frontend", stack: "Next.js 14, React, Tailwind CSS, Framer Motion" },
            { icon: Server, title: "Backend", stack: "Node.js, Edge Functions, WebAssembly" },
            { icon: Database, title: "AI Models", stack: "TensorFlow, PyTorch, Gemini, Custom Vision" },
            { icon: Cloud, title: "Infrastructure", stack: "Global CDN, Kubernetes, Cloud SQL" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-muted/50 border hover:bg-muted transition-colors"
            >
              <item.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.stack}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "security.tsx": """
'use client';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Trash2, FileCheck } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section className="py-32 bg-secondary/20 border-y">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Bank-Grade Security
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Your Privacy is Our Priority</h2>
            <p className="text-lg text-muted-foreground">We employ enterprise-grade security protocols to ensure your sensitive documents and data remain strictly confidential.</p>
            
            <ul className="space-y-4 pt-4">
              {[
                { icon: Lock, text: "TLS 1.3 / SSL 256-bit Encryption" },
                { icon: Trash2, text: "Automatic file deletion within 2 hours" },
                { icon: FileCheck, text: "GDPR & CCPA Compliant" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-primary shadow-sm">
                    <item.icon className="w-4 h-4" />
                  </div>
                  {item.text}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:w-1/2 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full" />
            <div className="relative p-8 rounded-3xl bg-card border shadow-2xl overflow-hidden glass">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full" />
              <div className="space-y-6">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
                </div>
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 font-mono text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  ENCRYPTED_PAYLOAD_READY
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
""",
    "faq.tsx": """
'use client';
import { motion } from 'motion/react';
import { FAQAccordion } from '@/components/faq-accordion';

const faqs = [
  { question: "What is toolschahiye?", answer: "toolschahiye is a comprehensive platform offering over 100 free online tools for PDF, Image, Developer, SEO, and AI tasks." },
  { question: "Is the platform really free?", answer: "Yes, our core tools are entirely free to use. We offer premium features for enterprise usage and bulk processing." },
  { question: "Are my files secure?", answer: "Absolutely. All uploads are encrypted via HTTPS/SSL, processed securely, and permanently deleted from our servers within 2 hours." },
  { question: "Do you train AI on my data?", answer: "No. We respect your privacy and explicitly opt-out of using user-submitted data to train our generative AI models." },
  { question: "Can I use the tools commercially?", answer: "Yes, generated outputs and processed files can be used for commercial purposes without attribution." },
  { question: "Do I need to create an account?", answer: "No account is required for most of our tools. You can start using them immediately." },
  { question: "What is the maximum file size limit?", answer: "Guest users can upload files up to 50MB. Premium users enjoy larger limits up to 2GB." },
  { question: "Which platforms are supported?", answer: "Our web-based tools work perfectly across Windows, Mac, Linux, iOS, and Android." },
  { question: "Is there a mobile app available?", answer: "Currently, we offer a highly optimized mobile web experience. Native apps are on our roadmap." },
  { question: "How fast is the processing?", answer: "We leverage edge computing and AI optimizations to process most tasks in under 2 seconds." },
  { question: "Can I process multiple files at once?", answer: "Yes, batch processing is supported for many of our Image and PDF tools." },
  { question: "Do you offer an API for developers?", answer: "Our Developer API is currently in beta. Contact our enterprise team for early access." },
  { question: "What AI models do you use?", answer: "We use a mix of state-of-the-art models including Gemini, custom Vision models, and optimized open-source architectures." },
  { question: "How do you handle PDF encryption?", answer: "We use industry-standard AES-256 encryption for all PDF protection tools." },
  { question: "Is my payment information secure?", answer: "We use Stripe for payment processing. We do not store any credit card information on our servers." },
  { question: "Can I request a new tool?", answer: "Absolutely! We love community feedback. Use our contact form to suggest new features." },
  { question: "Do you support multiple languages?", answer: "The platform is currently available in English, with Spanish, French, and German coming soon." },
  { question: "Are the SEO tools accurate?", answer: "Our SEO tools use live data and adhere to the latest search engine guidelines for maximum accuracy." },
  { question: "How do I report a bug?", answer: "You can report bugs through our support portal or by emailing our engineering team directly." },
  { question: "What is the Enterprise plan?", answer: "The Enterprise plan includes dedicated server nodes, SLA guarantees, priority support, and custom integrations." }
];

export default function FAQSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know about our platform.</p>
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
""",
    "final-cta.tsx": """
'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Rocket } from 'lucide-react';

export default function FinalCTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10" />
      
      <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 rounded-3xl bg-card border shadow-2xl"
        >
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-8 h-8" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Supercharge Your Workflow?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join millions of users who have transformed the way they work with documents, images, and AI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/categories">
              <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
                Start Exploring Free
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
""",
    "why-choose-us.tsx": """
'use client';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function WhyChooseUsSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us</h2>
          <p className="text-muted-foreground text-lg">See how we compare against traditional platforms.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-muted/50 border opacity-80"
          >
            <h3 className="text-2xl font-bold text-muted-foreground mb-6 text-center">Traditional Tools</h3>
            <ul className="space-y-4">
              {['Slow page loads', 'Intrusive ads & popups', 'Paywalls for basic features', 'Scattered across different sites', 'Poor mobile experience'].map((text, i) => (
                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                  <XCircle className="w-5 h-5 text-red-400" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-3xl bg-card border-2 border-primary shadow-xl shadow-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full" />
            <h3 className="text-2xl font-bold text-primary mb-6 text-center">Our Platform</h3>
            <ul className="space-y-4 relative z-10">
              {['Blazing fast processing', 'Ad-free clean interface', 'Free core features', 'All tools in one dashboard', 'Native-like mobile apps'].map((text, i) => (
                <li key={i} className="flex items-center gap-3 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
""",
    "ai-platform.tsx": """
'use client';
import { motion } from 'motion/react';
import { Brain, Sparkles, Image as ImageIcon, FileText } from 'lucide-react';

export default function AIPlatformSection() {
  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            AI-Native Infrastructure
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet Our AI Engines</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We don't just use AI; we've built our platform around it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Sparkles, title: "Vision AI", desc: "Advanced object detection, background removal, and generative inpainting.", color: "text-purple-500", bg: "bg-purple-500/10" },
            { icon: FileText, title: "Document AI", desc: "Intelligent OCR, context-aware summarization, and semantic analysis.", color: "text-blue-500", bg: "bg-blue-500/10" },
            { icon: ImageIcon, title: "Generative AI", desc: "Text-to-image, style transfer, and intelligent upscaling models.", color: "text-green-500", bg: "bg-green-500/10" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border shadow-lg hover:shadow-xl transition-all"
            >
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "categories.tsx": """
'use client';
import { motion } from 'motion/react';
import { FileText, Image as ImageIcon, Settings, Search, Code, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CategoriesSection() {
  const categories = [
    { icon: FileText, title: "PDF Tools", count: 24, href: "/pdf-tools" },
    { icon: ImageIcon, title: "Image Tools", count: 18, href: "/image-tools" },
    { icon: Sparkles, title: "AI Tools", count: 12, href: "/ai-tools" },
    { icon: Search, title: "SEO Tools", count: 15, href: "/seo-tools" },
    { icon: Code, title: "Developer", count: 20, href: "/developer-tools" },
    { icon: Play, title: "Video Tools", count: 8, href: "/categories" },
  ];

  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Unified Ecosystem</h2>
          <p className="text-muted-foreground text-lg">Hundreds of specialized tools, organized perfectly.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <Link key={i} href={cat.href}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <cat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">{cat.title}</h3>
                    <p className="text-sm text-muted-foreground">{cat.count} tools</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "global-availability.tsx": """
'use client';
import { motion } from 'motion/react';
import { Globe } from 'lucide-react';

export default function GlobalAvailabilitySection() {
  return (
    <section className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <Globe className="w-16 h-16 mx-auto mb-6 opacity-80" />
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Global Scale. Local Speed.</h2>
        <p className="text-xl opacity-90 max-w-2xl mx-auto mb-12">
          Deployed across 24 edge regions worldwide, ensuring sub-50ms latency no matter where you are.
        </p>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
          {['North America', 'Europe', 'Asia Pacific', 'South America', 'Middle East'].map(region => (
            <span key={region} className="px-4 py-2 bg-primary-foreground/10 rounded-full backdrop-blur-sm border border-primary-foreground/20">
              {region}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "testimonials.tsx": """
'use client';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  { name: "Sarah Jenkins", role: "Product Designer at TechFlow", text: "It replaced four different subscriptions for our team. The AI upscaler alone is worth it.", rating: 5 },
  { name: "David Chen", role: "Senior Developer", text: "Blazing fast. No ads, no BS. Just tools that work exactly as described. The regex tester is my daily driver.", rating: 5 },
  { name: "Emily Rodriguez", role: "Marketing Director", text: "We use the PDF and SEO tools every single day. The batch processing feature saves us hours each week.", rating: 5 }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-secondary/20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Professionals</h2>
          <p className="text-muted-foreground text-lg">Don't just take our word for it.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-card border shadow-sm relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-lg font-medium mb-8">"{t.text}"</p>
              <div>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
""",
    "sustainability.tsx": """
'use client';
import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';

export default function SustainabilitySection() {
  return (
    <section className="py-24 border-y">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Committed to Sustainability</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Our entire infrastructure is hosted on 100% renewable energy data centers. We optimize our AI models to be energy-efficient, minimizing our carbon footprint while maximizing performance.
          </p>
          <div className="flex justify-center gap-8 text-sm font-medium">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              100% Green Hosting
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Carbon Neutral
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"""
}

os.makedirs('components/about', exist_ok=True)
for filename, code in sections.items():
    with open(f"components/about/{filename}", "w") as f:
        f.write(code.strip())

with open('components/about-client.tsx', 'w') as f:
    f.write("""'use client';

import HeroSection from './about/hero';
import TimelineSection from './about/timeline';
import MissionVisionSection from './about/mission-vision';
import CoreValuesSection from './about/core-values';
import WhyChooseUsSection from './about/why-choose-us';
import StatisticsSection from './about/stats';
import TechStackSection from './about/tech-stack';
import SecuritySection from './about/security';
import AIPlatformSection from './about/ai-platform';
import CategoriesSection from './about/categories';
import GlobalAvailabilitySection from './about/global-availability';
import TestimonialsSection from './about/testimonials';
import SustainabilitySection from './about/sustainability';
import FAQSection from './about/faq';
import FinalCTASection from './about/final-cta';

export default function AboutClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TimelineSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <TechStackSection />
      <SecuritySection />
      <AIPlatformSection />
      <CategoriesSection />
      <GlobalAvailabilitySection />
      <TestimonialsSection />
      <SustainabilitySection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
""")

with open('app/about/page.tsx', 'w') as f:
    f.write("""import { Metadata } from "next";
import AboutClient from "@/components/about-client";

export const metadata: Metadata = {
  title: "About Us | toolschahiye Platform",
  description: "Learn about toolschahiye, the ultimate AI-powered multi-tool platform for PDF, Image, Developer, and SEO tools.",
  openGraph: {
    title: "About Us | toolschahiye Platform",
    description: "Learn about toolschahiye, the ultimate AI-powered multi-tool platform for PDF, Image, Developer, and SEO tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | toolschahiye Platform",
    description: "Learn about toolschahiye, the ultimate AI-powered multi-tool platform.",
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
""")

print("Successfully generated everything.")
