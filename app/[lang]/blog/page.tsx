import type { Metadata } from "next";
import { BlogPage } from "@/components/landing/blog-page";
import { getT } from "@/i18n/server";
import { getAllCategories, getAllPosts } from "@/lib/blog";
import { constructMetadata } from "@/lib/constructMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return constructMetadata({
    title: t("metadata.pages.blog.title"),
    description: t("metadata.pages.blog.description"),
    canonical: "/blog",
  });
}

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function Blog({ params }: BlogPageProps) {
  const { lang } = await params;
  const posts = getAllPosts(lang);
  const categories = getAllCategories(lang);

  return <BlogPage categories={categories} posts={posts} />;
}
