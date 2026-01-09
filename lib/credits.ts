import { and, eq } from "drizzle-orm";
import { db } from "./db";
import {
  type CreditTransaction,
  type CreditTransactionType,
  creditPackage,
  creditTransaction,
  workspace,
} from "./db/schema";

// ============================================================================
// Credit Constants
// ============================================================================

export const CREDIT_COSTS = {
  IMAGE_GENERATION: 1,
  IMAGE_EDIT: 1, // Inpainting/editing
  IMAGE_REGENERATE: 1,
  VIDEO_CLIP: 10,
} as const;

export const FREE_CREDITS_FOR_NEW_WORKSPACE = 3;

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get current credit balance for a workspace
 */
export async function getWorkspaceCredits(
  workspaceId: string
): Promise<number> {
  const [ws] = await db
    .select({ credits: workspace.credits })
    .from(workspace)
    .where(eq(workspace.id, workspaceId))
    .limit(1);

  return ws?.credits ?? 0;
}

/**
 * Check if workspace has enough credits
 */
export async function hasEnoughCredits(
  workspaceId: string,
  amount: number
): Promise<boolean> {
  const credits = await getWorkspaceCredits(workspaceId);
  return credits >= amount;
}

/**
 * Get all active credit packages
 */
export async function getCreditPackages() {
  return await db
    .select()
    .from(creditPackage)
    .where(eq(creditPackage.isActive, true))
    .orderBy(creditPackage.sortOrder);
}

/**
 * Get a single credit package by ID
 */
export async function getCreditPackageById(packageId: string) {
  const [pkg] = await db
    .select()
    .from(creditPackage)
    .where(eq(creditPackage.id, packageId))
    .limit(1);

  return pkg ?? null;
}

/**
 * Get credit transaction history for a workspace
 */
export async function getCreditTransactions(
  workspaceId: string,
  options?: { limit?: number; offset?: number }
): Promise<CreditTransaction[]> {
  let query = db
    .select()
    .from(creditTransaction)
    .where(eq(creditTransaction.workspaceId, workspaceId))
    .orderBy(creditTransaction.createdAt);

  if (options?.limit) {
    query = query.limit(options.limit) as typeof query;
  }
  if (options?.offset) {
    query = query.offset(options.offset) as typeof query;
  }

  return await query;
}

// ============================================================================
// Credit Deduction (with Idempotency)
// ============================================================================

interface DeductCreditsOptions {
  workspaceId: string;
  amount: number;
  description: string;
  imageGenerationId?: string;
  videoClipId?: string;
}

/**
 * Deduct credits from a workspace with idempotency protection.
 *
 * Returns the new balance, or null if already charged for this item (idempotency).
 * Throws an error if insufficient credits.
 *
 * IMPORTANT: This function checks if credits were already deducted for the given
 * imageGenerationId or videoClipId to prevent double-charging on Trigger.dev retries.
 */
export async function deductCredits(
  options: DeductCreditsOptions
): Promise<number | null> {
  const { workspaceId, amount, description, imageGenerationId, videoClipId } =
    options;

  // Use a transaction with row-level locking for atomicity
  return await db.transaction(async (tx) => {
    // IDEMPOTENCY CHECK: Skip if already charged for this item
    if (imageGenerationId) {
      const [existing] = await tx
        .select({ id: creditTransaction.id })
        .from(creditTransaction)
        .where(eq(creditTransaction.imageGenerationId, imageGenerationId))
        .limit(1);

      if (existing) {
        console.log(
          `[credits] Already charged for image ${imageGenerationId}, skipping`
        );
        return null;
      }
    }

    if (videoClipId) {
      const [existing] = await tx
        .select({ id: creditTransaction.id })
        .from(creditTransaction)
        .where(eq(creditTransaction.videoClipId, videoClipId))
        .limit(1);

      if (existing) {
        console.log(
          `[credits] Already charged for clip ${videoClipId}, skipping`
        );
        return null;
      }
    }

    // Lock the workspace row and get current balance
    const [ws] = await tx
      .select({ credits: workspace.credits })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .for("update");

    if (!ws) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    // Check if enough credits (but still allow going negative in edge cases)
    // The pre-check should prevent this, but race conditions can happen
    if (ws.credits < amount) {
      console.warn(
        `[credits] Insufficient credits for workspace ${workspaceId}: has ${ws.credits}, needs ${amount}`
      );
      throw new Error(
        `Insufficient credits. Need ${amount}, have ${ws.credits}.`
      );
    }

    const newBalance = ws.credits - amount;

    // Update balance
    await tx
      .update(workspace)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));

    // Log transaction
    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      workspaceId,
      type: "usage" as CreditTransactionType,
      amount: -amount,
      balanceAfter: newBalance,
      imageGenerationId: imageGenerationId ?? null,
      videoClipId: videoClipId ?? null,
      description,
    });

    console.log(
      `[credits] Deducted ${amount} credits from workspace ${workspaceId}. New balance: ${newBalance}`
    );

    return newBalance;
  });
}

// ============================================================================
// Credit Addition (with Idempotency for Webhooks)
// ============================================================================

interface AddCreditsOptions {
  workspaceId: string;
  amount: number;
  paymentId: string; // DodoPayments payment ID - used for idempotency
  packageId: string;
  description: string;
}

/**
 * Add credits to a workspace after successful payment.
 *
 * Returns the new balance, or null if this payment was already processed (idempotency).
 *
 * IMPORTANT: This function uses the paymentId to prevent double-crediting
 * if DodoPayments sends duplicate webhooks.
 */
