"use client";

import {
  IconArrowLeft,
  IconCheck,
  IconCoins,
  IconExternalLink,
  IconLoader2,
  IconMinus,
  IconPlus,
  IconReceipt,
  IconSparkles,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type { CreditPackage, CreditTransaction } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

function ViewInvoicesButton() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleViewInvoices() {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/customer-portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to access customer portal");
      }

      if (data.portalLink) {
        window.open(data.portalLink, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to access customer portal"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button disabled={loading} onClick={handleViewInvoices} variant="outline">
        {loading ? (
          <IconLoader2 className="size-4 animate-spin" />
        ) : (
          <IconReceipt className="size-4" />
        )}
        {t("credits.viewInvoices")}
        <IconExternalLink className="size-3" />
      </Button>
      {error && (
        <p className="max-w-[200px] text-right text-destructive text-xs">
          {error}
        </p>
      )}
    </div>
  );
}

interface CreditsSettingsContentProps {
  credits: number;
  packages: CreditPackage[];
  transactions: CreditTransaction[];
  workspaceId: string;
  workspaceName: string;
}

export function CreditsSettingsContent({
  credits,
  packages,
  transactions,
}: CreditsSettingsContentProps) {
  const { t } = useTranslation();
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isLow = credits < 5;
  const isEmpty = credits <= 0;

  async function handlePurchase(packageId: string) {
    try {
      setPurchasing(packageId);
      setError(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // Redirect to DodoPayments checkout
      if (data.paymentLink) {
        window.location.href = data.paymentLink;
      } else {
        throw new Error("No payment link received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setPurchasing(null);
    }
  }

  function formatPrice(cents: number): string {
    return `$${(cents / 100).toFixed(0)}`;
  }

  function getPricePerCredit(creditCount: number, cents: number): string {
    const price = (cents / 100 / creditCount).toFixed(2);
    return t("credits.perCredit", { price: `$${price}` });
  }

  function getTransactionIcon(type: string) {
    switch (type) {
      case "purchase":
        return <IconPlus className="size-4 text-green-500" />;
      case "usage":
        return <IconMinus className="size-4 text-red-500" />;
      case "bonus":
        return <IconSparkles className="size-4 text-amber-500" />;
      case "refund":
        return <IconMinus className="size-4 text-orange-500" />;
      case "admin_adjustment":
        return <IconCoins className="size-4 text-blue-500" />;
      default:
        return <IconCoins className="size-4 text-muted-foreground" />;
    }
  }

  function getTransactionLabel(type: string) {
    switch (type) {
      case "purchase":
        return t("credits.history.purchased");
      case "usage":
        return t("credits.history.used");
      case "bonus":
        return t("credits.history.bonus");
      case "refund":
        return t("credits.history.refunded");
      case "admin_adjustment":
        return t("credits.history.adjustment");
      default:
        return type;
    }
  }

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      {/* Back link */}
      <Link
        className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href="/dashboard/settings"
      >
        <IconArrowLeft className="size-4" />
        {t("credits.back")}
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">{t("credits.title")}</h1>
        <p className="text-muted-foreground">
          {t("credits.subtitle")}
        </p>
      </div>

      {/* Current Balance */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{t("credits.currentBalance")}</p>
            <div
              className={cn(
                "mt-1 flex items-center gap-2 font-bold text-3xl",
                isEmpty && "text-destructive",
                isLow && !isEmpty && "text-amber-600 dark:text-amber-400",
                !isLow && "text-foreground"
              )}
            >
              <IconCoins className="size-8" />
              {credits}
              <span className="font-normal text-lg text-muted-foreground">
                {t("credits.credits")}
              </span>
            </div>
          </div>
          <ViewInvoicesButton />
        </div>

        {isEmpty && (
          <p className="mt-4 text-destructive text-sm">
            {t("credits.outOfCredits")}
          </p>
        )}
        {isLow && !isEmpty && (
          <p className="mt-4 text-amber-600 text-sm dark:text-amber-400">
            {t("credits.lowCredits")}
          </p>
        )}
      </div>

      {/* Credit Packages */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">{t("credits.buyCredits")}</h2>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          {packages.map((pkg, index) => {
            const isPopular = index === 1;

            return (
              <button
                className={cn(
                  "group relative flex flex-col rounded-xl border p-5 text-left transition-all hover:shadow-md",
                  isPopular
                    ? "border-primary shadow-sm bg-primary/5 ring-1 ring-primary/20"
                    : "hover:border-primary/50"
                )}
                disabled={purchasing !== null}
                key={pkg.id}
                onClick={() => handlePurchase(pkg.id)}
                type="button"
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 font-medium text-primary-foreground text-xs shadow-sm">
                    <IconSparkles className="size-3" />
                    {t("credits.popular")}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full transition-colors",
                      isPopular ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <IconCoins className="size-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{pkg.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {pkg.credits} {t("credits.credits")}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="font-bold text-2xl">
                    {formatPrice(pkg.priceUsd)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {getPricePerCredit(pkg.credits, pkg.priceUsd)}
                  </span>
                </div>

                <div className={cn(
                  "mt-4 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
                  isPopular
                    ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    : "bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                )}>
                  {purchasing === pkg.id ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      {isPopular ? (
                         <IconCheck className="size-4" />
                      ) : (
                         <IconCheck className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      )}
                      {t("credits.buyNow")}
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-center text-muted-foreground text-xs">
          <p>{t("credits.creditValue")}</p>
          <p>{t("credits.videoValue")}</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">{t("credits.history.title")}</h2>

        {transactions.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-8 text-center">
            <IconReceipt className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              {t("credits.history.noTransactions")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border">
            <div className="divide-y">
              {transactions.map((tx) => (
                <div
                  className="flex items-center justify-between p-4"
                  key={tx.id}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {getTransactionLabel(tx.type)}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {tx.description || t("credits.history.noDescription")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "font-semibold",
                        tx.amount > 0 && "text-green-600",
                        tx.amount < 0 && "text-red-600"
                      )}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {formatDistanceToNow(new Date(tx.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
