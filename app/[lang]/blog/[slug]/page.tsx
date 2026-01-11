import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostPage } from "@/components/landing/blog-post-page";
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";

interface BlogPostProps {
  params: Promise<{ slug: string; lang: string }>;
}

export async function generateStaticParams() {
  const languages = ["en", "tr"];
  const params = [];

  for (const lang of languages) {
    const slugs = getAllPostSlugs(lang);
    for (const slug of slugs) {
      params.push({ slug, lang });
    }
  }
  return params;
}

// Return 404 for slugs not generated at build time
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    return {
      title: "Post Not Found | Emlak",
    };
  }

  return {
    title: `${post.title} | Emlak Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug, lang } = await params;
  const post = await getPostBySlug(slug, lang);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, post.category, 3, lang);

  return <BlogPostPage post={post} relatedPosts={relatedPosts} />;
}
