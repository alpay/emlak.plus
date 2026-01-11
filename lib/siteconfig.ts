export const siteConfig = {
  name: "Emlak+",
  title: "Emlak+ - AI-Powered Real Estate Photo Editor",
  description:
    "Transform your real estate photos with AI. Professional virtual staging, sky replacement, and photo enhancement for property listings.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.emlak.plus",

  // SEO
  ogImage: "/og-image.png",
  locale: "tr",
  keywords: [
    "emlak",
    "gayrimenkul",
    "AI fotoğraf düzenleme",
    "sanal dekorasyon",
    "emlak fotoğrafçılığı",
    "mülk fotoğrafları",
    "yapay zeka görsel iyileştirme",
    "real estate",
    "AI photo editor",
    "virtual staging",
  ],
  authors: [{ name: "Emlak+", url: "https://www.emlak.plus" }],
  creator: "Emlak+",
  twitterHandle: "@emlakplus",

  // Email settings
  email: {
    from: "noreply@emlak.plus",
    replyTo: "info@emlak.plus",
  },

  // Links
  links: {
    dashboard: "/dashboard",
    settings: "/dashboard/settings",
    help: "/help",
  },
} as const;

export type SiteConfig = typeof siteConfig;
