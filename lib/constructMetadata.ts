import type { Metadata } from "next";
import { siteConfig } from "./siteconfig";

const TRAILING_SLASHES_REGEX = /\/+$/;

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(TRAILING_SLASHES_REGEX, "");
}

export function getMetadataBaseUrl(): string {
  // Prefer explicit overrides so the same build can be deployed to multiple domains.
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) {
    return normalizeBaseUrl(explicit);
  }

  // Use Vercel preview URLs when available.
  const vercelEnv =
    process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.VERCEL_ENV;
  const vercelUrl =
    process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL;

  if (vercelEnv === "preview" && vercelUrl) {
    return `https://${vercelUrl}`;
  }

  // Default fallbacks.
  if (vercelEnv === "production" || process.env.NODE_ENV === "production") {
    return "https://www.emlak.plus";
  }

  return "http://localhost:3000";
}

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  /** Custom canonical URL path (relative to base URL, e.g., "/blog/my-post") */
  canonical?: string;
  /** Override default keywords */
  keywords?: string[];
  /** Article publish date (ISO 8601) - sets OpenGraph type to "article" */
  publishedTime?: string;
  /** Article modified date (ISO 8601) */
  modifiedTime?: string;
  /** Article authors */
  authors?: string[];
  /** Article section/category */
  section?: string;
  /** Article tags */
  tags?: string[];
  /** OpenGraph type - defaults to "website", set to "article" for blog posts */
  type?: "website" | "article";
}

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = "/icon.svg",
  noIndex = false,
  canonical,
  keywords,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  type,
}: ConstructMetadataOptions = {}): Metadata {
  const metadataBaseUrl = getMetadataBaseUrl();
  const canonicalUrl = canonical
    ? `${metadataBaseUrl}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : metadataBaseUrl;

  // Determine OG type - auto-detect article type if publishedTime is provided
  const ogType = type || (publishedTime ? "article" : "website");

  // Build OpenGraph object
  const openGraph: Metadata["openGraph"] = {
    title,
    description,
    type: ogType,
    siteName: siteConfig.name,
    url: canonicalUrl,
    locale: siteConfig.locale,
    images: [
      {
        url: image,
        width: 1200,
        height: 630,
        alt: title || siteConfig.name,
      },
    ],
  };

  // Add article-specific metadata if type is article
  if (ogType === "article" && openGraph) {
    if (publishedTime) {
      (openGraph as Record<string, unknown>).publishedTime = publishedTime;
    }
    if (modifiedTime) {
      (openGraph as Record<string, unknown>).modifiedTime = modifiedTime;
    }
    if (authors) {
      (openGraph as Record<string, unknown>).authors = authors;
    }
    if (section) {
      (openGraph as Record<string, unknown>).section = section;
    }
    if (tags) {
      (openGraph as Record<string, unknown>).tags = tags;
    }
  }

  return {
    title,
    description,
    keywords: keywords || [...siteConfig.keywords],
    authors: [...siteConfig.authors],
    creator: siteConfig.creator,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        tr: canonicalUrl,
        en: canonicalUrl,
      },
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: siteConfig.twitterHandle,
    },
    icons,
    metadataBase: new URL(metadataBaseUrl),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
