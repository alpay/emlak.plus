import type { Metadata } from "next";
import { PrivacyContent } from "@/components/landing/privacy-content";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.privacy.title"),
    description: t("metadata.pages.privacy.description"),
    canonical: "/privacy",
    noIndex: true,
  });
}

export default function PrivacyPage() {
  return <PrivacyContent />;
}

