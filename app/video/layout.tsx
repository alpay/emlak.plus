import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Toaster } from "@/components/ui/sonner";
import { getT } from "@/i18n/server";
import { auth } from "@/lib/auth";
import { constructMetadata } from "@/lib/constructMetadata";
import { getUserWithWorkspace } from "@/lib/db/queries";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.video.title"),
    description: t("metadata.pages.video.description"),
    noIndex: true,
  });
}

export default async function VideoLayout({
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
      <DashboardHeader
        credits={data.workspace.credits}
        userImage={data.user.image}
        userLabel={session.user.email}
        userName={session.user.name}
      />

      {/* Main content - full width with consistent padding */}
      <main className="w-full">{children}</main>

      {/* Toast notifications */}
      <Toaster position="top-right" richColors />
    </div>
  );
}
