import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.auth.title"),
    description: t("metadata.pages.auth.description"),
  });
}

import { LandingNav } from "@/components/landing/landing-nav";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <LandingNav />
      {/* Center content in remaining space */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">{children}</div>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}
