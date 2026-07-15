import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'accounts', title: 'User Accounts' },
  { id: 'acceptable-use', title: 'Acceptable Use Policy' },
  { id: 'tool-usage', title: 'Tool Usage' },
  { id: 'ai-services', title: 'AI Services' },
  { id: 'intellectual-property', title: 'Intellectual Property' },
  { id: 'user-content', title: 'User Content' },
  { id: 'payments', title: 'Payments & Subscriptions' },
  { id: 'availability', title: 'Service Availability' },
  { id: 'disclaimer', title: 'Disclaimer of Warranties' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'copyright', title: 'Copyright Policy' },
  { id: 'termination', title: 'Account Termination' },
  { id: 'governing-law', title: 'Governing Law' },
  { id: 'updates', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact Legal Team' }
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
