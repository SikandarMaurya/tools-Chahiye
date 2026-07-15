import { motion } from 'framer-motion';
import { 
  CheckCircle2, XCircle, FileText, User, Lock, AlertTriangle, 
  Copyright, CreditCard, ShieldAlert, Scale
} from 'lucide-react';

export function ContentSections() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      
      {/* 4. Acceptance of Terms */}
      <section id="acceptance" className="scroll-mt-28">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl m-0">Acceptance of Terms</h2>
        </div>
        <div className="bg-muted/50 rounded-2xl p-6 border mb-8">
          <p className="m-0 text-foreground font-medium">
            By accessing or using toolschahiye, you agree to be bound by these Terms & Conditions and all applicable laws and regulations.
          </p>
        </div>
        <p>
          If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
        </p>
      </section>

      {/* 5. Eligibility */}
      <section id="eligibility" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-3xl m-0">Eligibility</h2>
        </div>
        <ul className="space-y-4 list-none pl-0">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
            <span><strong>Minimum Age:</strong> You must be at least 13 years old to use our services (or older if required by your country's laws).</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
            <span><strong>Legal Capacity:</strong> You must have the legal capacity to enter into a binding contract.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-1" />
            <span><strong>Authorization:</strong> If using the platform on behalf of a company, you must be authorized to accept these terms on their behalf.</span>
          </li>
        </ul>
      </section>

      {/* 6. User Accounts */}
      <section id="accounts" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-3xl m-0">User Accounts</h2>
        </div>
        <p>
          When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
        </p>
        <p>
          You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
        </p>
        <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20 text-orange-800 dark:text-orange-200">
          <p className="m-0">
            <strong>Account Security:</strong> You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
          </p>
        </div>
      </section>

      {/* 7. Acceptable Use Policy */}
      <section id="acceptable-use" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-3xl m-0">Acceptable Use Policy</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-green-500/5 rounded-2xl p-6 border border-green-500/20">
            <h3 className="text-xl text-green-700 dark:text-green-400 mt-0 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Allowed Uses
            </h3>
            <ul className="space-y-2 list-none pl-0 m-0">
              <li>✓ Personal projects</li>
              <li>✓ Business documentation</li>
              <li>✓ Educational materials</li>
              <li>✓ Professional workflows</li>
            </ul>
          </div>
          
          <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
            <h3 className="text-xl text-red-700 dark:text-red-400 mt-0 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5" /> Prohibited Uses
            </h3>
            <ul className="space-y-2 list-none pl-0 m-0">
              <li>✗ Illegal activities or content</li>
              <li>✗ Spam or malware distribution</li>
              <li>✗ Copyright infringement</li>
              <li>✗ Automated scraping or API abuse</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Tool Usage */}
      <section id="tool-usage" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Tool Usage & Fair Use</h2>
        <p>
          Our platform provides access to computationally intensive tools (PDF conversion, AI processing, image manipulation). We operate under a Fair Usage Policy to ensure high quality of service for all users.
        </p>
        <ul>
          <li><strong>Temporary Processing:</strong> Files are processed on secure servers and automatically deleted shortly after processing.</li>
          <li><strong>Processing Limits:</strong> Free accounts have specific rate limits and file size restrictions to prevent abuse.</li>
          <li><strong>Premium Limits:</strong> Premium accounts enjoy significantly higher limits, but are still subject to reasonable usage caps to prevent automated exploitation.</li>
        </ul>
      </section>

      {/* 9. AI Services */}
      <section id="ai-services" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-indigo-500" />
          </div>
          <h2 className="text-3xl m-0">AI Services</h2>
        </div>
        <p>
          Some of our tools utilize Artificial Intelligence (AI) and Machine Learning models. When using these services, you acknowledge that:
        </p>
        <div className="bg-muted/50 rounded-2xl p-6 border">
          <ul className="m-0 space-y-2">
            <li>AI-generated results may vary and are not guaranteed to be 100% accurate or reliable.</li>
            <li>You are responsible for reviewing and verifying AI outputs before relying on them in professional contexts.</li>
            <li>Availability of specific AI models may change without notice based on our upstream providers.</li>
            <li>You must not use AI tools to generate harmful, misleading, or illegal content.</li>
          </ul>
        </div>
      </section>

      {/* 10. Intellectual Property */}
      <section id="intellectual-property" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Intellectual Property Rights</h2>
        <p>
          The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of toolschahiye and its licensors.
        </p>
        <p>
          Our trademarks, trade dress, logos, and design assets may not be used in connection with any product or service without the prior written consent of toolschahiye.
        </p>
      </section>

      {/* 11. User Content */}
      <section id="user-content" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">User Content</h2>
        <p>
          <strong>You retain all your rights to any Content you submit, post or display on or through the Service.</strong>
        </p>
        <p>
          By uploading files to our platform for processing, you grant us a temporary, limited license solely to process the files as requested by you. We do not claim ownership of your files, and we do not use your files to train our AI models unless explicitly stated otherwise.
        </p>
      </section>

      {/* 12. Payments & Subscriptions */}
      <section id="payments" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-emerald-500" />
          </div>
          <h2 className="text-3xl m-0">Payments & Subscriptions</h2>
        </div>
        <p>
          Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (Billing Cycle), depending on the type of subscription plan you select.
        </p>
        <ul>
          <li><strong>Renewals:</strong> Subscriptions automatically renew under the exact same conditions unless you cancel it or we cancel it.</li>
          <li><strong>Cancellations:</strong> You may cancel your subscription renewal either through your online account management page or by contacting our customer support team.</li>
          <li><strong>Refunds:</strong> Except when required by law, paid subscription fees are non-refundable.</li>
          <li><strong>Taxes:</strong> All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities.</li>
        </ul>
      </section>

      {/* 14. Service Availability */}
      <section id="availability" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Service Availability</h2>
        <p>
          We are constantly updating our offerings. We may experience delays in updating information on the Service and in our advertising on other web sites.
        </p>
        <p>
          We cannot and do not guarantee the accuracy or completeness of any information, including prices, product images, specifications, availability, and services. We reserve the right to change or update information and to correct errors, inaccuracies, or omissions at any time without prior notice.
        </p>
      </section>

      {/* 15. Disclaimer & 16. Liability */}
      <section id="disclaimer" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Disclaimer of Warranties</h2>
        <div className="bg-muted/50 rounded-2xl p-6 border uppercase tracking-wider text-sm font-semibold">
          <p className="m-0 leading-relaxed">
            The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
        </div>
      </section>

      <section id="liability" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Limitation of Liability</h2>
        <p>
          In no event shall toolschahiye, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content.
        </p>
      </section>

      {/* 17. Copyright */}
      <section id="copyright" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Copyright className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-3xl m-0">Copyright Policy</h2>
        </div>
        <p>
          We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes the copyright or other intellectual property infringement of any person.
        </p>
        <p>
          If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, you must submit your notice in writing to the attention of "Copyright Agent" via email.
        </p>
      </section>

      {/* 18. Termination */}
      <section id="termination" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Account Termination</h2>
        <p>
          We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
        </p>
        <p>
          Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or delete your account through the settings dashboard.
        </p>
      </section>

      {/* 19. Governing Law */}
      <section id="governing-law" className="scroll-mt-28 mt-20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-slate-500" />
          </div>
          <h2 className="text-3xl m-0">Governing Law</h2>
        </div>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which toolschahiye is established, without regard to its conflict of law provisions.
        </p>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
      </section>

      {/* 20. Changes */}
      <section id="updates" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl">Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <p>
          By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>
      </section>

      {/* 21. Contact */}
      <section id="contact" className="scroll-mt-28 mt-20">
        <h2 className="text-3xl mb-8">Contact Legal Team</h2>
        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
          <p className="mt-0 mb-6 text-lg">
            If you have any questions about these Terms, please contact our legal team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:legal@toolschahiye.com"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors no-underline"
            >
              legal@toolschahiye.com
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
