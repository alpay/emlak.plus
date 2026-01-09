import crypto from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import { addCredits, refundCredits } from "@/lib/credits";

// DodoPayments webhook event types we care about
type WebhookEventType =
  | "payment.succeeded"
  | "payment.failed"
  | "refund.succeeded"
  | "refund.failed";

interface WebhookPayload {
  event_type: WebhookEventType;
  payment_id: string;
  status: string;
  metadata?: {
    workspaceId?: string;
    packageId?: string;
    credits?: string;
    userId?: string;
    workspaceName?: string;
  };
  amount?: number;
  currency?: string;
  created_at?: string;
}

/**
 * Verify the webhook signature from DodoPayments
 */
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();

    // Get the signature header
    const signature = request.headers.get("x-dodo-signature");
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_SECRET;

    // Verify signature if webhook secret is configured
    if (webhookSecret && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        console.error("[webhook] Invalid signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    } else if (webhookSecret && !signature) {
      console.error("[webhook] Missing signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Parse the payload
    const payload: WebhookPayload = JSON.parse(rawBody);

    console.log(`[webhook] Received event: ${payload.event_type}`, {
      paymentId: payload.payment_id,
      status: payload.status,
    });

    // Handle different event types
    switch (payload.event_type) {
      case "payment.succeeded":
        await handlePaymentSucceeded(payload);
        break;

      case "payment.failed":
        console.log(
          `[webhook] Payment failed: ${payload.payment_id}`,
          payload.metadata
        );
        // No action needed - user didn't complete payment
        break;

      case "refund.succeeded":
        await handleRefundSucceeded(payload);
        break;

      case "refund.failed":
        console.log(`[webhook] Refund failed: ${payload.payment_id}`);
        // May want to alert admin
        break;

      default:
        console.log(`[webhook] Unhandled event type: ${payload.event_type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentSucceeded(payload: WebhookPayload) {
  const { payment_id, metadata } = payload;

  if (!(metadata?.workspaceId && metadata?.credits && metadata?.packageId)) {
    console.error("[webhook] Missing required metadata for payment:", {
      paymentId: payment_id,
      metadata,
    });
    return;
  }

  const credits = Number.parseInt(metadata.credits, 10);
  if (Number.isNaN(credits) || credits <= 0) {
    console.error("[webhook] Invalid credits amount:", metadata.credits);
    return;
  }

  // Add credits to workspace (idempotency is handled inside addCredits)
  const newBalance = await addCredits({
    workspaceId: metadata.workspaceId,
    amount: credits,
    paymentId: payment_id,
    packageId: metadata.packageId,
    description: `Purchased ${credits} credits`,
  });

  if (newBalance !== null) {
    console.log(
      `[webhook] Successfully added ${credits} credits to workspace ${metadata.workspaceId}. New balance: ${newBalance}`
    );
  } else {
    console.log(
      `[webhook] Payment ${payment_id} was already processed (idempotency check)`
    );
  }
}

async function handleRefundSucceeded(payload: WebhookPayload) {
  const { payment_id, metadata } = payload;

  if (!(metadata?.workspaceId && metadata?.credits)) {
    console.error("[webhook] Missing required metadata for refund:", {
      paymentId: payment_id,
      metadata,
    });
    return;
  }

  const credits = Number.parseInt(metadata.credits, 10);
  if (Number.isNaN(credits) || credits <= 0) {
    console.error(
      "[webhook] Invalid credits amount for refund:",
      metadata.credits
    );
    return;
  }

  // Remove credits from workspace (idempotency is handled inside refundCredits)
  const newBalance = await refundCredits({
    workspaceId: metadata.workspaceId,
    amount: credits,
    originalPaymentId: payment_id,
    description: `Refund for payment ${payment_id}`,
  });

  if (newBalance !== null) {
    console.log(
      `[webhook] Successfully refunded ${credits} credits from workspace ${metadata.workspaceId}. New balance: ${newBalance}`
    );
  } else {
    console.log(
      `[webhook] Refund for ${payment_id} was already processed (idempotency check)`
    );
  }
}

// Handle GET requests (for webhook verification if needed)
export function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
