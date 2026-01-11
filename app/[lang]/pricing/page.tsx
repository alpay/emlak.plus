import type { Metadata } from "next";
import { PricingPage } from "@/components/landing/pricing-page";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.pricing.title"),
    description: t("metadata.pages.pricing.description"),
    canonical: "/pricing",
  });
}

export default function Page() {
  return <PricingPage />;
}
