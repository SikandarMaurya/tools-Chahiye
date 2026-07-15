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