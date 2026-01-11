import type { Metadata } from "next";
import { BlogPage } from "@/components/landing/blog-page";
import { getAllCategories, getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | Emlak",
  description:
    "Tips, guides, and industry insights to help you create stunning property listings. Learn from experts and elevate your real estate photography.",
};

interface BlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function Blog({ params }: BlogPageProps) {
  const { lang } = await params;
  const posts = getAllPosts(lang);
  const categories = getAllCategories(lang);

  return <BlogPage categories={categories} posts={posts} />;
}
