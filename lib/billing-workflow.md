# Billing Workflow

This document explains the billing workflow for Emlak, from project creation to invoicing.

---

## Overview

The billing system tracks revenue from image and video projects.

**Default Pricing:**
- Image projects: 1000 NOK (per project, up to 20 images)
- Video projects: 1000 NOK (per video)
- Custom pricing can be set per workspace via `workspacePricing` table

---

## Workflow Stages

### Stage 1: Invoice Line Item Creation (Automatic)

Invoice line items are created automatically when work is completed:

**Image Projects** (`lib/db/queries.ts` → `updateProjectCounts`):
- Triggered when the first image in a project completes successfully
- Checks `previousCompletedCount === 0 && completedCount > 0`
- Creates a "pending" invoice line item with workspace pricing

**Video Projects** (`lib/actions/video.ts` → `triggerVideoGeneration`):
- Triggered when video generation starts
- Creates a "pending" invoice line item immediately

**Important:** Line items are idempotent - the system checks for existing items before creating duplicates.

---

### Stage 2: Admin Review (`/admin/billing`)

The billing page shows two tabs:

**"Ikke fakturert" (Uninvoiced) Tab:**
- Lists all pending invoice line items
- Grouped by workspace with totals
- Shows warning icon if workspace is missing org.nr (required for invoicing)
- Admin can select multiple items and click "Send faktura"

**"Fakturahistorikk" (Invoice History) Tab:**
- Shows all created invoices with status
- Statuses: Utkast (draft), Sendt (sent), Betalt (paid), Forfalt (overdue), Kansellert (cancelled)

---

### Stage 3: Invoice Creation & Sending

When admin clicks "Send faktura" (`lib/actions/billing.ts`):

1. **`createInvoiceFromLineItemsAction`**:
   - Groups selected line items by workspace
   - Creates one invoice per workspace
   - Links line items to the invoice
   - Updates line item status to "invoiced"

2. **`markInvoiceAsSentAction`**:
   - Sets issue date to today
   - Calculates due date (14 days from issue)
   - Sets invoice status to "sent"

---

### Stage 4: Payment

When admin marks an invoice as paid (`markInvoiceAsPaidAction`):

1. Updates invoice status to "paid"
2. Sets `paidAt` timestamp

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `workspacePricing` | Custom pricing per workspace (null = use defaults) |
| `invoiceLineItem` | Individual billable items linked to projects/videos |
| `invoice` | Invoice records |

---

## Key Files

| File | Responsibility |
|------|----------------|
| `lib/db/schema.ts` | Database table definitions |
| `lib/db/queries.ts` | Billing queries + `updateProjectCounts` hook |
| `lib/actions/billing.ts` | Invoice creation, payment actions |
| `app/admin/billing/page.tsx` | Admin billing page |

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER ACTION                                  │
├─────────────────────────────────────────────────────────────────────┤
│  User creates project/video and generates content                   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AUTOMATIC: Line Item Created                      │
├─────────────────────────────────────────────────────────────────────┤
│  • Image: On first completed generation                              │
│  • Video: On generation start                                        │
│  • Status: "pending"                                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN: /admin/billing                             │
├─────────────────────────────────────────────────────────────────────┤
│  1. Review uninvoiced items                                          │
│  2. Select items to invoice                                          │
│  3. Click "Send faktura"                                             │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    SYSTEM: Invoice Created & Sent                    │
├─────────────────────────────────────────────────────────────────────┤
│  • Invoice created in database                                       │
│  • Status: "sent"                                                    │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ADMIN: Mark as Paid                               │
├─────────────────────────────────────────────────────────────────────┤
│  • Click checkmark on sent invoice                                   │
│  • Status: "paid"                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Notes

- **Org.nr Required**: Workspaces should have an organization number for proper invoicing
- **Idempotency**: The system prevents duplicate invoice line items for the same project/video
- **Error Handling**: Billing operations are wrapped in try/catch to not fail core operations if billing has issues
- **Currency**: All amounts stored in øre (Norwegian cents). 100000 øre = 1000 NOK
