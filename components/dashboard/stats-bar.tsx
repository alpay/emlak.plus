"use client";

import {
  IconAlertTriangle,
  IconBuilding,
  IconCheck,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ProjectStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accentColor: string;
  delay: number;
  onClick?: () => void;
  isActive?: boolean;
  isClickable?: boolean;
}

function StatItem({
  icon,
  label,
  value,
  accentColor,
  delay,
  onClick,
  isActive,
  isClickable = true,
}: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <button
      className={cn(
        "stats-card flex w-full items-center gap-3 rounded-xl bg-card px-4 py-3 text-left ring-1 ring-foreground/5 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
        isClickable && "cursor-pointer hover:ring-2",
        isActive && "ring-2"
      )}
      disabled={!isClickable}
      onClick={onClick}
      style={{
        ["--ring-color" as string]: accentColor,
      }}
      type="button"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in oklch, ${accentColor} 15%, transparent)`,
        }}
      >
        <div style={{ color: accentColor }}>{icon}</div>
      </div>
      <div className="min-w-0">
        <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p
          className="font-mono font-semibold text-lg tabular-nums"
          style={{ color: accentColor }}
        >
          {value}
        </p>
      </div>
    </button>
  );
}

interface StatsBarProps {
  totalProperties: number;
  completedProperties: number;
  processingProperties: number;
  failedProperties: number;
  totalEdits: number;
  onStatusFilter?: (status: ProjectStatus | null) => void;
  activeStatus?: ProjectStatus | null;
}

export function StatsBar({
  totalProperties,
  completedProperties,
  processingProperties,
  failedProperties,
  totalEdits,
  onStatusFilter,
  activeStatus,
}: StatsBarProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleStatusClick = (status: ProjectStatus | null) => {
    if (onStatusFilter) {
      onStatusFilter(status);
    } else {
      // Update URL params
      const params = new URLSearchParams(searchParams.toString());
      if (status) {
        params.set("status", status);
      } else {
        params.delete("status");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    }
  };

  const currentStatus = activeStatus ?? searchParams.get("status");

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatItem
        accentColor="var(--accent-teal)"
        delay={0}
        icon={<IconBuilding className="h-4 w-4" />}
        isActive={currentStatus === null}
        label={t("dashboard.stats.totalProjects")}
        onClick={() => handleStatusClick(null)}
        value={totalProperties.toLocaleString()}
      />
      <StatItem
        accentColor="var(--accent-green)"
        delay={50}
        icon={<IconCheck className="h-4 w-4" />}
        isActive={currentStatus === "completed"}
        label={t("dashboard.status.completed")}
        onClick={() => handleStatusClick("completed")}
        value={completedProperties.toLocaleString()}
      />
      <StatItem
        accentColor="var(--accent-amber)"
        delay={100}
        icon={<IconLoader2 className="h-4 w-4" />}
        isActive={currentStatus === "processing"}
        label={t("dashboard.status.processing")}
        onClick={() => handleStatusClick("processing")}
        value={processingProperties.toLocaleString()}
      />
      {failedProperties > 0 && (
        <StatItem
          accentColor="var(--accent-red, #ef4444)"
          delay={150}
          icon={<IconAlertTriangle className="h-4 w-4" />}
          isActive={currentStatus === "failed"}
          label={t("dashboard.status.failed")}
          onClick={() => handleStatusClick("failed")}
          value={failedProperties.toLocaleString()}
        />
      )}
      <StatItem
        accentColor="var(--accent-teal)"
        delay={200}
        icon={<IconSparkles className="h-4 w-4" />}
        isClickable={false}
        label={t("dashboard.aiEdits", "AI Düzenlemeleri")}
        value={totalEdits.toLocaleString()}
      />
    </div>
  );
}
