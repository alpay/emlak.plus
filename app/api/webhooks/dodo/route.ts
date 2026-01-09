import { type NextRequest, NextResponse } from "next/server";
import { addCredits, refundCredits } from "@/lib/credits";
import { dodo } from "@/lib/dodo";

// DodoPayments webhook event types we care about
type WebhookEventType =
  | "payment.succeeded"
  | "payment.failed"
  | "refund.succeeded"
  | "refund.failed";

interface WebhookData {
  payload_type: string;
  payment_id?: string;
  status?: string;
  metadata?: {
    workspaceId?: string;
    packageId?: string;
    credits?: string;
    userId?: string;
    workspaceName?: string;
  };
  [key: string]: unknown;
}

interface WebhookPayload {
  business_id: string;
  type: WebhookEventType;
  timestamp: string;
  data: WebhookData;
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text();

    // Get the DodoPayments webhook headers
    const webhookId = request.headers.get("webhook-id");
    const webhookTimestamp = request.headers.get("webhook-timestamp");
    const webhookSignature = request.headers.get("webhook-signature");

    // Use SDK to verify and unwrap the webhook
    let payload: WebhookPayload;

    try {
      if (webhookId && webhookTimestamp && webhookSignature) {
        // Use SDK's built-in verification
        const unwrapped = dodo.webhooks.unwrap(rawBody, {
          headers: {
            "webhook-id": webhookId,
            "webhook-timestamp": webhookTimestamp,
            "webhook-signature": webhookSignature,
          },
        });
        payload = unwrapped as unknown as WebhookPayload;
      } else {
        // No signature headers - parse without verification (dev mode only)
        console.warn(
          "[webhook] Missing headers - parsing without verification"
        );
        payload = JSON.parse(rawBody) as WebhookPayload;
      }
    } catch (verifyError) {
      console.error("[webhook] Signature verification failed:", verifyError);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Handle different event types
    switch (payload.type) {
      case "payment.succeeded":
        await handlePaymentSucceeded(payload);
        break;

      case "payment.failed":
        // No action needed - user didn't complete payment
        break;

      case "refund.succeeded":
        await handleRefundSucceeded(payload);
        break;

      case "refund.failed":
        // May want to alert admin
        break;

      default:
        // Unhandled event type
        break;
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
  const { data } = payload;
  const payment_id = data.payment_id;
  const metadata = data.metadata;

  if (!(metadata?.workspaceId && metadata?.credits && metadata?.packageId)) {
    console.error("[webhook] Missing required metadata for payment");
    return;
  }

  const credits = Number.parseInt(metadata.credits, 10);
  if (Number.isNaN(credits) || credits <= 0 || !payment_id) {
    console.error("[webhook] Invalid payment data");
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
  const { data } = payload;
  const payment_id = data.payment_id;
  const metadata = data.metadata;

  if (!(metadata?.workspaceId && metadata?.credits)) {
    console.error("[webhook] Missing required metadata for refund");
    return;
  }

  const credits = Number.parseInt(metadata.credits, 10);
  if (Number.isNaN(credits) || credits <= 0 || !payment_id) {
    console.error("[webhook] Invalid refund data");
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
