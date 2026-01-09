import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCreditPackageById } from "@/lib/credits";
import { getUserWithWorkspace } from "@/lib/db/queries";
import { dodo, isDodoConfigured } from "@/lib/dodo";

export async function POST(request: NextRequest) {
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

    // Get request body
    const { packageId } = await request.json();
    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    // Get the credit package
    const pkg = await getCreditPackageById(packageId);
    if (!pkg) {
      return NextResponse.json(
        { error: "Credit package not found" },
        { status: 404 }
      );
    }

    if (!pkg.isActive) {
      return NextResponse.json(
        { error: "This package is no longer available" },
        { status: 400 }
      );
    }

    // Get user's workspace
    const userData = await getUserWithWorkspace(session.user.id);
    if (!userData) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Create checkout session with DodoPayments
    // The metadata will be passed to the webhook so we know where to add credits
    const checkoutSession = await dodo.payments.create({
      billing: {
        city: "",
        country: "US",
        state: "",
        street: "",
        zipcode: "",
      },
      customer: {
        email: session.user.email,
        name: session.user.name,
      },
      product_cart: [
        {
          product_id: pkg.dodoProductId,
          quantity: 1,
        },
      ],
      metadata: {
        workspaceId: userData.workspace.id,
        packageId: pkg.id,
        credits: pkg.credits.toString(),
        userId: session.user.id,
        workspaceName: userData.workspace.name,
      },
    });

    return NextResponse.json({
      success: true,
      paymentLink: checkoutSession.payment_link,
      paymentId: checkoutSession.payment_id,
    });
  } catch (error) {
    console.error("[checkout] Error creating checkout session:", error);
    return NextResponse.json(
      {
        error: "Failed to create checkout session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
