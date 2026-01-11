"use client";

import { IconClock, IconPercentage, IconRefresh } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const stats = [
  {
    icon: IconRefresh,
    id: "revision",
    value: "<1%",
    color: "var(--landing-accent)",
  },
  {
    icon: IconPercentage,
    id: "cost",
    value: ">76%",
    color: "var(--accent-green)",
  },
  {
    icon: IconClock,
    id: "turnaround",
    valueKey: "landing.valueProp.stats.turnaroundValue",
    valueDefault: "<2 min",
    color: "var(--accent-teal)",
  },
];

export function LandingValueProp() {
  const { t } = useTranslation();

  return (
    <section
      className="px-6 py-24 md:py-32"
      id="value-prop"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl"
            style={{ color: "var(--landing-text)" }}
          >
            {t("landing.valueProp.title")}
            <br />
            <span style={{ color: "var(--landing-accent)" }}>
              {t("landing.valueProp.title2")}
            </span>
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("landing.valueProp.subtitle")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              key={stat.id}
              style={{
                backgroundColor: "var(--landing-card)",
                boxShadow: "0 4px 24px -4px var(--landing-shadow)",
                border: "1px solid var(--landing-border)",
              }}
            >
              {/* Decorative gradient */}
              <div
                className="absolute -top-8 -right-8 size-32 rounded-full opacity-10 transition-opacity duration-300 group-hover:opacity-20"
                style={{ backgroundColor: stat.color }}
              />

              {/* Icon */}
              <div
                className="mb-4 inline-flex size-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="size-6" style={{ color: stat.color }} />
              </div>

              {/* Value */}
              <p
                className="font-bold text-4xl tabular-nums md:text-5xl"
                style={{ color: stat.color }}
              >
                {stat.valueKey ? t(stat.valueKey, stat.valueDefault) : stat.value}
              </p>

              {/* Label */}
              <p
                className="mt-2 font-semibold text-lg"
                style={{ color: "var(--landing-text)" }}
              >
                {t(`landing.valueProp.stats.${stat.id}Rate`)}
              </p>

              {/* Description */}
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--landing-text-muted)" }}
              >
                {t(`landing.valueProp.stats.${stat.id}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
