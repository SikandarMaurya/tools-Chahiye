import { motion } from 'framer-motion';
import { 
  Cookie, ShieldAlert, BarChart3, Settings, Globe, Smartphone, Clock, UserCheck
} from 'lucide-react';
import { PreferenceCenter } from './preference-center';

export function ContentSections() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline">
      
      {/* 4. What Are Cookies? */}
      <section id="what-are-cookies" className="scroll-mt-28">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
            <Cookie className="w-5 h-5 text-orange-500" />
          </div>
          <h2 className="text-3xl m-0">What Are Cookies?</h2>
        </div>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8 not-prose">
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h4 className="font-semibold mb-2">Session Cookies</h4>
            <p className="text-sm text-muted-foreground">These are temporary cookies that expire (and are automatically erased) whenever you close your browser.</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h4 className="font-semibold mb-2">Persistent Cookies</h4>
            <p className="text-sm text-muted-foreground">These usually have an expiration date far into the future and thus stay in your browser until they expire, or until you manually delete them.</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h4 className="font-semibold mb-2">First-Party Cookies</h4>
            <p className="text-sm text-muted-foreground">Cookies placed directly by toolschahiye to ensure core site functionality.</p>
          </div>
          <div className="bg-muted/30 rounded-2xl p-6 border border-border/50">
            <h4 className="font-semibold mb-2">Third-Party Cookies</h4>
            <p className="text-sm text-muted-foreground">Cookies placed by our trusted partners for analytics and specialized features.</p>
          </div>
        </div>
      </section>

      {/* 5. Types of Cookies We Use */}
      <section id="cookie-types" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Types of Cookies We Use</h2>
        <p>We classify cookies into the following categories to help you understand their purpose and manage them effectively:</p>
        
        <div className="space-y-6 mt-8 not-prose">
          <div className="bg-background rounded-2xl border p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold text-lg">Essential Cookies</h4>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-full">Always Active</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Strictly necessary for the website to function. Without these, core features like secure login and saving your privacy preferences wouldn't work.</p>
            <div className="text-xs flex gap-4 text-muted-foreground">
              <span><strong>Duration:</strong> Session & 1 Year</span>
            </div>
          </div>

          <div className="bg-background rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-lg">Analytics Cookies</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Help us understand how visitors interact with our platform by collecting and reporting information anonymously. We use this data to improve our tools.</p>
            <div className="text-xs flex gap-4 text-muted-foreground">
              <span><strong>Duration:</strong> Up to 2 Years</span>
              <span><strong>Opt-out:</strong> Available</span>
            </div>
          </div>

          <div className="bg-background rounded-2xl border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-lg">Preference Cookies</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Enable the website to remember information that changes the way the website behaves or looks, like your preferred language or the region you are in.</p>
            <div className="text-xs flex gap-4 text-muted-foreground">
              <span><strong>Duration:</strong> 1 Year</span>
              <span><strong>Opt-out:</strong> Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How We Use Cookies */}
      <section id="cookie-usage" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">How We Use Cookies</h2>
        <p>Our platform uses cookies for several vital functions:</p>
        <ul>
          <li><strong>Authentication:</strong> Keeping you logged in as you navigate between different tools.</li>
          <li><strong>Security:</strong> Detecting malicious activity and protecting your data from unauthorized access.</li>
          <li><strong>Preferences:</strong> Remembering if you prefer Light Mode or Dark Mode.</li>
          <li><strong>Performance:</strong> Routing traffic effectively to ensure fast loading times across all regions.</li>
        </ul>
      </section>

      {/* 7. Third-Party Cookies */}
      <section id="third-party" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-3xl m-0">Third-Party Cookies</h2>
        </div>
        <p>
          In some special cases, we also use cookies provided by trusted third parties. The following details third-party cookies you might encounter through this site:
        </p>
        <div className="bg-muted/30 rounded-2xl p-6 border mt-6 overflow-x-auto not-prose">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase border-b">
              <tr>
                <th className="px-4 py-3 font-medium">Provider</th>
                <th className="px-4 py-3 font-medium">Purpose</th>
                <th className="px-4 py-3 font-medium">Policy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="px-4 py-4 font-medium text-foreground">Google Analytics</td>
                <td className="px-4 py-4 text-muted-foreground">Usage tracking & statistics</td>
                <td className="px-4 py-4"><a href="#" className="text-orange-500 hover:underline">View Policy</a></td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-foreground">Stripe</td>
                <td className="px-4 py-4 text-muted-foreground">Secure payment processing</td>
                <td className="px-4 py-4"><a href="#" className="text-orange-500 hover:underline">View Policy</a></td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-foreground">Cloudflare</td>
                <td className="px-4 py-4 text-muted-foreground">Security and CDN performance</td>
                <td className="px-4 py-4"><a href="#" className="text-orange-500 hover:underline">View Policy</a></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Preference Center */}
      <section id="preference-center" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl mb-6">Cookie Preferences</h2>
        <p className="mb-8">Manage your cookie settings below. Please note that disabling certain cookies may impact the functionality and features of the platform.</p>
        <div className="not-prose">
          <PreferenceCenter />
        </div>
      </section>

      {/* 9. Browser Management */}
      <section id="browser-management" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-pink-500" />
          </div>
          <h2 className="text-3xl m-0">Browser Management</h2>
        </div>
        <p>
          In addition to our preference center, most browsers allow you to manage cookies saved on your device. Here are links to the official guides for popular browsers:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 not-prose">
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Google Chrome</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Mozilla Firefox</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Apple Safari</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Microsoft Edge</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Opera Browser</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center p-4 rounded-xl border bg-background hover:bg-muted/50 transition-colors text-center gap-2">
            <span className="font-medium text-sm">Brave Browser</span>
          </a>
        </div>
      </section>

      {/* 10. Data Retention */}
      <section id="data-retention" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-teal-500" />
          </div>
          <h2 className="text-3xl m-0">Data Retention</h2>
        </div>
        <p>
          We do not store cookies indefinitely. Depending on their function, cookies will remain on your device for:
        </p>
        <ul>
          <li><strong>Session duration:</strong> Deleted instantly when you close your browser.</li>
          <li><strong>Short-term duration:</strong> Persist for up to 24 hours (e.g., temporary authentication tokens).</li>
          <li><strong>Long-term duration:</strong> Persist for 1 to 2 years (e.g., theme preferences, consent records).</li>
        </ul>
      </section>

      {/* 11. User Rights */}
      <section id="user-rights" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 text-cyan-500" />
          </div>
          <h2 className="text-3xl m-0">Your Privacy Rights</h2>
        </div>
        <p>
          Depending on your location (such as under the GDPR or CCPA), you may have specific rights regarding your personal data and cookies:
        </p>
        <ul>
          <li>The right to access the data we collect via cookies.</li>
          <li>The right to withdraw your consent at any time.</li>
          <li>The right to request deletion of your personal data.</li>
        </ul>
      </section>

      {/* 12. Updates */}
      <section id="updates" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Policy Updates</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. 
          Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
      </section>

      {/* 13. Contact */}
      <section id="contact" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl mb-8">Contact Us</h2>
        <div className="bg-orange-500/5 rounded-3xl p-8 border border-orange-500/10">
          <p className="mt-0 mb-6 text-lg">
            If you have any questions about our use of cookies or other technologies, please email us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:privacy@toolschahiye.com"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors no-underline"
            >
              privacy@toolschahiye.com
            </a>
            <a 
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-background border text-foreground font-medium text-sm hover:bg-muted transition-colors no-underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
