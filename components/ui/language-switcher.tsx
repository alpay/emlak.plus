"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "@/components/providers/I18nProvider";
import {
  LANGUAGE_FLAGS,
  LANGUAGE_NAMES,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "dropdown" | "inline" | "select";
  onLanguageChange?: (language: SupportedLanguage) => void;
}

export function LanguageSwitcher({
  className,
  variant = "dropdown",
  onLanguageChange,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { changeLanguage } = useChangeLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize language code (e.g., "tr-TR" -> "tr", "en-US" -> "en")
  const rawLang = i18n.language || "tr";
  const currentLang = (rawLang.split("-")[0] as SupportedLanguage) || "tr";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /*
    Updated to handle URL redirection for content routes where language param matters.
    If the user is on a localized route (e.g. /en/blog/...), switching language should
    redirect to the new locale (e.g. /tr/blog/...).
  */
  const handleLanguageChange = async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    onLanguageChange?.(lang);
    setIsOpen(false);

    // Check if we are on a content route that needs URL update
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const isContentRoute = pathname.includes("/blog") || pathname.includes("/help") || pathname.includes("/pricing");

      if (isContentRoute) {
        // Replace existing locale in path or prepend new one
        const segments = pathname.split("/");
        // segments[0] is empty, segments[1] might be locale
        if (SUPPORTED_LANGUAGES.includes(segments[1] as SupportedLanguage)) {
           segments[1] = lang;
           const newPath = segments.join("/");
           window.location.href = newPath;
        } else {
           // No locale prefix, just prepend (though proxy should have handled this,
           // explicit switch implies we want to force it)
           window.location.href = `/${lang}${pathname}`;
        }
      }
    }
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1 font-medium text-sm transition-colors",
              currentLang === lang
                ? "bg-foreground/10 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            type="button"
          >
            <span>{LANGUAGE_FLAGS[lang]}</span>
            <span className="uppercase">{lang}</span>
          </button>
        ))}
      </div>
    );
  }

  if (variant === "select") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="grid gap-2">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                currentLang === lang
                  ? "border-[var(--accent-teal)] bg-[var(--accent-teal)]/10"
                  : "border-foreground/10 hover:border-foreground/20 hover:bg-muted/50"
              )}
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              type="button"
            >
              <span className="text-xl">{LANGUAGE_FLAGS[lang]}</span>
              <span className="font-medium">{LANGUAGE_NAMES[lang]}</span>
              {currentLang === lang && (
                <span
                  className="ml-auto text-sm"
                  style={{ color: "var(--accent-teal)" }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        className="flex items-center gap-1 rounded-md px-2 py-1.5 font-medium text-sm transition-colors hover:opacity-70"
        onClick={() => setIsOpen(!isOpen)}
        style={{ color: "var(--landing-text-muted)" }}
        type="button"
      >
        <span className="text-xl">{LANGUAGE_FLAGS[currentLang]}</span>
        <svg
          className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 z-50 mt-1 min-w-[120px] overflow-hidden rounded-lg border py-1 shadow-lg"
          style={{
            backgroundColor: "var(--landing-card)",
            borderColor: "var(--landing-border)",
          }}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                currentLang === lang
                  ? "bg-foreground/5"
                  : "hover:bg-foreground/5"
              )}
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              style={{ color: "var(--landing-text)" }}
              type="button"
            >
              <span>{LANGUAGE_FLAGS[lang]}</span>
              <span>{LANGUAGE_NAMES[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
