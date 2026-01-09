"use client";

import {
  IconChevronDown,
  IconLoader,
  IconLogout,
  IconMovie,
  IconSettings,
  IconSparkles,
  IconUser,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { CreditBalance } from "@/components/credits/credit-balance";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  userLabel?: string;
  userName?: string;
  userImage?: string | null;
  credits?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Projects", icon: IconSparkles },
  {
    href: "/video",
    label: "Video (coming soon)",
    icon: IconMovie,
    disabled: true,
  },
];

export function DashboardHeader({
  userLabel,
  userName,
  userImage,
  credits,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const displayName = userName || userLabel || "User";

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Left side: Logo + Navigation */}
          <div className="flex min-w-0 items-center gap-4">
            <Link
              className="truncate font-semibold text-foreground tracking-tight transition-colors hover:text-foreground/80"
              href="/"
            >
              Emlak
            </Link>

            <Separator className="h-6" orientation="vertical" />

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  !item.disabled &&
                  (item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Button
                    asChild={!item.disabled}
                    className={cn(
                      "h-8 gap-2 transition-all",
                      isActive && "font-medium",
                      item.disabled && "cursor-not-allowed opacity-60"
                    )}
                    disabled={item.disabled}
                    key={item.href}
                    size="sm"
                    variant={isActive ? "secondary" : "ghost"}
                  >
                    {item.disabled ? (
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </div>
                    ) : (
                      <Link href={item.href}>
                        <Icon className="size-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Link>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Right side: Credits + User dropdown */}
          <div className="flex items-center gap-3">
            {credits !== undefined && <CreditBalance credits={credits} />}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="gap-2 text-muted-foreground hover:text-foreground"
                  size="sm"
                  variant="ghost"
                >
                  <div className="relative flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-foreground/10">
                    {userImage ? (
                      <Image
                        alt={displayName}
                        className="object-cover"
                        fill
                        sizes="24px"
                        src={userImage}
                      />
                    ) : (
                      <IconUser className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <span className="max-w-[150px] truncate">{displayName}</span>
                  <IconChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    className="flex cursor-pointer items-center gap-2"
                    href="/dashboard/settings"
                  >
                    <IconSettings className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2"
                  disabled={isSigningOut}
                  onClick={handleSignOut}
                >
                  {isSigningOut ? (
                    <IconLoader className="size-4 animate-spin" />
                  ) : (
                    <IconLogout className="size-4" />
                  )}
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
