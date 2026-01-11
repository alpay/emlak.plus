"use client";

import { IconCoins } from "@tabler/icons-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface CreditBalanceProps {
  credits: number;
  className?: string;
}

export function CreditBalance({ credits, className }: CreditBalanceProps) {
  const { t } = useTranslation();
  const isLow = credits < 5;
  const isEmpty = credits <= 0;

  return (
    <Link
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium text-sm transition-all hover:scale-105",
        isEmpty && "border-destructive/50 bg-destructive/10 text-destructive",
        isLow &&
          !isEmpty &&
          "border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400",
        !isLow && "border-primary/20 bg-primary/5 text-primary",
        className
      )}
      href="/dashboard/settings/credits"
    >
      <IconCoins className="size-4" />
      <span>{credits}</span>
      <span className="hidden text-muted-foreground sm:inline">{t("pricing.credits")}</span>
    </Link>
  );
}
