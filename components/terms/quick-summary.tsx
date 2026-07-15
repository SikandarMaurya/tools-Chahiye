import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Shield } from 'lucide-react';

const summaryItems = [
  {
    icon: CheckCircle2,
    title: "What You Can Do",
    description: "Use our tools for personal, business, or educational purposes in accordance with our fair usage policies.",
    color: "text-green-500",
    bg: "bg-green-500/10"
  },
  {
    icon: XCircle,
    title: "What You Cannot Do",
    description: "Upload illegal content, attempt to reverse engineer our tools, or use automated systems to abuse our API.",
    color: "text-red-500",
    bg: "bg-red-500/10"
  },
  {
    icon: AlertCircle,
    title: "Your Responsibilities",
    description: "You are responsible for keeping your account secure and ensuring you have the right to process the files you upload.",
    color: "text-orange-500",
    bg: "bg-orange-500/10"
  },
  {
    icon: Shield,
    title: "Our Responsibilities",
    description: "We strive to provide reliable service, secure your data, and clearly communicate any significant changes to our platform.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  }
];

export function QuickSummary() {
  return (
    <div className="bg-muted/50 rounded-[2rem] p-8 md:p-12 border shadow-sm relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-bold font-display mb-3">Terms Summary</h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            A quick overview of our expectations. Please read the full terms below for legal details.
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
