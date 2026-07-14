"use client";

import HeroSection from "./about/hero";
import TimelineSection from "./about/timeline";
import MissionVisionSection from "./about/mission-vision";
import CoreValuesSection from "./about/core-values";
import WhyChooseUsSection from "./about/why-choose-us";
import StatisticsSection from "./about/stats";
import TechStackSection from "./about/tech-stack";
import SecuritySection from "./about/security";
import AIPlatformSection from "./about/ai-platform";
import CategoriesSection from "./about/categories";
import GlobalAvailabilitySection from "./about/global-availability";
import TestimonialsSection from "./about/testimonials";
import SustainabilitySection from "./about/sustainability";
import FAQSection from "./about/faq";
import FinalCTASection from "./about/final-cta";

export default function AboutClient() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <TimelineSection />
      <MissionVisionSection />
      <CoreValuesSection />
      <WhyChooseUsSection />
      <StatisticsSection />
      <TechStackSection />
      <SecuritySection />
      <AIPlatformSection />
      <CategoriesSection />
      <GlobalAvailabilitySection />
      <TestimonialsSection />
      <SustainabilitySection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
