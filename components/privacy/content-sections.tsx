import { motion } from 'framer-motion';
import { 
  User, Mail, UploadCloud, MonitorSmartphone, Globe, Fingerprint, 
  Settings, Zap, Shield, HelpCircle, Activity, 
  Eye, FileText, Cpu, Trash2, Key, AlertTriangle
} from 'lucide-react';

const SectionHeader = ({ title, id }: { title: string, id: string }) => (
  <div id={id} className="pt-8 mb-6">
    <h2 className="text-3xl font-bold font-display tracking-tight scroll-mt-24">{title}</h2>
  </div>
);

export function ContentSections() {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-20">
      
      {/* 1. Information We Collect */}
      <section>
        <SectionHeader id="collection" title="1. Information We Collect" />
        <p className="text-lg text-muted-foreground mb-8">
          We collect information to provide better services to all our users. We only collect what is strictly necessary for our tools to function properly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          {[
            { icon: User, title: "Account Information", desc: "Name, email, and preferences if you create an account." },
            { icon: UploadCloud, title: "Uploaded Files", desc: "Temporarily stored while processing your requests." },
            { icon: MonitorSmartphone, title: "Device Information", desc: "Browser type, OS, and screen resolution for optimization." },
            { icon: Fingerprint, title: "Usage Data", desc: "Anonymous interactions with our tools." }
          ].map((item, i) => (
            <div key={i} className="bg-background border rounded-2xl p-6 shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-base mb-2">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. How We Use Information */}
      <section>
        <SectionHeader id="usage" title="2. How We Use Information" />
        <p className="text-lg text-muted-foreground mb-8">
          We use the information we collect for the following purposes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 not-prose">
          {[
            { icon: Zap, title: "Improve Services", color: "bg-blue-500/10 text-blue-500" },
            { icon: Shield, title: "Authentication", color: "bg-green-500/10 text-green-500" },
            { icon: Activity, title: "Performance", color: "bg-purple-500/10 text-purple-500" },
            { icon: HelpCircle, title: "Customer Support", color: "bg-orange-500/10 text-orange-500" },
            { icon: Settings, title: "Personalization", color: "bg-pink-500/10 text-pink-500" },
            { icon: Key, title: "Security", color: "bg-red-500/10 text-red-500" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 bg-background border rounded-2xl p-4 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">{item.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. File Privacy */}
      <section>
        <SectionHeader id="files" title="3. File Privacy" />
        <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 not-prose">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center shrink-0 shadow-sm border">
              <Eye className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Your files remain yours</h3>
              <ul className="space-y-4">
                {[
                  "Uploaded files are processed securely over HTTPS.",
                  "Temporary storage only during active processing.",
                  "Automatic deletion after processing is complete.",
                  "No manual human access to your files.",
                  "No AI training using uploaded files unless explicitly stated."
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI Services */}
      <section>
        <SectionHeader id="ai" title="4. AI Services" />
        <div className="flex flex-col md:flex-row gap-8 items-center bg-background border rounded-3xl p-8 not-prose">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-4">AI Processing Guidelines</h3>
            <p className="text-muted-foreground mb-6">
              When you use our AI-powered tools (like content generators, summarizers, or smart editors), your inputs are processed securely.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Cpu className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">Requests are sent to our trusted third-party AI providers via secure APIs.</p>
              </div>
              <div className="flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">Temporary processing only; your inputs are not retained by providers.</p>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm">We strictly opt-out of data sharing for AI model training.</p>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-muted/50 rounded-2xl flex items-center justify-center border">
            <Cpu className="w-24 h-24 text-muted-foreground/30" />
          </div>
        </div>
      </section>

      {/* 5. Cookies */}
      <section>
        <SectionHeader id="cookies" title="5. Cookies" />
        <p className="mb-6">
          Cookies are small text files stored on your device that help us provide and improve our services.
        </p>
        <div className="space-y-4 not-prose">
          {[
            { name: "Essential Cookies", desc: "Required for basic site functionality and security. Cannot be disabled." },
            { name: "Preference Cookies", desc: "Remember your settings (like dark mode or language)." },
            { name: "Analytics Cookies", desc: "Help us understand how visitors interact with the website." },
            { name: "Marketing Cookies", desc: "Used to deliver relevant advertisements (if applicable)." }
          ].map((cookie, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-background shadow-sm gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-1">{cookie.name}</h4>
                <p className="text-xs text-muted-foreground">{cookie.desc}</p>
              </div>
              <div className="shrink-0">
                {i === 0 ? (
                  <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">Always Active</span>
                ) : (
                  <div className="w-10 h-5 bg-muted rounded-full relative">
                    <div className="w-4 h-4 bg-background rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Third Party Services */}
      <section>
        <SectionHeader id="third-party" title="6. Third Party Services" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {[
            { name: "Google Analytics", usage: "Traffic Analysis" },
            { name: "Vercel / AWS", usage: "Cloud Hosting & Edge Delivery" },
            { name: "Stripe", usage: "Secure Payment Processing" },
            { name: "Resend", usage: "Transactional Emails" }
          ].map((service, i) => (
            <div key={i} className="p-4 rounded-xl border bg-background shadow-sm flex items-center justify-between">
              <span className="font-medium text-sm">{service.name}</span>
              <span className="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-md">{service.usage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Data Security */}
      <section>
        <SectionHeader id="security" title="7. Data Security" />
        <p className="mb-6">
          We implement a variety of security measures to maintain the safety of your personal information.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 not-prose">
          {["TLS 1.3 Encryption", "HTTPS Everywhere", "Secure Storage", "Rate Limiting", "Access Control", "24/7 Monitoring"].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. User Rights */}
      <section>
        <SectionHeader id="rights" title="8. Your Rights" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
          {[
            { action: "Access Data", desc: "Request a copy of your personal data." },
            { action: "Update Data", desc: "Correct any inaccurate information." },
            { action: "Delete Data", desc: "Request deletion of your account." },
            { action: "Export Data", desc: "Download your data in JSON format." }
          ].map((right, i) => (
            <div key={i} className="p-5 rounded-2xl border bg-background shadow-sm hover:border-primary/50 transition-colors group">
              <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{right.action}</h4>
              <p className="text-xs text-muted-foreground">{right.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Childrens Privacy */}
      <section>
        <SectionHeader id="children" title="9. Children's Privacy" />
        <div className="flex gap-4 p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 not-prose">
          <AlertTriangle className="w-6 h-6 text-orange-500 shrink-0" />
          <div>
            <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">Age Restriction</h4>
            <p className="text-sm text-orange-600/80 dark:text-orange-300/80">
              Our services are not directed to individuals under 16. We do not knowingly collect personal information from children under 16. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information.
            </p>
          </div>
        </div>
      </section>

      {/* 10. International */}
      <section>
        <SectionHeader id="international" title="10. International Data Transfers" />
        <p>
          Your information may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.
        </p>
      </section>

      {/* 11. Compliance */}
      <section>
        <SectionHeader id="compliance" title="11. Regional Compliance" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
          <div className="p-6 rounded-2xl border bg-background shadow-sm">
            <h4 className="font-bold text-lg mb-2">GDPR (Europe)</h4>
            <p className="text-sm text-muted-foreground">
              If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-background shadow-sm">
            <h4 className="font-bold text-lg mb-2">CCPA (California)</h4>
            <p className="text-sm text-muted-foreground">
              If you are a California resident, you have rights under the California Consumer Privacy Act regarding the sale and access of your data.
            </p>
          </div>
        </div>
      </section>

      {/* 12. Retention */}
      <section>
        <SectionHeader id="retention" title="12. Data Retention" />
        <div className="overflow-hidden border rounded-2xl not-prose bg-background">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Data Type</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Retention Period</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr>
                <td className="px-6 py-4 font-medium">Uploaded Files</td>
                <td className="px-6 py-4 text-muted-foreground">Deleted automatically within 2 hours</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Server Logs</td>
                <td className="px-6 py-4 text-muted-foreground">30 days</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Account Data</td>
                <td className="px-6 py-4 text-muted-foreground">Until account deletion</td>
              </tr>
              <tr>
                <td className="px-6 py-4 font-medium">Support Tickets</td>
                <td className="px-6 py-4 text-muted-foreground">3 years after resolution</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 13. Policy Updates */}
      <section>
        <SectionHeader id="updates" title="13. Policy Updates" />
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      {/* 14. Contact Us */}
      <section>
        <SectionHeader id="contact" title="14. Contact Privacy Team" />
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 not-prose text-center max-w-lg mx-auto">
          <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Our Data Protection Officer and privacy team are here to help you with any concerns.
          </p>
          <a 
            href="mailto:privacy@toolschahiye.com"
            className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            privacy@toolschahiye.com
          </a>
        </div>
      </section>
      
    </div>
  );
}
