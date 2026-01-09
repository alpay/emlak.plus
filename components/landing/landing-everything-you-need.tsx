"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    title: "Delivery that builds your brand",
    description:
      "Impress clients with a seamless, branded delivery experience.",
    videoUrl:
      "https://www.fotello.co/attached_assets/optimized/TV_1758206030737.mp4",
    size: "large",
  },
  {
    title: "AI Style Profiles",
    description: "Create consistent looks across all your properties.",
    videoUrl:
      "https://www.fotello.co/attached_assets/optimized/AI%20Style%20Profiles.mp4",
    size: "small",
  },
  {
    title: "Human Revision",
    description: "Get expert human touch when you need it.",
    videoUrl:
      "https://www.fotello.co/attached_assets/optimized/Human%20Revision.mp4",
    size: "small",
  },
  {
    title: "Auto Bracketing",
    description: "Automatic exposure blending for perfect HDR results.",
    videoUrl:
      "https://www.fotello.co/attached_assets/optimized/Auto%20Bracketing.mp4",
    size: "small",
  },
  {
    title: "Culling",
    description: "AI-powered photo selection saves hours of manual work.",
    videoUrl: "https://www.fotello.co/attached_assets/optimized/Culling.mp4",
    size: "small",
  },
];

function FeatureCard({
  title,
  description,
  videoUrl,
  size,
}: {
  title: string;
  description: string;
  videoUrl: string;
  size: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Ensure video plays on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked, that's okay
      });
    }
  }, []);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
        size === "large" ? "md:col-span-2 md:row-span-2" : ""
      }`}
      style={{
        backgroundColor: "var(--landing-card)",
        boxShadow: "0 4px 24px -4px var(--landing-shadow)",
        border: "1px solid var(--landing-border)",
      }}
    >
      {/* Video Background */}
      <div
        className={`relative ${
          size === "large" ? "aspect-[16/9] md:aspect-[4/3]" : "aspect-video"
        }`}
      >
        <video
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          ref={videoRef}
          src={videoUrl}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute right-0 bottom-0 left-0 p-6">
          <h3 className="font-semibold text-lg text-white md:text-xl">
            {title}
          </h3>
          <p className="mt-1 text-sm text-white/80">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingEverythingYouNeed() {
  return (
    <section
      className="px-6 py-24 md:py-32"
      id="everything-you-need"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: "var(--landing-accent)" }}
          >
            Features
          </p>
          <h2
            className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--landing-text)" }}
          >
            Everything You Need
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            A complete platform designed for real estate media professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
