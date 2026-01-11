import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpArticlePage } from "@/components/landing/help-article-page";
import {
  getAllHelpArticlePaths,
  getCategoryBySlug,
  getHelpArticle,
  getRelatedArticles,
} from "@/lib/help";

interface HelpArticlePageProps {
  params: Promise<{ category: string; slug: string; lang: string }>;
}

export function generateStaticParams() {
  const languages = ["en", "tr"];
  const params: { category: string; slug: string; lang: string }[] = [];

  for (const lang of languages) {
    const paths = getAllHelpArticlePaths(lang);
    for (const path of paths) {
      params.push({ ...path, lang });
    }
  }
  return params;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: HelpArticlePageProps): Promise<Metadata> {
  const { category: categorySlug, slug, lang } = await params;
  const article = await getHelpArticle(categorySlug, slug, lang);

  if (!article) {
    return {
      title: "Article Not Found | Emlak Help",
    };
  }

  return {
    title: `${article.title} | Emlak Help`,
    description: article.description,
  };
}

export default async function HelpArticle({ params }: HelpArticlePageProps) {
  const { category: categorySlug, slug, lang } = await params;

  const article = await getHelpArticle(categorySlug, slug, lang);
  const category = getCategoryBySlug(categorySlug);

  if (!(article && category)) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(slug, categorySlug, 3, lang);

  return (
    <HelpArticlePage
      article={article}
      category={category}
      relatedArticles={relatedArticles}
    />
  );
}
