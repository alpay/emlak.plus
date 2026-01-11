import { headers } from "next/headers";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_HEADER_NAME,
  type SupportedLanguage,
} from "@/lib/i18n-constants";

// Import translation resources directly
import en from "@/locale/en.json";
import tr from "@/locale/tr.json";

const resources: Record<SupportedLanguage, Record<string, unknown>> = {
  en,
  tr,
};

/**
 * Get a translation value by dot-notation key path
 */
function getNestedValue(obj: Record<string, unknown>, keyPath: string): string {
  const keys = keyPath.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return keyPath; // Return key if not found
    }
  }

  return typeof current === "string" ? current : keyPath;
}

/**
 * Server-side translation helper.
 * Reads the current language from the header set by the proxy/middleware.
 * Returns a translation function `t` that can be used in server components.
 */
export async function getT(ns?: string) {
  const headerList = await headers();
  const lng = (headerList.get(LANGUAGE_HEADER_NAME) as SupportedLanguage) ?? DEFAULT_LANGUAGE;

  const resource = resources[lng] ?? resources[DEFAULT_LANGUAGE];

  const t = (key: string, options?: Record<string, string | number>): string => {
    const fullKey = ns ? `${ns}.${key}` : key;
    let value = getNestedValue(resource as Record<string, unknown>, fullKey);

    // Handle interpolation like {{count}}
    if (options) {
      for (const [optKey, optValue] of Object.entries(options)) {
        value = value.replace(new RegExp(`{{${optKey}}}`, "g"), String(optValue));
      }
    }

    return value;
  };

  return { t, lng };
}

/**
 * Get current language from headers (for use in generateMetadata)
 */
export async function getCurrentLanguage(): Promise<SupportedLanguage> {
  const headerList = await headers();
  return (headerList.get(LANGUAGE_HEADER_NAME) as SupportedLanguage) ?? DEFAULT_LANGUAGE;
}
