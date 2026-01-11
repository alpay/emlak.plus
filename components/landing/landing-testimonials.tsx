"use client";

import { IconPlayerPlay, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const testimonials = [
  {
    id: 1,
    name: "Natalia Diakon",
    company: "3D Casas",
    youtubeId: "HFMtueRrTTw",
    thumbnail: "https://img.youtube.com/vi/HFMtueRrTTw/maxresdefault.jpg",
  },
  {
    id: 2,
    name: "Steven Tippet",
    company: "Professional Photography",
    youtubeId: "q_u7XTk_zZc",
    thumbnail: "https://img.youtube.com/vi/q_u7XTk_zZc/maxresdefault.jpg",
  },
  {
    id: 3,
    name: "Dan Richard",
    company: "Propicsta",
    youtubeId: "MCyFDhwJiHg",
    thumbnail: "https://img.youtube.com/vi/MCyFDhwJiHg/maxresdefault.jpg",
  },
  {
    id: 4,
    name: "Amit Kumar",
    company: "Property Insights",
    youtubeId: "4Wek4RP1nrk",
    thumbnail: "https://img.youtube.com/vi/4Wek4RP1nrk/maxresdefault.jpg",
  },
];

export function LandingTestimonials() {
  const { t } = useTranslation();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section
      className="px-6 py-24 md:py-32"
      id="testimonials"
      style={{ backgroundColor: "var(--landing-bg-alt)" }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="font-semibold text-sm uppercase tracking-wider"
            style={{ color: "var(--landing-accent)" }}
          >
            {t("landing.testimonials.eyebrow")}
          </p>
          <h2
            className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--landing-text)" }}
          >
            {t("landing.testimonials.title")}
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("landing.testimonials.subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial) => (
            <div
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
              key={testimonial.id}
              style={{
                backgroundColor: "var(--landing-card)",
                boxShadow: "0 4px 24px -4px var(--landing-shadow)",
                border: "1px solid var(--landing-border)",
              }}
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-[9/16] sm:aspect-video lg:aspect-[9/12]">
                <img
                  alt={`${testimonial.name} testimonial`}
                  className="absolute inset-0 h-full w-full object-cover"
                  src={testimonial.thumbnail}
                />

                {/* Play Button Overlay */}
                <button
                  aria-label={`Play ${testimonial.name}'s testimonial`}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
                  onClick={() => setActiveVideo(testimonial.youtubeId)}
                  type="button"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                    <IconPlayerPlay
                      className="ml-1 size-7"
                      style={{ color: "var(--landing-accent)" }}
                    />
                  </div>
                </button>

                {/* Quote Overlay */}
                <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="font-medium text-sm text-white">
                    &quot;{t(`landing.testimonials.quotes.${testimonial.id}`)}&quot;
                  </p>
                  <p className="mt-2 text-white/80 text-xs">
                    {testimonial.name} · {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute -top-12 right-0 flex items-center gap-2 text-white/80 hover:text-white"
              onClick={() => setActiveVideo(null)}
              type="button"
            >
              <span className="text-sm">Close</span>
              <IconX className="size-5" />
            </button>

            {/* YouTube Embed */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Testimonial Video"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
