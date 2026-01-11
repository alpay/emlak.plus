"use client";

import { useTranslation } from "react-i18next";

// Brand logos from Fotello's partners section
const brandLogos = [
  {
    name: "Click Splash Wow",
    src: "https://www.fotello.co/assets/customer-logos/click-splash-wow.webp",
  },
  {
    name: "David Allen Productions",
    src: "https://www.fotello.co/assets/customer-logos/david-allen-productions.webp",
  },
  {
    name: "Jay Bentley",
    src: "https://www.fotello.co/assets/customer-logos/jay-bentley.webp",
  },
  {
    name: "Black Clover Media",
    src: "https://www.fotello.co/assets/customer-logos/black-clover-media.webp",
  },
  {
    name: "Property Insights",
    src: "https://www.fotello.co/assets/customer-logos/property-insights.webp",
  },
  {
    name: "Stone and Story",
    src: "https://www.fotello.co/assets/customer-logos/stone-and-story.webp",
  },
  {
    name: "3D Casas",
    src: "https://www.fotello.co/assets/customer-logos/3dcasas.webp",
  },
];

export function LandingBrands() {
  const { t } = useTranslation();
  // Double the logos for seamless infinite scroll
  const duplicatedLogos = [...brandLogos, ...brandLogos];

  return (
    <section
      className="overflow-hidden py-16"
      style={{ backgroundColor: "var(--landing-bg-alt)" }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <p
          className="mb-10 text-center font-semibold text-xs uppercase tracking-widest"
          style={{ color: "var(--landing-text-muted)" }}
        >
          {t("landing.brands.empowering")}
        </p>

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24"
            style={{
              background:
                "linear-gradient(to right, var(--landing-bg-alt), transparent)",
            }}
          />
          <div
            className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24"
            style={{
              background:
                "linear-gradient(to left, var(--landing-bg-alt), transparent)",
            }}
          />

          {/* Scrolling Logos */}
          <div className="flex animate-marquee items-center gap-16">
            {duplicatedLogos.map((logo, index) => (
              <div
                className="flex-shrink-0 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                key={`${logo.name}-${index}`}
              >
                <img
                  alt={logo.name}
                  className="h-10 w-auto object-contain md:h-12"
                  src={logo.src}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add marquee keyframes via style tag */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
