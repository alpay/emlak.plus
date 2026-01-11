"use client";

import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useSession } from "@/lib/auth-client";

function AuthButton() {
  const { data: session, isPending } = useSession();
  const { t } = useTranslation();

  if (isPending) {
    return (
      <div
        className="h-10 w-28 animate-pulse rounded-full"
        style={{ backgroundColor: "var(--landing-border)" }}
      />
    );
  }

  if (session) {
    return (
      <Link
        className="inline-flex h-10 items-center gap-2 rounded-full px-5 font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
        href="/dashboard"
        style={{
          backgroundColor: "var(--landing-accent)",
          color: "var(--landing-accent-foreground)",
        }}
      >
        {t("nav.dashboard")}
        <IconArrowRight className="size-4" />
      </Link>
    );
  }

  return (
    <Link
      className="inline-flex h-10 items-center gap-2 rounded-full px-5 font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
      href="/sign-in"
      style={{
        backgroundColor: "var(--landing-accent)",
        color: "var(--landing-accent-foreground)",
      }}
    >
      {t("nav.getStarted")}
      <IconArrowRight className="size-4" />
    </Link>
  );
}

export function LandingNav() {
  const { t } = useTranslation();

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "var(--landing-bg)",
        borderBottom: "1px solid var(--landing-border)",
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:grid md:grid-cols-3 md:justify-normal">
        {/* Logo */}
        <div className="flex justify-start">
          <Link
            className="font-bold text-lg tracking-tight transition-opacity hover:opacity-80"
            href="/"
            style={{ color: "var(--landing-text)" }}
          >
            Emlak
            <span className="relative top-[-2px] text-2xl text-[var(--landing-accent)]">
              +
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden items-center justify-center gap-8 md:flex">
          <Link
            className="font-medium text-sm transition-colors hover:opacity-70"
            href="/#features"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("nav.features")}
          </Link>
          <Link
            className="font-medium text-sm transition-colors hover:opacity-70"
            href="/#how-it-works"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("nav.howItWorks")}
          </Link>
          <Link
            className="font-medium text-sm transition-colors hover:opacity-70"
            href="/pricing"
            style={{ color: "var(--landing-text-muted)" }}
          >
            {t("nav.pricing")}
          </Link>
        </div>

        {/* Right section: Language Switcher + CTA */}
        <div className="flex items-center justify-end gap-4">
          <LanguageSwitcher />
          <Suspense
            fallback={
              <div
                className="h-10 w-28 animate-pulse rounded-full"
                style={{ backgroundColor: "var(--landing-border)" }}
              />
            }
          >
            <AuthButton />
          </Suspense>
        </div>
      </nav>
    </header>
  );
}
