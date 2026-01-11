// Pure constants for i18n - no React dependencies
// This file can be safely imported in middleware/proxy

export const SUPPORTED_LANGUAGES = ["tr", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "tr";

// Cookie and header constants for server-side language detection
export const LANGUAGE_COOKIE_NAME = "emlak-language";
export const LANGUAGE_HEADER_NAME = "x-i18next-current-language";

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  tr: "Türkçe",
  en: "English",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
};
