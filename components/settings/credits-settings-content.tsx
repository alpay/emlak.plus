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
import { Button } from "@/components/ui/button";
import type { CreditPackage, CreditTransaction } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

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
    return `$${(cents / 100 / creditCount).toFixed(2)}/credit`;
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
        return "Purchased";
      case "usage":
        return "Used";
      case "bonus":
        return "Bonus";
      case "refund":
        return "Refunded";
      case "admin_adjustment":
        return "Adjustment";
      default:
        return type;
    }
  }

  return (
    <div className="space-y-6 px-4 py-6 md:px-6 lg:px-8">
      {/* Back link */}
      <Link
        className="inline-flex items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground"
        href="/dashboard/settings"
      >
        <IconArrowLeft className="size-4" />
        Back to Settings
      </Link>

      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl tracking-tight">Credits</h1>
        <p className="text-muted-foreground">
          Manage your credits and view transaction history
        </p>
      </div>

      {/* Current Balance */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Current Balance</p>
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
                credits
              </span>
            </div>
          </div>
          <Button asChild variant="outline">
            <a
              href="https://app.dodopayments.com/invoices"
              rel="noopener noreferrer"
              target="_blank"
            >
              <IconReceipt className="size-4" />
              View Invoices
              <IconExternalLink className="size-3" />
            </a>
          </Button>
        </div>

        {isEmpty && (
          <p className="mt-4 text-destructive text-sm">
            You&apos;re out of credits! Purchase more to continue generating
            images.
          </p>
        )}
        {isLow && !isEmpty && (
          <p className="mt-4 text-amber-600 text-sm dark:text-amber-400">
            Running low on credits. Consider purchasing more soon.
          </p>
        )}
      </div>

      {/* Credit Packages */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Buy Credits</h2>

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
                  "group relative flex flex-col rounded-xl border p-5 text-left transition-all hover:border-primary/50 hover:shadow-md",
                  isPopular && "border-primary/30 bg-primary/5"
                )}
                disabled={purchasing !== null}
                key={pkg.id}
                onClick={() => handlePurchase(pkg.id)}
                type="button"
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-4 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-medium text-primary-foreground text-xs">
                    <IconSparkles className="size-3" />
                    Popular
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full bg-muted",
                      isPopular && "bg-primary/20"
                    )}
                  >
                    <IconCoins
                      className={cn(
                        "size-6 text-muted-foreground",
                        isPopular && "text-primary"
                      )}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{pkg.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {pkg.credits} credits
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

                <div className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-muted py-2 text-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {purchasing === pkg.id ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <IconCheck className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                      Buy Now
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-lg bg-muted/50 p-3 text-center text-muted-foreground text-xs">
          <p>1 credit = 1 AI image generation or edit</p>
          <p>10 credits = 1 video clip</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 p-8 text-center">
            <IconReceipt className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-3 text-muted-foreground">
              No transactions yet. Purchase credits to get started!
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
                        {tx.description || "No description"}
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
