import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export function TrustSection() {
  return (
    <section className="mt-20 pt-20 border-t pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Transparent Policies</h3>
          <p className="text-sm text-muted-foreground">Clear, understandable terms without hidden legal loopholes.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Enterprise Security</h3>
          <p className="text-sm text-muted-foreground">State-of-the-art encryption and security protocols safeguard your data.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-2">Reliable Platform</h3>
          <p className="text-sm text-muted-foreground">Meeting the strict compliance and uptime requirements of businesses worldwide.</p>
        </div>
      </div>
    </section>
  );
}
