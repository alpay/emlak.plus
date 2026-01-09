"use client";

import { IconClock, IconPercentage, IconRefresh } from "@tabler/icons-react";

const stats = [
  {
    icon: IconRefresh,
    value: "<1%",
    label: "Revision Rate",
    description:
      "Consistent, hand-blend quality edits with fewer revisions needed each month.",
    color: "var(--landing-accent)",
  },
  {
    icon: IconPercentage,
    value: ">76%",
    label: "Cost Savings",
    description:
      "Our clients save significant amounts annually in post-production costs.",
    color: "var(--accent-green)",
  },
  {
    icon: IconClock,
    value: "<2 min",
    label: "Turnaround",
    description:
      "Edit 25+ listings in under 30 minutes every day with our platform.",
    color: "var(--accent-teal)",
  },
];

export function LandingValueProp() {
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
            You don't have to choose between
            <br />
            <span style={{ color: "var(--landing-accent)" }}>
              Quality, Cost and Time
            </span>
          </h2>
          <p
            className="mt-4 text-lg leading-relaxed"
            style={{ color: "var(--landing-text-muted)" }}
          >
            Get all three with our AI-powered editing platform designed for real
            estate professionals.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              key={stat.label}
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
                {stat.value}
              </p>

              {/* Label */}
              <p
                className="mt-2 font-semibold text-lg"
                style={{ color: "var(--landing-text)" }}
              >
                {stat.label}
              </p>

              {/* Description */}
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: "var(--landing-text-muted)" }}
              >
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
