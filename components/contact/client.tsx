'use client';

import HeroSection from './hero';
import DepartmentsSection from './quick-cards';
import SmartContactForm from './smart-form';
import { AlternativeMethods } from './alternative-methods';
import { GlobalOffices } from './global-offices';
import { FaqStatsSection } from './faq-section';
import { TrustSocialSection } from './trust-social';
import { ContactCTA } from './contact-cta';

export function ContactClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <HeroSection />
      <DepartmentsSection />
      
      {/* Main Form Section */}
      <section className="py-24 relative overflow-hidden" id="contact-form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Let&apos;s start a conversation</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fill out the form and our smart routing system will direct your inquiry to the right department immediately.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Smart Routing</h4>
                    <p className="text-sm text-muted-foreground">AI analyzes your message and routes it to the correct specialist.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Fast Response</h4>
                    <p className="text-sm text-muted-foreground">Get a reply from a human within 2 hours on business days.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Resolution</h4>
                    <p className="text-sm text-muted-foreground">Our team works with you until your issue is fully resolved.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <SmartContactForm />
            </div>
          </div>
        </div>
      </section>

      <AlternativeMethods />
      <GlobalOffices />
      <FaqStatsSection />
      <TrustSocialSection />
      <ContactCTA />
    </main>
  );
}
