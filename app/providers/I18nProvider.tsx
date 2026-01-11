"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@/lib/i18n"; // Initialize i18n on client side only
import i18n, {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  type SupportedLanguage,
} from "@/lib/i18n";

interface I18nProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

/**
 * Get language from cookie
 */
function getLanguageFromCookie(): SupportedLanguage | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${LANGUAGE_COOKIE_NAME}=([^;]+)`));
  const value = match?.[1];
  if (value === "tr" || value === "en") return value;
  return null;
}

/**
 * Set language cookie
 */
function setLanguageCookie(language: SupportedLanguage) {
  if (typeof document === "undefined") return;
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; SameSite=Lax`;
}

export function I18nProvider({ children, initialLanguage }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Priority: initialLanguage (from DB) > cookie > default
    let language: SupportedLanguage = DEFAULT_LANGUAGE;

    if (initialLanguage) {
      language = initialLanguage;
    } else {
      const cookieLang = getLanguageFromCookie();
      if (cookieLang) {
        language = cookieLang;
      }
    }

    // Client-side content route mismatch check
    const pathname = window.location.pathname;
    const isContentRoute = pathname.includes("/blog") || pathname.includes("/help") || pathname.includes("/pricing");

    if (isContentRoute) {
      const urlLang = pathname.split("/")[1];
      if ((urlLang === "en" || urlLang === "tr") && urlLang !== language) {
        const newPath = pathname.replace(`/${urlLang}`, `/${language}`);
        window.location.replace(newPath);
        return;
      }
    }

    // Set language in i18next
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    // Save to cookie
    setLanguageCookie(language);

    // Initialize
    Promise.resolve().then(() => setIsInitialized(true));
  }, [initialLanguage]);

  if (!isInitialized) return null;

  return <>{children}</>;
}

// Hook to change language
export function useChangeLanguage() {
  const router = useRouter();

  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    setLanguageCookie(language);
    // Refresh to update server-side metadata
    router.refresh();
  };

  return {
    changeLanguage,
    currentLanguage: i18n.language as SupportedLanguage,
  };
}

