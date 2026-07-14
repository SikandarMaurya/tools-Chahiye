import Link from "next/link";
import { Zap, Shield, LayoutGrid, CheckCircle2 } from "lucide-react";
import { toolsData, allTools } from "@/lib/tools";
import ToolSearch from "@/components/tool-search";

import { Suspense } from "react";
import { FAQAccordion } from "@/components/faq-accordion";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <HomeInner />
    </Suspense>
  );
}

function HomeInner() {
  const popularTools = allTools.filter((t) => t.isPopular).slice(0, 4);
  const featuredTools = allTools
    .filter((t) => t.isNew || t.isPopular)
    .slice(0, 9);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 lg:py-32 border-b">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
        <div className="container mx-auto px-4 relative flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
            ✨ Platform v1.0 is live
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl">
            The Ultimate <span className="text-primary">Multi-Tool</span>{" "}
            Platform for Creators & Developers
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Access 100+ professional AI, PDF, Image, and Developer tools in one
            blazing-fast, secure platform.
          </p>

          <div className="w-full max-w-2xl mb-10">
            <ToolSearch />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                Explore Categories
              </h2>
              <p className="text-muted-foreground">
                Find exactly what you need across our specialized toolkits.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {toolsData.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="group flex flex-col p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className="p-3 bg-primary/10 text-primary w-fit rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {cat.description}
                </p>
                <div className="mt-auto text-xs font-medium text-muted-foreground">
                  {cat.tools.length} tools available
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features/Benefits */}
      <section className="py-20 bg-muted/50 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-background rounded-full shadow-sm border mb-5">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Blazing Fast</h3>
              <p className="text-muted-foreground">
                Built on modern architecture for instant loading and processing
                times.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-background rounded-full shadow-sm border mb-5">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground">
                Client-side processing where possible, keeping your sensitive
                data safe.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-background rounded-full shadow-sm border mb-5">
                <LayoutGrid className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Everything in One Place
              </h3>
              <p className="text-muted-foreground">
                Stop jumping between 10 different websites. Get all your tools
                here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <FAQAccordion
              faqs={[
                {
                  question: "Are all tools free to use?",
                  answer:
                    "Yes, the core functionality of all our tools is completely free. We may introduce premium features for heavy users in the future.",
                },
                {
                  question: "Do you store my uploaded files?",
                  answer:
                    "No. Most of our tools process data locally in your browser. For tools that require server processing, files are deleted immediately after.",
                },
                {
                  question: "How often are new tools added?",
                  answer:
                    "We add new tools weekly based on community requests and emerging technologies.",
                },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
