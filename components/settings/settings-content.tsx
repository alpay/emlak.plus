"use client";

import {
  IconBuilding,
  IconLock,
  IconSettings,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";
import { TeamMembersTable } from "@/components/settings/team-members-table";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/lib/db/schema";
import type { TeamMember } from "@/lib/mock/workspace";
import { cn } from "@/lib/utils";

type SettingsSection = "workspace" | "team" | "security";

interface SettingsContentProps {
  workspace: Workspace;
  members: TeamMember[];
  currentUserId: string;
}

const SECTIONS: {
  id: SettingsSection;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: <IconBuilding className="h-4 w-4" />,
    description: "Organization details and branding",
  },
  {
    id: "team",
    label: "Team",
    icon: <IconUsers className="h-4 w-4" />,
    description: "Manage team members and invitations",
  },
  {
    id: "security",
    label: "Security",
    icon: <IconLock className="h-4 w-4" />,
    description: "Password and account security",
  },
];

export function SettingsContent({
  workspace,
  members,
  currentUserId,
}: SettingsContentProps) {
  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("workspace");
  const [inviteDialogOpen, setInviteDialogOpen] = React.useState(false);

  const activeMembers = members.filter((m) => m.status === "active").length;
  const pendingInvites = members.filter((m) => m.status === "pending").length;

  return (
    <div className="px-4 pb-8 md:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: "var(--accent-teal)" }}
          >
            <IconSettings className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm">
              Manage your workspace and account preferences
            </p>
          </div>
        </div>
      </div>

      {/* Main content with sidebar */}
      <div className="stagger-1 animate-fade-in-up">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Sidebar navigation */}
          <aside className="w-full shrink-0 lg:w-64">
            <nav className="sticky top-24 space-y-1 rounded-2xl border border-foreground/5 bg-card p-2 shadow-sm">
              {SECTIONS.map((section) => (
                <button
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                    activeSection === section.id
                      ? "bg-[var(--accent-teal)]/10 text-[var(--accent-teal)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  type="button"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      activeSection === section.id
                        ? "bg-[var(--accent-teal)]/20"
                        : "bg-muted"
                    )}
                  >
                    {section.icon}
                  </span>
                  <div>
                    <span className="block font-medium text-sm">
                      {section.label}
                    </span>
                    <span className="block text-muted-foreground text-xs">
                      {section.description}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content area */}
          <main className="min-w-0 flex-1">
            {/* Workspace Section */}
            {activeSection === "workspace" && (
              <section className="animate-fade-in space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
                    }}
                  >
                    <IconBuilding
                      className="h-4 w-4"
                      style={{ color: "var(--accent-teal)" }}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      Workspace Settings
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your organization details and branding
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-sm">
                  <WorkspaceForm workspace={workspace} />
                </div>
              </section>
            )}

            {/* Team Section */}
            {activeSection === "team" && (
              <section className="animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
                      }}
                    >
                      <IconUsers
                        className="h-4 w-4"
                        style={{ color: "var(--accent-teal)" }}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Team Members</h2>
                      <p className="text-muted-foreground text-sm">
                        {activeMembers} active member
                        {activeMembers !== 1 ? "s" : ""}
                        {pendingInvites > 0 && (
                          <span className="text-amber-600 dark:text-amber-400">
                            {" "}
                            &bull; {pendingInvites} pending invite
                            {pendingInvites !== 1 ? "s" : ""}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="gap-2 shadow-sm transition-all duration-200 hover:opacity-90 hover:shadow-md"
                    onClick={() => setInviteDialogOpen(true)}
                    style={{ backgroundColor: "var(--accent-teal)" }}
                  >
                    <IconUserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Invite Member</span>
                  </Button>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card shadow-sm">
                  <TeamMembersTable
                    currentUserId={currentUserId}
                    members={members}
                  />
                </div>
              </section>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <section className="animate-fade-in space-y-6">
                {/* Change Password */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor:
                          "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
                      }}
                    >
                      <IconLock
                        className="h-4 w-4"
                        style={{ color: "var(--accent-teal)" }}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">Change Password</h2>
                      <p className="text-muted-foreground text-sm">
                        Update your account password
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-sm">
                    <ChangePasswordForm />
                  </div>
                </div>

                {/* Additional security info */}
                <div className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-sm">
                  <h3 className="mb-4 font-semibold text-base">
                    Security Tips
                  </h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>
                        Use a strong, unique password that you don't use
                        elsewhere
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>
                        Never share your password with anyone, including support
                        staff
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>
                        Consider using a password manager to generate and store
                        secure passwords
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>
                        Change your password immediately if you suspect
                        unauthorized access
                      </span>
                    </li>
                  </ul>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      {/* Invite Dialog */}
      <InviteMemberDialog
        onOpenChange={setInviteDialogOpen}
        open={inviteDialogOpen}
      />
    </div>
  );
}
