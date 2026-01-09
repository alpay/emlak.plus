/**
 * Seed Credit Packages Script
 *
 * This script seeds the credit_package table with the initial packages.
 * Run with: pnpm tsx scripts/seed-credit-packages.ts
 *
 * IMPORTANT: Before running this script:
 * 1. Create products in DodoPayments dashboard with these exact prices
 * 2. Copy the product IDs and update the DODO_PRODUCT_IDS below
 */

import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { creditPackage } from "../lib/db/schema";

// Update these with your actual DodoPayments product IDs
// Create products in https://app.dodopayments.com first!
const DODO_PRODUCT_IDS = {
  STARTER: "YOUR_DODO_PRODUCT_ID_FOR_STARTER", // 10 credits - $5
  POPULAR: "YOUR_DODO_PRODUCT_ID_FOR_POPULAR", // 25 credits - $10
  BEST_VALUE: "YOUR_DODO_PRODUCT_ID_FOR_BEST_VALUE", // 50 credits - $18
};

const PACKAGES = [
  {
    id: "pkg_starter",
    name: "Starter",
    credits: 10,
    priceUsd: 500, // $5 in cents
    dodoProductId: DODO_PRODUCT_IDS.STARTER,
    sortOrder: 1,
  },
  {
    id: "pkg_popular",
    name: "Popular",
    credits: 25,
    priceUsd: 1000, // $10 in cents
    dodoProductId: DODO_PRODUCT_IDS.POPULAR,
    sortOrder: 2,
  },
  {
    id: "pkg_best_value",
    name: "Best Value",
    credits: 50,
    priceUsd: 1800, // $18 in cents
    dodoProductId: DODO_PRODUCT_IDS.BEST_VALUE,
    sortOrder: 3,
  },
];

async function seedCreditPackages() {
  console.log("🌱 Seeding credit packages...\n");

  for (const pkg of PACKAGES) {
    // Check if package already exists
    const existing = await db
      .select()
      .from(creditPackage)
      .where(eq(creditPackage.id, pkg.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing package
      await db
        .update(creditPackage)
        .set({
          name: pkg.name,
          credits: pkg.credits,
          priceUsd: pkg.priceUsd,
          dodoProductId: pkg.dodoProductId,
          sortOrder: pkg.sortOrder,
          isActive: true,
        })
        .where(eq(creditPackage.id, pkg.id));

      console.log(
        `  ✅ Updated: ${pkg.name} (${pkg.credits} credits @ $${pkg.priceUsd / 100})`
      );
    } else {
      // Insert new package
      await db.insert(creditPackage).values({
        id: pkg.id,
        name: pkg.name,
        credits: pkg.credits,
        priceUsd: pkg.priceUsd,
        dodoProductId: pkg.dodoProductId,
        sortOrder: pkg.sortOrder,
        isActive: true,
      });

      console.log(
        `  ✅ Created: ${pkg.name} (${pkg.credits} credits @ $${pkg.priceUsd / 100})`
      );
    }
  }

  console.log("\n✨ Credit packages seeded successfully!");
  console.log(
    "\n⚠️  Remember to update DODO_PRODUCT_IDS with your actual DodoPayments product IDs!"
  );

  process.exit(0);
}

seedCreditPackages().catch((error) => {
  console.error("❌ Failed to seed credit packages:", error);
  process.exit(1);
});
