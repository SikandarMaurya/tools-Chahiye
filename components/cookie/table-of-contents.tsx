import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'what-are-cookies', title: 'What Are Cookies?' },
  { id: 'cookie-types', title: 'Types of Cookies We Use' },
  { id: 'cookie-usage', title: 'How We Use Cookies' },
  { id: 'third-party', title: 'Third-Party Cookies' },
  { id: 'preference-center', title: 'Cookie Preferences' },
  { id: 'browser-management', title: 'Browser Management' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'user-rights', title: 'Your Privacy Rights' },
  { id: 'updates', title: 'Policy Updates' },
  { id: 'contact', title: 'Contact Us' }
];

export function TableOfContents() {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-background rounded-2xl border p-6 shadow-sm">
      <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-6">Contents</h3>
      <ul className="space-y-3">
        {sections.map(({ id, title }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              className={`text-sm text-left w-full transition-colors ${
                activeSection === id
                  ? 'text-orange-500 font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-1 h-4 rounded-full transition-colors ${
                    activeSection === id ? 'bg-orange-500' : 'bg-transparent'
                  }`} 
                />
                {title}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
