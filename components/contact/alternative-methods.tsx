'use client';

import { motion } from 'framer-motion';
import { Phone, MessageCircle, Send, Users, Building2, Briefcase, FileCode2 } from 'lucide-react';
import Link from 'next/link';

const departments = [
  {
    icon: Users,
    name: 'Customer Support',
    description: 'Help with tools, accounts, and billing.',
    email: 'support@toolschahiye.com',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Building2,
    name: 'Enterprise Sales',
    description: 'Custom plans and API access for teams.',
    email: 'sales@toolschahiye.com',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Briefcase,
    name: 'Partnerships',
    description: 'Collaborations and marketing opportunities.',
    email: 'partners@toolschahiye.com',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: FileCode2,
    name: 'Developer Relations',
    description: 'API documentation and developer support.',
    email: 'devs@toolschahiye.com',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
];

const methods = [
  {
    icon: Phone,
    name: 'Phone Support',
    value: '+1 (800) 123-4567',
    label: 'Toll-free in US & Canada',
    link: 'tel:+18001234567',
  },
  {
    icon: MessageCircle,
    name: 'WhatsApp',
    value: '+1 (415) 555-0198',
    label: 'Fast chat support',
    link: 'https://wa.me/14155550198',
  },
  {
    icon: Send,
    name: 'Telegram',
    value: '@toolschahiye_support',
    label: 'Community & Direct',
    link: 'https://t.me/toolschahiye_support',
  },
];

export function AlternativeMethods() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Direct Department Access</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Know exactly who you need to reach? Email our specialized teams directly for faster routing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-card/80 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full ${dept.bg} ${dept.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{dept.description}</p>
                  <a href={`mailto:${dept.email}`} className="text-primary hover:underline font-medium text-sm">
                    {dept.email}
                  </a>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Alternative Contact Methods</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Prefer to talk or chat? We are available on your favorite platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Link href={method.link} key={method.name} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-gradient-to-br from-card/50 to-background/50 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-2xl p-6 flex items-start gap-4 hover:border-primary/50 transition-all hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-muted-foreground mb-1">{method.name}</h3>
                      <p className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{method.value}</p>
                      <p className="text-sm text-muted-foreground">{method.label}</p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
