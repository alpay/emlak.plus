import type { Metadata } from "next";
import { HelpPage } from "@/components/landing/help-page";
import { getT } from "@/i18n/server";
import { constructMetadata } from "@/lib/constructMetadata";
import {
  getAllHelpArticles,
  getArticlesByCategory,
  getPopularArticles,
  helpCategories,
} from "@/lib/help";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.help.title"),
    description: t("metadata.pages.help.description"),
    canonical: "/help",
  });
}

interface HelpPageProps {
  params: Promise<{ lang: string }>;
}

export default async function Help({ params }: HelpPageProps) {
  const { lang } = await params;
  const articles = getAllHelpArticles(lang);
  const popularArticles = getPopularArticles(lang);

  // Calculate article count per category
  const articleCountByCategory: Record<string, number> = {};
  for (const category of helpCategories) {
    articleCountByCategory[category.slug] = getArticlesByCategory(
      category.slug,
      lang
    ).length;
  }

  return (
    <HelpPage
      articleCountByCategory={articleCountByCategory}
      articles={articles}
      categories={[...helpCategories]}
      popularArticles={popularArticles}
    />
  );
}
