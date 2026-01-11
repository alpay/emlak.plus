import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NewProjectPage } from "@/components/projects/new-project-page";
import { auth } from "@/lib/auth";
import { getUserWithWorkspace } from "@/lib/db/queries";

export default async function NewProjectRoute() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const data = await getUserWithWorkspace(session.user.id);

  if (!data) {
    redirect("/onboarding");
  }

  return <NewProjectPage workspaceId={data.workspace.id} credits={data.workspace.credits} />;
}
