"use client";

import { LandingAiMagic } from "./landing-ai-magic";
import { LandingBrands } from "./landing-brands";
import { LandingCreatorSpotlight } from "./landing-creator-spotlight";
import { LandingCta } from "./landing-cta";
import { LandingEverythingYouNeed } from "./landing-everything-you-need";
import { LandingFooter } from "./landing-footer";
import { LandingHero } from "./landing-hero";
import { LandingNav } from "./landing-nav";
import { LandingTestimonials } from "./landing-testimonials";
import { LandingValueProp } from "./landing-value-prop";

export function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <LandingNav />
      <main>
        {/* Hero Section */}
        <LandingHero />

        {/* Creator Spotlight - Tabbed before/after gallery */}
        <LandingCreatorSpotlight />

        {/* Brands Marquee */}
        <LandingBrands />

        {/* Value Proposition Stats */}
        <LandingValueProp />

        {/* Video Testimonials */}
        <LandingTestimonials />

        {/* Everything You Need - Features with videos */}
        <LandingEverythingYouNeed />

        {/* One-Click AI Magic - Before/After Slider */}
        <LandingAiMagic />

        {/* Final CTA */}
        <LandingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
