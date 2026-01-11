import type { Metadata } from "next";
import { TermsContent } from "@/components/landing/terms-content";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.terms.title"),
    description: t("metadata.pages.terms.description"),
    canonical: "/terms",
    noIndex: true,
  });
}

export default function TermsPage() {
  return <TermsContent />;
}

