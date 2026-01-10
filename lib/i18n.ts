import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locale/en.json";
import tr from "@/locale/tr.json";

export const SUPPORTED_LANGUAGES = ["tr", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = "tr";

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  tr: "Türkçe",
  en: "English",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  tr: "🇹🇷",
  en: "🇬🇧",
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for SSR compatibility
  },
});

export default i18n;
