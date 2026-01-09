import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserWithWorkspace } from "@/lib/db/queries";
import { dodo, isDodoConfigured } from "@/lib/dodo";

export async function POST() {
  try {
    // Check if DodoPayments is configured
    if (!isDodoConfigured()) {
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 503 }
      );
    }

    // Verify authentication
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's workspace and email
    const userData = await getUserWithWorkspace(session.user.id);
    if (!userData) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const email = session.user.email;
    if (!email) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // Try to find customer by email in DodoPayments
    const customers = await dodo.customers.list({ email });

    if (!customers.items || customers.items.length === 0) {
      return NextResponse.json(
        {
          error:
            "No purchase history found. Customer portal is available after your first purchase.",
        },
        { status: 404 }
      );
    }

    // Get the first customer (most recent)
    const customer = customers.items[0];

    // Create customer portal session
    const portalSession = await dodo.customers.customerPortal.create(
      customer.customer_id
    );

    return NextResponse.json({
      success: true,
      portalLink: portalSession.link,
    });
  } catch (error) {
    console.error("[customer-portal] Error creating portal session:", error);
    return NextResponse.json(
      {
        error: "Failed to access customer portal",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
