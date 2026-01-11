import type { Metadata } from "next";
import { ContactPage } from "@/components/landing/contact-page";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.contact.title"),
    description: t("metadata.pages.contact.description"),
    canonical: "/contact",
  });
}

export default function Page() {
  return <ContactPage />;
}

