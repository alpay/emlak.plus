import type { Metadata } from "next";
import { HelpPage } from "@/components/landing/help-page";
import {
  getAllHelpArticles,
  getArticlesByCategory,
  getPopularArticles,
  helpCategories,
} from "@/lib/help";

export const metadata: Metadata = {
  title: "Help Center | Emlak+",
  description:
    "Get help with Emlak+. Browse our knowledge base for guides, tutorials, and answers to frequently asked questions.",
};

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
