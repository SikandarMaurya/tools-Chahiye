import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const hasConsented = localStorage.getItem('cookie_preferences');
    if (!hasConsented) {
      // Delay showing the banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, preferences: true };
    localStorage.setItem('cookie_preferences', JSON.stringify(all));
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const none = { essential: true, analytics: false, preferences: false };
    localStorage.setItem('cookie_preferences', JSON.stringify(none));
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-50 md:max-w-sm"
        >
          <div className="bg-background/80 backdrop-blur-xl border border-border/50 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button 
                onClick={() => setIsVisible(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-orange-500" />
              </div>
              <h3 className="font-semibold text-lg">We value your privacy</h3>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleAcceptAll}
                className="w-full py-2.5 rounded-full text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                Accept All
              </button>
              <button 
                onClick={handleRejectNonEssential}
                className="w-full py-2.5 rounded-full text-sm font-medium bg-muted text-foreground hover:bg-muted/80 transition-colors"
              >
                Reject Non-Essential
              </button>
              <Link 
                href="/cookie" 
                onClick={() => setIsVisible(false)}
                className="w-full py-2.5 rounded-full text-sm font-medium border border-border bg-background hover:bg-muted/50 transition-colors text-center"
              >
                Customize Settings
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
