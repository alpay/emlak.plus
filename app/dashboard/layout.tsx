import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ImpersonationBanner } from "@/components/admin/impersonation-banner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/lib/auth";
import { getUserWithWorkspace } from "@/lib/db/queries";

export const metadata: Metadata = {
  title: "Dashboard | Emlak",
  description: "Manage your property photos and AI edits",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Validate session server-side
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Get user with workspace
  const data = await getUserWithWorkspace(session.user.id);

  // If no workspace or onboarding not completed, redirect to onboarding
  if (!data?.workspace.onboardingCompleted) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background">
      <ImpersonationBanner />
      <DashboardHeader
        credits={data.workspace.credits}
        userImage={data.user.image}
        userLabel={session.user.email}
        userName={session.user.name}
      />

      {/* Main content - full width with consistent padding */}
      <main className="w-full py-6">{children}</main>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
