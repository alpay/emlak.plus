import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HelpCategoryPage } from "@/components/landing/help-category-page";
import {
  getArticlesByCategory,
  getCategoryBySlug,
  helpCategories,
} from "@/lib/help";

interface HelpCategoryProps {
  params: Promise<{ category: string; lang: string }>;
}

export function generateStaticParams() {
  const languages = ["en", "tr"];
  const params = [];

  for (const lang of languages) {
    for (const category of helpCategories) {
      params.push({ category: category.slug, lang });
    }
  }
  return params;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: HelpCategoryProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Emlak Help",
    };
  }

  return {
    title: `${category.title} | Emlak Help`,
    description: category.description,
  };
}

export default async function HelpCategory({ params }: HelpCategoryProps) {
  const { category: categorySlug, lang } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(categorySlug, lang);

  return <HelpCategoryPage articles={articles} category={category} />;
}
