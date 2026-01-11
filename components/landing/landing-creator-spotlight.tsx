"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

// Showcase data - property tabs with before/after images
const showcaseData = [
  {
    id: 1,
    label: "Beltrand - 1845 SE 7th St",
    logo: "https://www.fotello.co/showcase-optimized/1/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 2,
    label: "Terre Haute, IN",
    logo: "https://www.fotello.co/showcase-optimized/2/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 3,
    label: "Watchek - 99th Ave",
    logo: "https://www.fotello.co/showcase-optimized/3/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 4,
    label: "Rosebrook Main Shoot",
    logo: "https://www.fotello.co/showcase-optimized/4/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 5,
    label: "309 Germany Road",
    logo: "https://www.fotello.co/showcase-optimized/5/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 6,
    label: "2040 Laurel Ave NE",
    logo: "https://www.fotello.co/showcase-optimized/6/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 7,
    label: "78 Old Pasture Road",
    logo: "https://www.fotello.co/showcase-optimized/7/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
  {
    id: 8,
    label: "Ash St, Chelsea",
    logo: "https://www.fotello.co/showcase-optimized/8/logo.webp",
    images: [1, 2, 3, 4, 5, 6],
  },
];

function getImageUrl(
  tabId: number,
  type: "before" | "after",
  imageNum: number
): string {
  return `https://www.fotello.co/showcase-optimized/${tabId}/${type}/${imageNum}.webp`;
}

export function LandingCreatorSpotlight() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const activeShowcase = showcaseData[activeTab];

  return (
    <section
      className="px-6 py-24 md:py-32"
      id="creator-spotlight"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: "var(--landing-accent)" }}
          >
            {t("landing.spotlight.eyebrow")}
          </p>
          <h2
            className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--landing-text)" }}
          >
            {t("landing.spotlight.title")}
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("landing.spotlight.subtitle")}
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {showcaseData.map((showcase, index) => (
            <button
              className={`rounded-full px-4 py-2 font-medium text-sm transition-all duration-200 ${
                activeTab === index
                  ? "scale-105"
                  : "opacity-70 hover:scale-[1.02] hover:opacity-100"
              }`}
              key={showcase.id}
              onClick={() => setActiveTab(index)}
              style={{
                backgroundColor:
                  activeTab === index
                    ? "var(--landing-accent)"
                    : "var(--landing-card)",
                color:
                  activeTab === index
                    ? "var(--landing-accent-foreground)"
                    : "var(--landing-text)",
                border:
                  activeTab === index
                    ? "none"
                    : "1px solid var(--landing-border)",
              }}
              type="button"
            >
              {showcase.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="mt-10">
          {/* Creator Logo */}

          {/* Before/After Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeShowcase.images.map((imageNum) => (
              <div
                className="group relative overflow-hidden rounded-2xl"
                key={`${activeShowcase.id}-${imageNum}`}
                style={{
                  backgroundColor: "var(--landing-card)",
                  border: "1px solid var(--landing-border)",
                }}
              >
                {/* Before/After Container */}
                <div className="relative aspect-[4/3]">
                  {/* Before Image */}
                  <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
                    <Image
                      alt={`Before - ${activeShowcase.label} photo ${imageNum}`}
                      className="object-cover"
                      fill
                      src={getImageUrl(activeShowcase.id, "before", imageNum)}
                      unoptimized
                    />
                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 font-medium text-xs"
                      style={{
                        backgroundColor: "var(--landing-bg-alt)",
                        color: "var(--landing-text-muted)",
                        border: "1px solid var(--landing-border)",
                      }}
                    >
                      Before
                    </span>
                  </div>

                  {/* After Image */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Image
                      alt={`After - ${activeShowcase.label} photo ${imageNum}`}
                      className="object-cover"
                      fill
                      src={getImageUrl(activeShowcase.id, "after", imageNum)}
                      unoptimized
                    />
                    <span
                      className="absolute top-3 left-3 rounded-full px-3 py-1 font-medium text-xs"
                      style={{
                        backgroundColor: "var(--landing-accent)",
                        color: "var(--landing-accent-foreground)",
                      }}
                    >
                      After
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hover Hint */}
          <p
            className="mt-6 text-center text-sm"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("landing.spotlight.hint")}
          </p>
        </div>
      </div>
    </section>
  );
}
