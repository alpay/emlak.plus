import type { Metadata } from "next";
import { AboutPage } from "@/components/landing/about-page";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.about.title"),
    description: t("metadata.pages.about.description"),
    canonical: "/about",
  });
}

export default function Page() {
  return <AboutPage />;
}

