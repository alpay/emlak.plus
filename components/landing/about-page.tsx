"use client";

import {
  IconHeart,
  IconRocket,
  IconSparkles,
  IconTarget,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";

const values = [
  {
    icon: IconSparkles,
    id: "quality",
  },
  {
    icon: IconRocket,
    id: "speed",
  },
  {
    icon: IconHeart,
    id: "builtForYou",
  },
  {
    icon: IconTarget,
    id: "simplePricing",
  },
];

export function AboutPage() {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <LandingNav />

      <main>
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <div className="mx-auto max-w-3xl">
            <p
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: "var(--landing-accent)" }}
            >
              {t("about.eyebrow")}
            </p>
            <h1
              className="mt-3 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("about.title")}
              <br />
              {t("about.titleLine2")}
            </h1>
            <p
              className="mt-6 text-lg leading-relaxed md:text-xl"
              style={{ color: "var(--landing-text-muted)" }}
            >
              {t("about.subtitle")}
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="px-6 pb-24">
          <div
            className="mx-auto max-w-4xl rounded-3xl p-8 md:p-12"
            style={{
              backgroundColor: "var(--landing-card)",
              boxShadow: "0 20px 40px -12px var(--landing-shadow)",
              border: "1px solid var(--landing-border)",
            }}
          >
            <h2
              className="font-bold text-2xl tracking-tight sm:text-3xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("about.story.title")}
            </h2>
            <div
              className="mt-6 space-y-4 text-base leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              <p>{t("about.story.p1")}</p>
              <p>{t("about.story.p2")}</p>
              <p>{t("about.story.p3")}</p>
              <p>{t("about.story.p4")}</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section
          className="px-6 py-24"
          style={{ backgroundColor: "var(--landing-bg-alt)" }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <p
                className="font-semibold text-sm uppercase tracking-wider"
                style={{ color: "var(--landing-accent)" }}
              >
                {t("about.values.eyebrow")}
              </p>
              <h2
                className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl"
                style={{ color: "var(--landing-text)" }}
              >
                {t("about.values.title")}
              </h2>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              {values.map((value) => (
                <div
                  className="rounded-2xl p-6"
                  key={value.id}
                  style={{
                    backgroundColor: "var(--landing-card)",
                    border: "1px solid var(--landing-border)",
                  }}
                >
                  <div
                    className="mb-4 inline-flex size-12 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: "var(--landing-bg)",
                      border: "1px solid var(--landing-border)",
                    }}
                  >
                    <value.icon
                      className="size-6"
                      style={{ color: "var(--landing-accent)" }}
                    />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--landing-text)" }}
                  >
                    {t(`about.values.items.${value.id}.title`)}
                  </h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--landing-text-muted)" }}
                  >
                    {t(`about.values.items.${value.id}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: "var(--landing-accent)" }}
            >
              {t("about.mission.eyebrow")}
            </p>
            <h2
              className="mt-3 font-bold text-3xl tracking-tight sm:text-4xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("about.mission.title")}
            </h2>
            <p
              className="mt-6 text-lg leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              {t("about.mission.desc")}
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="px-6 pb-24">
          <div
            className="mx-auto max-w-4xl rounded-3xl px-8 py-16 text-center md:px-16"
            style={{
              backgroundColor: "var(--landing-card)",
              boxShadow: "0 25px 50px -12px var(--landing-shadow)",
              border: "1px solid var(--landing-border)",
            }}
          >
            <h2
              className="font-bold text-3xl tracking-tight sm:text-4xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("about.cta.title")}
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-lg leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              {t("about.cta.subtitle")}
            </p>
            <div className="mt-8">
              <a
                className="inline-flex h-12 items-center rounded-full px-8 font-medium text-base transition-all duration-200 hover:scale-[1.03]"
                href="/contact"
                style={{
                  backgroundColor: "var(--landing-accent)",
                  color: "var(--landing-accent-foreground)",
                }}
              >
                {t("about.cta.button")}
              </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
