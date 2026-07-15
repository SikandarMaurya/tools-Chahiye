import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'collection', title: 'Information We Collect' },
  { id: 'usage', title: 'How We Use Information' },
  { id: 'files', title: 'File Privacy' },
  { id: 'ai', title: 'AI Services' },
  { id: 'cookies', title: 'Cookies' },
  { id: 'third-party', title: 'Third Party Services' },
  { id: 'security', title: 'Data Security' },
  { id: 'rights', title: 'User Rights' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'international', title: 'International Users' },
  { id: 'compliance', title: 'GDPR / CCPA' },
  { id: 'retention', title: 'Data Retention' },
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
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-1 h-4 rounded-full transition-colors ${
                    activeSection === id ? 'bg-primary' : 'bg-transparent'
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
