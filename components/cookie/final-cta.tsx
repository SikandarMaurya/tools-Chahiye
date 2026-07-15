import Link from 'next/link';
import { ArrowRight, Settings, MessageCircle } from 'lucide-react';

export function FinalCTA() {
  const scrollToPreferences = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('preference-center');
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-orange-500 text-white py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff2a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10 text-center max-w-2xl">
        <h2 className="text-4xl font-bold font-display tracking-tight mb-6">
          Questions About Cookies?
        </h2>
        <p className="text-white/80 text-lg mb-10">
          We want you to feel confident and in control of your data. Let us know if you need any help managing your preferences.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#preference-center"
            onClick={scrollToPreferences}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-white text-orange-600 font-medium text-sm hover:bg-white/90 transition-colors w-full sm:w-auto"
          >
            <Settings className="w-4 h-4 mr-2" />
            Manage Preferences
          </a>
          <Link 
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-black/10 text-white font-medium text-sm hover:bg-black/20 transition-colors w-full sm:w-auto border border-white/20"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}
