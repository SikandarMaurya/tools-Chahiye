'use client';

import { motion } from 'framer-motion';
import { Bug, Twitter, Linkedin, Github, Youtube, ShieldCheck, Lock } from 'lucide-react';
import Link from 'next/link';

export function TrustSocialSection() {
  return (
    <section className="py-24 bg-card/30 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          
          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h3 className="text-xl font-bold mb-6">Connect with us</h3>
            <p className="text-muted-foreground mb-8">
              Follow us on social media for the latest updates, tips, and feature announcements.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Twitter, href: '#', bg: 'hover:bg-[#1DA1F2]' },
                { icon: Linkedin, href: '#', bg: 'hover:bg-[#0A66C2]' },
                { icon: Github, href: '#', bg: 'hover:bg-[#333]' },
                { icon: Youtube, href: '#', bg: 'hover:bg-[#FF0000]' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-12 h-12 rounded-full bg-card border border-white/10 dark:border-white/5 flex items-center justify-center text-foreground hover:text-white transition-all ${social.bg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Trust & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <h3 className="text-xl font-bold mb-6">Trust & Security</h3>
            <p className="text-muted-foreground mb-8">
              Your privacy is our priority. We adhere to the highest security standards.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-blue-500" />
                <span className="font-medium">256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
                <span className="font-medium">ISO 27001 Certified</span>
              </div>
            </div>
          </motion.div>

          {/* Report Problem / Bug Bounty */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center mb-4">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold mb-3">Found a Bug?</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Security researchers and users can report vulnerabilities or bugs. We offer rewards for critical security disclosures.
            </p>
            <Link href="/bug-bounty" className="text-sm font-medium text-red-500 hover:text-red-400 hover:underline inline-flex items-center gap-2">
              Report via Bug Bounty Program
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
