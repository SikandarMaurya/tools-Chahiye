import { motion } from 'framer-motion';
import { Database, FileX, Lock, UserCheck } from 'lucide-react';

const summaryItems = [
  {
    icon: Database,
    title: "What we collect",
    description: "Account details, usage analytics, and temporary file processing data to provide our services."
  },
  {
    icon: FileX,
    title: "What we don't collect",
    description: "We never permanently store your uploaded files or use them to train AI models without consent."
  },
  {
    icon: Lock,
    title: "Data protection",
    description: "Enterprise-grade encryption in transit and at rest. Files are automatically deleted after processing."
  },
  {
    icon: UserCheck,
    title: "Your rights",
    description: "Full control over your data. You can access, modify, export, or delete your account at any time."
  }
];

export function QuickSummary() {
  return (
    <div className="bg-muted/50 rounded-[2rem] p-8 md:p-12 border shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 relative z-10">
        <div>
          <h2 className="text-3xl font-bold font-display mb-3">Quick Summary</h2>
          <p className="text-muted-foreground text-lg max-w-xl">
            Too long, didn't read? Here's the TL;DR on how we handle your privacy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {summaryItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-background rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
              <item.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
