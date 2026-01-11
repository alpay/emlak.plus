import type { Metadata } from "next";
import { Geist_Mono, Outfit } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { I18nProvider } from "@/app/providers/I18nProvider";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.home.title"),
    description: t("metadata.pages.home.description"),
    canonical: "/",
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={outfit.variable} lang="tr">
      <body
        className={`${outfit.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <NuqsAdapter>
          <I18nProvider>{children}</I18nProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
