'use client';

import HelpHero from './hero';
import HelpCategories from './categories';
import PopularArticles from './popular-articles';
import BeginnerGuides from './beginner-guides';
import TroubleshootingCenter from './troubleshooting';
import VideoTutorials from './video-tutorials';
import FAQCenter from './faq';
import DownloadsResources from './resources';
import SystemStatus from './system-status';
import CommunityStats from './community-stats';
import HelpCTA from './help-cta';

export function HelpClient() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <HelpHero />
      <SystemStatus />
      <HelpCategories />
      <PopularArticles />
      <BeginnerGuides />
      <TroubleshootingCenter />
      <VideoTutorials />
      <FAQCenter />
      <DownloadsResources />
      <CommunityStats />
      <HelpCTA />
      
      {/* Floating AI Assistant Widget (Simplified) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:hidden">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden group-hover:block">
            <path d="M12 2v20"></path>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </button>
      </div>
    </main>
  );
}
