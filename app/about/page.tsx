import { Metadata } from "next";
import AboutClient from "@/components/about-client";

export const metadata: Metadata = {
  title: "About Us | toolschahiye Platform",
  description:
    "Learn about toolschahiye, the ultimate AI-powered multi-tool platform for PDF, Image, Developer, and SEO tools.",
  openGraph: {
    title: "About Us | toolschahiye Platform",
    description:
      "Learn about toolschahiye, the ultimate AI-powered multi-tool platform for PDF, Image, Developer, and SEO tools.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | toolschahiye Platform",
    description:
      "Learn about toolschahiye, the ultimate AI-powered multi-tool platform.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
