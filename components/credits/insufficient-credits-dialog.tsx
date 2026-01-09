"use client";

import { IconAlertTriangle, IconCoins, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Regex pattern to remove trailing 's' for singular form
const TRAILING_S_REGEX = /s$/;

interface InsufficientCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCredits: number;
  requiredCredits: number;
  itemType?: "image" | "images" | "edit" | "video" | "video clips";
  itemCount?: number;
}

export function InsufficientCreditsDialog({
  open,
  onOpenChange,
  currentCredits,
  requiredCredits,
  itemType = "images",
  itemCount,
}: InsufficientCreditsDialogProps) {
  const shortfall = requiredCredits - currentCredits;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <IconAlertTriangle className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-center">
            Insufficient Credits
          </DialogTitle>
          <DialogDescription className="text-center">
            You don&apos;t have enough credits to process{" "}
            {itemCount
              ? `${itemCount} ${itemType}`
              : `this ${itemType.replace(TRAILING_S_REGEX, "")}`}
            .
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-lg border bg-muted/50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col items-center gap-1 rounded-lg bg-background p-3">
              <span className="text-muted-foreground">Required</span>
              <div className="flex items-center gap-1.5 font-semibold text-lg">
                <IconCoins className="size-4 text-primary" />
                {requiredCredits}
              </div>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg bg-background p-3">
              <span className="text-muted-foreground">Your Balance</span>
              <div className="flex items-center gap-1.5 font-semibold text-destructive text-lg">
                <IconCoins className="size-4" />
                {currentCredits}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1 text-muted-foreground text-sm">
            <span>You need</span>
            <span className="font-medium text-foreground">
              {shortfall} more credit{shortfall !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full gap-2">
            <Link href="/dashboard/settings/credits">
              <IconPlus className="size-4" />
              Buy Credits
            </Link>
          </Button>
          <Button
            className="w-full"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
