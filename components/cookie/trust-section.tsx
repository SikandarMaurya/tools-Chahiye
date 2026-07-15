import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="mt-20 pt-20 border-t pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Privacy First</h3>
          <p className="text-sm text-muted-foreground">We only use cookies to improve your experience, never to sell your data.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Secure Browsing</h3>
          <p className="text-sm text-muted-foreground">Our cookies use modern encryption to keep your sessions secure.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-orange-500" />
          </div>
          <h3 className="font-bold text-lg mb-2">Transparent Policies</h3>
          <p className="text-sm text-muted-foreground">You have full control over what data is collected and how it is used.</p>
        </div>
      </div>
    </section>
  );
}
