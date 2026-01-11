import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locale/en.json";
import tr from "@/locale/tr.json";

// Re-export all constants from i18n-constants.ts
// This keeps backward compatibility for client-side imports
export {
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_NAME,
  LANGUAGE_HEADER_NAME,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  type SupportedLanguage,
} from "./i18n-constants";

import { DEFAULT_LANGUAGE } from "./i18n-constants";

// Initialize i18next (client-side only - uses React)
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