export async function addCredits(
  options: AddCreditsOptions
): Promise<number | null> {
  const { workspaceId, amount, paymentId, packageId, description } = options;

  return await db.transaction(async (tx) => {
    // IDEMPOTENCY CHECK: Skip if this payment was already processed
    const [existing] = await tx
      .select({ id: creditTransaction.id })
      .from(creditTransaction)
      .where(eq(creditTransaction.paymentId, paymentId))
      .limit(1);

    if (existing) {
      console.log(`[credits] Payment ${paymentId} already processed, skipping`);
      return null;
    }

    // Lock the workspace row and get current balance
    const [ws] = await tx
      .select({ credits: workspace.credits })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .for("update");

    if (!ws) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newBalance = ws.credits + amount;

    // Update balance
    await tx
      .update(workspace)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));

    // Log transaction
    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      workspaceId,
      type: "purchase" as CreditTransactionType,
      amount,
      balanceAfter: newBalance,
      paymentId,
      packageId,
      description,
    });

    console.log(
      `[credits] Added ${amount} credits to workspace ${workspaceId}. New balance: ${newBalance}`
    );

    return newBalance;
  });
}

// ============================================================================
// Refund Credits (for payment refunds)
// ============================================================================

interface RefundCreditsOptions {
  workspaceId: string;
  amount: number;
  originalPaymentId: string;
  description: string;
}

/**
 * Remove credits from a workspace after a refund.
 *
 * Returns the new balance, or null if this refund was already processed.
 * Balance can go negative if user already spent the credits.
 */
export async function refundCredits(
  options: RefundCreditsOptions
): Promise<number | null> {
  const { workspaceId, amount, originalPaymentId, description } = options;
  const refundPaymentId = `refund_${originalPaymentId}`;

  return await db.transaction(async (tx) => {
    // IDEMPOTENCY CHECK: Skip if this refund was already processed
    const [existing] = await tx
      .select({ id: creditTransaction.id })
      .from(creditTransaction)
      .where(
        and(
          eq(creditTransaction.paymentId, refundPaymentId),
          eq(creditTransaction.type, "refund")
        )
      )
      .limit(1);

    if (existing) {
      console.log(
        `[credits] Refund for ${originalPaymentId} already processed, skipping`
      );
      return null;
    }

    // Lock the workspace row and get current balance
    const [ws] = await tx
      .select({ credits: workspace.credits })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .for("update");

    if (!ws) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    // Allow balance to go negative (user may have already spent credits)
    const newBalance = ws.credits - amount;

    // Update balance
    await tx
      .update(workspace)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));

    // Log transaction
    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      workspaceId,
      type: "refund" as CreditTransactionType,
      amount: -amount,
      balanceAfter: newBalance,
      paymentId: refundPaymentId,
      description,
    });

    console.log(
      `[credits] Refunded ${amount} credits from workspace ${workspaceId}. New balance: ${newBalance}`
    );

    return newBalance;
  });
}

// ============================================================================
// Admin Credit Adjustment
// ============================================================================

interface AdminAdjustCreditsOptions {
  workspaceId: string;
  amount: number; // Positive to add, negative to remove
  reason: string;
  adminUserId: string;
}

/**
 * Manually adjust credits for a workspace (admin only).
 * Used for customer support, compensation, etc.
 */
export async function adminAdjustCredits(
  options: AdminAdjustCreditsOptions
): Promise<number> {
  const { workspaceId, amount, reason, adminUserId } = options;

  return await db.transaction(async (tx) => {
    // Lock the workspace row and get current balance
    const [ws] = await tx
      .select({ credits: workspace.credits })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .for("update");

    if (!ws) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newBalance = ws.credits + amount;

    // Update balance
    await tx
      .update(workspace)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));

    // Log transaction
    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      workspaceId,
      type: "admin_adjustment" as CreditTransactionType,
      amount,
      balanceAfter: newBalance,
      description: `Admin adjustment by ${adminUserId}: ${reason}`,
    });

    console.log(
      `[credits] Admin adjustment: ${amount > 0 ? "+" : ""}${amount} credits for workspace ${workspaceId}. Reason: ${reason}`
    );

    return newBalance;
  });
}

// ============================================================================
// Bonus Credits (for promotions, referrals, etc.)
// ============================================================================

interface AddBonusCreditsOptions {
  workspaceId: string;
  amount: number;
  reason: string;
  referenceId?: string; // Optional reference (e.g., promotion code, referral ID)
}

/**
 * Add bonus credits to a workspace.
 * Used for promotions, referrals, compensation, etc.
 */
export async function addBonusCredits(
  options: AddBonusCreditsOptions
): Promise<number> {
  const { workspaceId, amount, reason, referenceId } = options;

  return await db.transaction(async (tx) => {
    // Lock the workspace row and get current balance
    const [ws] = await tx
      .select({ credits: workspace.credits })
      .from(workspace)
      .where(eq(workspace.id, workspaceId))
      .for("update");

    if (!ws) {
      throw new Error(`Workspace not found: ${workspaceId}`);
    }

    const newBalance = ws.credits + amount;

    // Update balance
    await tx
      .update(workspace)
      .set({ credits: newBalance, updatedAt: new Date() })
      .where(eq(workspace.id, workspaceId));

    // Log transaction
    await tx.insert(creditTransaction).values({
      id: crypto.randomUUID(),
      workspaceId,
      type: "bonus" as CreditTransactionType,
      amount,
      balanceAfter: newBalance,
      description: referenceId ? `${reason} (ref: ${referenceId})` : reason,
    });

    console.log(
      `[credits] Added ${amount} bonus credits to workspace ${workspaceId}. Reason: ${reason}`
    );

    return newBalance;
  });
}
