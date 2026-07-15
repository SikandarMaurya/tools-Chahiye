import { motion } from 'framer-motion';
import { HelpCircle, ShieldCheck, Settings, Eye } from 'lucide-react';

const summaryItems = [
  {
    icon: HelpCircle,
    title: "What Are Cookies?",
    description: "Small text files saved on your device to help our platform remember your preferences and keep you logged in.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: ShieldCheck,
    title: "Why We Use Cookies",
    description: "To ensure platform security, understand how features are used, and optimize performance for a faster experience.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    icon: Settings,
    title: "How You Control Cookies",
    description: "You have full control. Change your preferences anytime through our preference center or browser settings.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: Eye,
    title: "Your Privacy Rights",
    description: "We respect your privacy. Essential cookies are required, but all other types are entirely up to your choice.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  }
];

export function CookieSummary() {
  return (
    <div className="bg-muted/50 rounded-[2rem] p-8 md:p-12 border shadow-sm relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-bold font-display mb-3">Cookie Summary</h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            A quick overview of our cookie practices. Read the full policy below for all details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-background rounded-2xl p-6 border shadow-sm flex items-start gap-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
