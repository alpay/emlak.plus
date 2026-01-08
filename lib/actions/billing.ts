"use server";

import { revalidatePath } from "next/cache";
import { verifySystemAdmin } from "@/lib/admin-auth";
import {
  type BillingStats,
  createAffiliateEarning,
  createInvoice,
  createInvoiceLineItem,
  getAffiliateRelationshipByReferred,
  getBillingStats,
  getInvoiceById,
  getInvoiceHistory,
  getUninvoicedLineItems,
  getWorkspacePricing,
  type InvoiceHistoryRow,
  type UninvoicedLineItemRow,
  updateInvoice,
  updateInvoiceLineItemStatus,
  upsertWorkspacePricing,
} from "@/lib/db/queries";
import type { Invoice, InvoiceStatus, WorkspacePricing } from "@/lib/db/schema";

// Billing defaults (previously in fiken-client.ts)
const BILLING_DEFAULTS = {
  DEFAULT_DUE_DAYS: 14,
  VAT_RATE: 0.25,
};

// ============================================================================
// Types
// ============================================================================

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Workspace Pricing Actions
// ============================================================================

/**
 * Get workspace pricing (with defaults fallback)
 */
export async function getWorkspacePricingAction(
  workspaceId: string
): Promise<
  ActionResult<{ imageProjectPriceOre: number; videoProjectPriceOre: number }>
> {
  try {
    const pricing = await getWorkspacePricing(workspaceId);
    return {
      success: true,
      data: {
        imageProjectPriceOre: pricing.imageProjectPriceOre,
        videoProjectPriceOre: pricing.videoProjectPriceOre,
      },
    };
  } catch (error) {
    console.error("[billing:getWorkspacePricing] Error:", error);
    return { success: false, error: "Failed to get workspace pricing" };
  }
}

/**
 * Update workspace pricing (admin only)
 */
export async function updateWorkspacePricingAction(
  workspaceId: string,
  data: {
    imageProjectPriceOre?: number | null;
    videoProjectPriceOre?: number | null;
  }
): Promise<ActionResult<WorkspacePricing>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const pricing = await upsertWorkspacePricing(workspaceId, data);
    revalidatePath("/admin/billing");
    return { success: true, data: pricing };
  } catch (error) {
    console.error("[billing:updateWorkspacePricing] Error:", error);
    return { success: false, error: "Failed to update workspace pricing" };
  }
}

// ============================================================================
// Invoice Line Item Actions
// ============================================================================

/**
 * Create an invoice line item for a project
 * Called when a project gets its first completed image
 */
export async function createProjectInvoiceLineItemAction(
  workspaceId: string,
  projectId: string,
  projectName: string
): Promise<ActionResult<{ id: string }>> {
  try {
    // Get workspace pricing
    const pricing = await getWorkspacePricing(workspaceId);

    // Create the line item
    const lineItem = await createInvoiceLineItem({
      workspaceId,
      projectId,
      description: `AI Photo Editing - ${projectName}`,
      amountOre: pricing.imageProjectPriceOre,
    });

    return { success: true, data: { id: lineItem.id } };
  } catch (error) {
    console.error("[billing:createProjectInvoiceLineItem] Error:", error);
    return { success: false, error: "Failed to create invoice line item" };
  }
}

/**
 * Create an invoice line item for a video project
 * Called when a video project starts generating
 */
export async function createVideoInvoiceLineItemAction(
  workspaceId: string,
  videoProjectId: string,
  videoProjectName: string
): Promise<ActionResult<{ id: string }>> {
  try {
    // Get workspace pricing
    const pricing = await getWorkspacePricing(workspaceId);

    // Create the line item
    const lineItem = await createInvoiceLineItem({
      workspaceId,
      videoProjectId,
      description: `AI Video Generation - ${videoProjectName}`,
      amountOre: pricing.videoProjectPriceOre,
    });

    return { success: true, data: { id: lineItem.id } };
  } catch (error) {
    console.error("[billing:createVideoInvoiceLineItem] Error:", error);
    return { success: false, error: "Failed to create invoice line item" };
  }
}

/**
 * Get all uninvoiced line items (admin only)
 */
export async function getUninvoicedLineItemsAction(filters?: {
  workspaceId?: string;
}): Promise<ActionResult<UninvoicedLineItemRow[]>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const lineItems = await getUninvoicedLineItems(filters);
    return { success: true, data: lineItems };
  } catch (error) {
    console.error("[billing:getUninvoicedLineItems] Error:", error);
    return { success: false, error: "Failed to get uninvoiced line items" };
  }
}

// ============================================================================
// Invoice Actions
// ============================================================================

/**
 * Create an invoice from selected line items (admin only)
 * Groups line items by workspace and creates one invoice per workspace
 */
