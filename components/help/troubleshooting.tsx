'use client';

import { motion } from 'framer-motion';
import { AlertCircle, FileWarning, CreditCard, MonitorX, CloudOff, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const issues = [
  { icon: FileWarning, label: 'Upload Failed', href: '/help/troubleshooting/upload' },
  { icon: CloudOff, label: 'Tool Not Working', href: '/help/troubleshooting/tool-error' },
  { icon: CreditCard, label: 'Payment Issues', href: '/help/troubleshooting/billing' },
  { icon: MonitorX, label: 'Browser Compatibility', href: '/help/troubleshooting/browser' },
  { icon: AlertTriangle, label: 'File Format Errors', href: '/help/troubleshooting/format' },
];

export default function TroubleshootingCenter() {
  return (
    <section className="py-24 bg-card/30 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold mb-4 tracking-tight">Troubleshooting Center</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Running into an issue? Find quick solutions to common errors and technical problems.
              </p>
              
              <Link 
                href="/help/troubleshooting"
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground hover:bg-secondary/80 font-medium rounded-xl transition-colors gap-2"
              >
                View all known issues
              </Link>
            </motion.div>
          </div>
          
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {issues.map((issue, index) => {
                const Icon = issue.icon;
                return (
                  <motion.div
                    key={issue.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={issue.href}>
                      <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 dark:border-white/5 bg-background hover:bg-muted hover:border-red-500/30 transition-all group">
                        <div className="w-10 h-10 rounded-full bg-red-500/5 text-red-500 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium group-hover:text-red-500 transition-colors">{issue.label}</span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: issues.length * 0.1 }}
                className="sm:col-span-2"
              >
                <Link href="/contact" className="block w-full">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all">
                    <span className="font-medium text-primary">Still stuck? Contact Support</span>
                    <AlertCircle className="w-5 h-5 text-primary" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
