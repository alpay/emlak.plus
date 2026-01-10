"use client";

import {
  IconBuilding,
  IconLock,
  IconSettings,
  IconUser,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { InviteMemberDialog } from "@/components/settings/invite-member-dialog";
import { ProfileForm } from "@/components/settings/profile-form";
import { TeamMembersTable } from "@/components/settings/team-members-table";
import { WorkspaceForm } from "@/components/settings/workspace-form";
import { Button } from "@/components/ui/button";
import type { Workspace } from "@/lib/db/schema";
import type { TeamMember } from "@/lib/mock/workspace";
import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "workspace" | "team" | "security";

interface SettingsContentProps {
  workspace: Workspace;
  members: TeamMember[];
  currentUserId: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
}

export function SettingsContent({
  workspace,
  members,
  currentUserId,
  userName,
  userEmail,
  userImage,
}: SettingsContentProps) {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const activeMembers = members.filter((m) => m.status === "active").length;
  const pendingInvites = members.filter((m) => m.status === "pending").length;

  const SECTIONS: {
    id: SettingsSection;
    label: string;
    icon: React.ReactNode;
    description: string;
  }[] = [
    {
      id: "profile",
      label: t("settings.profile.title"),
      icon: <IconUser className="h-4 w-4" />,
      description: t("settings.profile.description"),
    },
    {
      id: "workspace",
      label: t("settings.workspace.title"),
      icon: <IconBuilding className="h-4 w-4" />,
      description: t("settings.workspace.description"),
    },
    {
      id: "team",
      label: t("settings.team.title"),
      icon: <IconUsers className="h-4 w-4" />,
      description: t("settings.team.description"),
    },
    {
      id: "security",
      label: t("settings.security.title"),
      icon: <IconLock className="h-4 w-4" />,
      description: t("settings.security.description"),
    },
  ];

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
            <h1 className="font-bold text-2xl tracking-tight">{t("settings.title")}</h1>
            <p className="text-muted-foreground text-sm">
              {t("settings.subtitle")}
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
            {/* Profile Section */}
            {activeSection === "profile" && (
              <section className="animate-fade-in space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor:
                        "color-mix(in oklch, var(--accent-teal) 15%, transparent)",
                    }}
                  >
                    <IconUser
                      className="h-4 w-4"
                      style={{ color: "var(--accent-teal)" }}
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{t("settings.profile.settings")}</h2>
                    <p className="text-muted-foreground text-sm">
                      {t("settings.profile.settingsDesc")}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-foreground/5 bg-card p-6 shadow-sm">
                  <ProfileForm
                    userEmail={userEmail}
                    userImage={userImage}
                    userName={userName}
                  />
                </div>
              </section>
            )}

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
                      {t("settings.workspace.settings")}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {t("settings.workspace.settingsDesc")}
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
                      <h2 className="font-semibold text-lg">{t("settings.team.members")}</h2>
                      <p className="text-muted-foreground text-sm">
                        {activeMembers} {activeMembers === 1 ? t("settings.team.activeMember") : t("settings.team.activeMembers")}
                        {pendingInvites > 0 && (
                          <span className="text-amber-600 dark:text-amber-400">
                            {" "}
                            &bull; {pendingInvites} {pendingInvites === 1 ? t("settings.team.pendingInvite") : t("settings.team.pendingInvites")}
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
                    <span className="hidden sm:inline">{t("settings.team.inviteMember")}</span>
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
                      <h2 className="font-semibold text-lg">{t("settings.security.changePassword")}</h2>
                      <p className="text-muted-foreground text-sm">
                        {t("settings.security.changePasswordDesc")}
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
                    {t("settings.security.tips")}
                  </h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>{t("settings.security.tip1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>{t("settings.security.tip2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>{t("settings.security.tip3")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        ✓
                      </span>
                      <span>{t("settings.security.tip4")}</span>
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
