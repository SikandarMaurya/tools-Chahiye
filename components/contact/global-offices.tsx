'use client';

import { motion } from 'framer-motion';
import { MapPin, Clock, Calendar, Globe2 } from 'lucide-react';

const offices = [
  {
    city: 'San Francisco',
    country: 'United States',
    address: '100 Market St, Suite 300\nSan Francisco, CA 94105',
    time: 'PST (UTC-8)',
    status: 'HQ',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    address: '1 Canada Square\nLondon E14 5AB',
    time: 'GMT (UTC+0)',
    status: 'EMEA',
  },
  {
    city: 'Bangalore',
    country: 'India',
    address: 'UB City, Vittal Mallya Rd\nBengaluru, Karnataka 560001',
    time: 'IST (UTC+5:30)',
    status: 'APAC',
  }
];

export function GlobalOffices() {
  return (
    <section className="py-24 bg-muted/30 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Globe2 className="w-4 h-4" />
                Global Presence
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Our Offices Worldwide</h2>
              <p className="text-muted-foreground text-lg">
                We operate globally to provide 24/7 support to our users. Visit our headquarters or regional offices.
              </p>
            </motion.div>

            <div className="space-y-6">
              {offices.map((office, index) => (
                <motion.div
                  key={office.city}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-white/10 dark:border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        {office.city}
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {office.status}
                        </span>
                      </h3>
                      <p className="text-muted-foreground">{office.country}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                    {office.address}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Local Time: {office.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-3xl overflow-hidden bg-card border border-white/10 dark:border-white/5"
          >
            {/* Interactive World Map placeholder/visual */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-50 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-lg mb-4">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span>Monday - Friday</span>
                    </div>
                    <span className="font-medium">24 Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar className="w-5 h-5 text-yellow-500" />
                      <span>Saturday - Sunday</span>
                    </div>
                    <span className="font-medium">Limited Support</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="w-5 h-5 text-green-500" />
                      <span>Avg. Response Time</span>
                    </div>
                    <span className="font-medium">&lt; 2 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
