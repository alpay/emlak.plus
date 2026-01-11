import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sign In | Emlak",
  description: "Sign in to Emlak",
};

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
