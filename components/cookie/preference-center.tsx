import { useState, useEffect } from 'react';
import { ShieldAlert, BarChart3, Settings, Check } from 'lucide-react';
import { motion } from 'framer-motion';

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
};

export function PreferenceCenter() {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true
    analytics: false,
    preferences: false,
  });
  
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Load preferences from local storage if available
    const saved = localStorage.getItem('cookie_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse cookie preferences', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('cookie_preferences', JSON.stringify(preferences));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    const all = { essential: true, analytics: true, preferences: true };
    setPreferences(all);
    localStorage.setItem('cookie_preferences', JSON.stringify(all));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRejectAll = () => {
    const none = { essential: true, analytics: false, preferences: false };
    setPreferences(none);
    localStorage.setItem('cookie_preferences', JSON.stringify(none));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-background rounded-3xl border shadow-sm p-6 sm:p-8">
      <div className="space-y-6">
        
        {/* Essential */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
              <ShieldAlert className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Essential Cookies</h4>
              <p className="text-sm text-muted-foreground">Required for the website to function properly. Cannot be disabled.</p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-sm font-medium text-green-600 dark:text-green-500">Always Active</span>
            <div className="w-12 h-6 rounded-full bg-green-500/20 relative">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Analytics Cookies</h4>
              <p className="text-sm text-muted-foreground">Help us understand how you use our platform so we can improve it.</p>
            </div>
          </div>
          <div className="shrink-0">
            <button 
              onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
              className={`w-12 h-6 rounded-full relative transition-colors ${preferences.analytics ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}
              aria-pressed={preferences.analytics}
              aria-label="Toggle Analytics Cookies"
            >
              <motion.div 
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ left: preferences.analytics ? 'calc(100% - 20px)' : '4px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
              <Settings className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Preference Cookies</h4>
              <p className="text-sm text-muted-foreground">Remember your settings like dark mode or language preferences.</p>
            </div>
          </div>
          <div className="shrink-0">
            <button 
              onClick={() => setPreferences(prev => ({ ...prev, preferences: !prev.preferences }))}
              className={`w-12 h-6 rounded-full relative transition-colors ${preferences.preferences ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}
              aria-pressed={preferences.preferences}
              aria-label="Toggle Preference Cookies"
            >
              <motion.div 
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                animate={{ left: preferences.preferences ? 'calc(100% - 20px)' : '4px' }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>

      </div>

      <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button 
            onClick={handleRejectAll}
            className="px-5 py-2.5 rounded-full text-sm font-medium border bg-background hover:bg-muted transition-colors flex-1 sm:flex-none text-center"
          >
            Reject Non-Essential
          </button>
          <button 
            onClick={handleAcceptAll}
            className="px-5 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex-1 sm:flex-none text-center"
          >
            Accept All
          </button>
        </div>
        <button 
          onClick={handleSave}
          className="w-full sm:w-auto px-6 py-2.5 rounded-full text-sm font-medium bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" /> Saved!
            </>
          ) : (
            "Save Preferences"
          )}
        </button>
      </div>
    </div>
  );
}
