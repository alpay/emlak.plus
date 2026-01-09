import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreditsSettingsContent } from "@/components/settings/credits-settings-content";
import { auth } from "@/lib/auth";
import {
  getCreditPackages,
  getCreditTransactions,
  getWorkspaceCredits,
} from "@/lib/credits";
import { getUserWithWorkspace } from "@/lib/db/queries";

export const metadata = {
  title: "Credits | Settings",
  description: "Manage your credits and purchase more",
};

export default async function CreditsSettingsPage() {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Get user with workspace
  const data = await getUserWithWorkspace(session.user.id);

  if (!data) {
    redirect("/onboarding");
  }

  // Fetch credits data
  const [credits, packages, transactions] = await Promise.all([
    getWorkspaceCredits(data.workspace.id),
    getCreditPackages(),
    getCreditTransactions(data.workspace.id, { limit: 50 }),
  ]);

  return (
    <CreditsSettingsContent
      credits={credits}
      packages={packages}
      transactions={transactions}
      workspaceId={data.workspace.id}
      workspaceName={data.workspace.name}
    />
  );
}