export async function createInvoiceFromLineItemsAction(
  lineItemIds: string[]
): Promise<ActionResult<{ invoiceIds: string[] }>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    // Get the line items
    const allLineItems = await getUninvoicedLineItems();
    const selectedItems = allLineItems.filter((item) =>
      lineItemIds.includes(item.id)
    );

    if (selectedItems.length === 0) {
      return { success: false, error: "No line items found" };
    }

    // Group by workspace
    const byWorkspace = new Map<string, typeof selectedItems>();
    for (const item of selectedItems) {
      const existing = byWorkspace.get(item.workspaceId) || [];
      existing.push(item);
      byWorkspace.set(item.workspaceId, existing);
    }

    // Create one invoice per workspace
    const invoiceIds: string[] = [];

    for (const [workspaceId, items] of byWorkspace) {
      const totalAmountOre = items.reduce(
        (sum, item) => sum + item.amountOre * item.quantity,
        0
      );

      // Create invoice
      const invoice = await createInvoice({
        workspaceId,
        totalAmountOre,
        notes: `Projects: ${items.map((i) => i.projectName || i.videoProjectName).join(", ")}`,
      });

      // Link line items to invoice
      await updateInvoiceLineItemStatus(
        items.map((i) => i.id),
        "invoiced",
        invoice.id
      );

      invoiceIds.push(invoice.id);
    }

    revalidatePath("/admin/billing");
    return { success: true, data: { invoiceIds } };
  } catch (error) {
    console.error("[billing:createInvoiceFromLineItems] Error:", error);
    return { success: false, error: "Failed to create invoice" };
  }
}

/**
 * Mark invoice as sent (admin only)
 * Sets the issue date and calculates due date
 */
export async function markInvoiceAsSentAction(
  invoiceId: string
): Promise<ActionResult<Invoice>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    const today = new Date();
    const dueDate = new Date(
      today.getTime() + BILLING_DEFAULTS.DEFAULT_DUE_DAYS * 24 * 60 * 60 * 1000
    );

    const updated = await updateInvoice(invoiceId, {
      status: "sent",
      issueDate: today,
      dueDate,
    });

    if (!updated) {
      return { success: false, error: "Failed to update invoice" };
    }

    revalidatePath("/admin/billing");
    return { success: true, data: updated };
  } catch (error) {
    console.error("[billing:markInvoiceAsSent] Error:", error);
    return { success: false, error: "Failed to mark invoice as sent" };
  }
}

/**
 * Mark an invoice as paid (admin only)
 * This also triggers affiliate earning creation if applicable
 */
export async function markInvoiceAsPaidAction(
  invoiceId: string
): Promise<ActionResult<Invoice>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    // Get the invoice
    const invoice = await getInvoiceById(invoiceId);
    if (!invoice) {
      return { success: false, error: "Invoice not found" };
    }

    // Update invoice status
    const updated = await updateInvoice(invoiceId, {
      status: "paid",
      paidAt: new Date(),
    });

    if (!updated) {
      return { success: false, error: "Failed to update invoice" };
    }

    // Check for affiliate relationship and create earning
    const affiliateRelationship = await getAffiliateRelationshipByReferred(
      invoice.workspaceId
    );

    if (affiliateRelationship) {
      await createAffiliateEarning({
        affiliateWorkspaceId: affiliateRelationship.affiliateWorkspaceId,
        affiliateRelationshipId: affiliateRelationship.id,
        invoiceId: invoice.id,
        invoiceAmountOre: invoice.totalAmountOre,
        commissionPercent: affiliateRelationship.commissionPercent,
      });
    }

    revalidatePath("/admin/billing");
    return { success: true, data: updated };
  } catch (error) {
    console.error("[billing:markInvoiceAsPaid] Error:", error);
    return { success: false, error: "Failed to mark invoice as paid" };
  }
}

/**
 * Get invoice history (admin only)
 */
export async function getInvoiceHistoryAction(filters?: {
  workspaceId?: string;
  status?: InvoiceStatus;
}): Promise<ActionResult<InvoiceHistoryRow[]>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const invoices = await getInvoiceHistory(filters);
    return { success: true, data: invoices };
  } catch (error) {
    console.error("[billing:getInvoiceHistory] Error:", error);
    return { success: false, error: "Failed to get invoice history" };
  }
}

/**
 * Get billing stats (admin only)
 */
export async function getBillingStatsAction(): Promise<
  ActionResult<BillingStats>
> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const stats = await getBillingStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("[billing:getBillingStats] Error:", error);
    return { success: false, error: "Failed to get billing stats" };
  }
}

/**
 * Cancel an invoice (admin only)
 */
export async function cancelInvoiceAction(
  invoiceId: string
): Promise<ActionResult<Invoice>> {
  const adminCheck = await verifySystemAdmin();
  if (adminCheck.error) {
    return { success: false, error: adminCheck.error };
  }

  try {
    const updated = await updateInvoice(invoiceId, {
      status: "cancelled",
    });

    if (!updated) {
      return { success: false, error: "Invoice not found" };
    }

    revalidatePath("/admin/billing");
    return { success: true, data: updated };
  } catch (error) {
    console.error("[billing:cancelInvoice] Error:", error);
    return { success: false, error: "Failed to cancel invoice" };
  }
}
