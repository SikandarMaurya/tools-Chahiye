"use client";
import { motion } from "motion/react";
import { ShieldCheck, Lock, Trash2, FileCheck } from "lucide-react";

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
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Your Privacy is Our Priority
            </h2>
            <p className="text-lg text-muted-foreground">
              We employ enterprise-grade security protocols to ensure your
              sensitive documents and data remain strictly confidential.
            </p>

            <ul className="space-y-4 pt-4">
              {[
                { icon: Lock, text: "TLS 1.3 / SSL 256-bit Encryption" },
                {
                  icon: Trash2,
                  text: "Automatic file deletion within 2 hours",
                },
                { icon: FileCheck, text: "GDPR & CCPA Compliant" },
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
