"use client";

import { useEffect, useState } from "react";
import "@/lib/i18n"; // Initialize i18n on client side only
import i18n, { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/lib/i18n";

const LANGUAGE_STORAGE_KEY = "emlak-language";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Determine initial language
    let language: SupportedLanguage = DEFAULT_LANGUAGE;

    // Priority: initialLanguage (from DB) > localStorage > default
    if (initialLanguage) {
      language = initialLanguage;
    } else if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "tr" || stored === "en") {
        language = stored;
      }
    }

    // Set language
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    // Save to localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    setIsInitialized(true);
  }, [initialLanguage]);

  // Don't render until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}

// Hook to change language
export function useChangeLanguage() {
  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  };

  return {
    changeLanguage,
    currentLanguage: i18n.language as SupportedLanguage,
  };
}
