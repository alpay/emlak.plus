export const siteConfig = {
  name: "Emlak",
  description: "AI-powered real estate photo editor",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://www.emlak.tech",

  // Email settings
  email: {
    from: "noreply@emlak.tech",
    replyTo: "support@emlak.tech",
  },

  // Links
  links: {
    dashboard: "/dashboard",
    settings: "/dashboard/settings",
    help: "/help",
  },
} as const;

export type SiteConfig = typeof siteConfig;
