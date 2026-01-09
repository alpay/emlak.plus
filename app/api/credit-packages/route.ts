import { NextResponse } from "next/server";
import { getCreditPackages } from "@/lib/credits";

export async function GET() {
  try {
    const packages = await getCreditPackages();

    return NextResponse.json({
      packages: packages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        credits: pkg.credits,
        priceUsd: pkg.priceUsd,
      })),
    });
  } catch (error) {
    console.error("[credit-packages] Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit packages" },
      { status: 500 }
    );
  }
}
