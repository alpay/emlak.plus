"use client";

import { IconFileSearch, IconSearch } from "@tabler/icons-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useBlogFilters } from "@/hooks/use-blog-filters";
import type { BlogPostMeta } from "@/lib/blog";
import { BlogCard } from "./blog-card";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";

interface BlogPageProps {
  posts: BlogPostMeta[];
  categories: string[];
}

export function BlogPage({ posts, categories }: BlogPageProps) {
  const { t } = useTranslation();
  const { category, setCategory, search, setSearch } = useBlogFilters();

  // Filter posts based on category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category filter
      if (category && post.category !== category) {
        return false;
      }
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(searchLower);
        const matchesDescription = post.description
          .toLowerCase()
          .includes(searchLower);
        if (!(matchesTitle || matchesDescription)) {
          return false;
        }
      }
      return true;
    });
  }, [posts, category, search]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--landing-bg)" }}
    >
      <LandingNav />

      <main>
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-12 text-center md:pt-28 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <p
              className="font-semibold text-sm uppercase tracking-wider"
              style={{ color: "var(--landing-accent)" }}
            >
              {t("blogPage.eyebrow")}
            </p>
            <h1
              className="mt-3 font-bold text-4xl tracking-tight sm:text-5xl md:text-6xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("blogPage.title")}
            </h1>
            <p
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl"
              style={{ color: "var(--landing-text-muted)" }}
            >
              {t("blogPage.subtitle")}
            </p>
          </div>
        </section>

        {/* Category Pills */}
        <section className="px-6 pb-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                className="rounded-full px-4 py-2 font-medium text-sm transition-colors"
                onClick={() => setCategory(null)}
                style={
                  category
                    ? {
                        backgroundColor: "var(--landing-card)",
                        color: "var(--landing-text)",
                        border: "1px solid var(--landing-border)",
                      }
                    : {
                        backgroundColor: "var(--landing-accent)",
                        color: "var(--landing-accent-foreground)",
                      }
                }
                type="button"
              >
                {t("blogPage.allPosts")}
              </button>
              {categories.map((cat) => (
                <button
                  className="rounded-full px-4 py-2 font-medium text-sm transition-colors hover:opacity-80"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={
                    category === cat
                      ? {
                          backgroundColor: "var(--landing-accent)",
                          color: "var(--landing-accent-foreground)",
                        }
                      : {
                          backgroundColor: "var(--landing-card)",
                          color: "var(--landing-text)",
                          border: "1px solid var(--landing-border)",
                        }
                  }
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="px-6 pb-16">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 flex items-center justify-between">
                <h2
                  className="font-semibold text-sm uppercase tracking-wider"
                  style={{ color: "var(--landing-text-muted)" }}
                >
                  {t("blogPage.featured")}
                </h2>
              </div>
              <div className="space-y-8">
                {featuredPosts.map((post) => (
                  <BlogCard featured key={post.slug} post={post} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Posts Grid */}
        <section
          className="px-6 py-16"
          style={{ backgroundColor: "var(--landing-bg-alt)" }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 flex items-center justify-between">
              <h2
                className="font-semibold text-sm uppercase tracking-wider"
                style={{ color: "var(--landing-text-muted)" }}
              >
                {category ? category : t("blogPage.allArticles")}
                {search && t("blogPage.matching", { query: search })}
              </h2>
              <div className="relative">
                <IconSearch
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                  style={{ color: "var(--landing-text-muted)" }}
                />
                <input
                  aria-label={t("blogPage.searchAria")}
                  className="h-10 w-48 rounded-full pr-4 pl-9 text-sm outline-none transition-all placeholder:opacity-50 focus:w-64 focus:ring-2"
                  onChange={(e) => setSearch(e.target.value || null)}
                  placeholder={t("blogPage.searchPlaceholder")}
                  style={{
                    backgroundColor: "var(--landing-card)",
                    color: "var(--landing-text)",
                    border: "1px solid var(--landing-border)",
                  }}
                  type="text"
                  value={search ?? ""}
                />
              </div>
            </div>

            {regularPosts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {regularPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div
                  className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--landing-bg)",
                    border: "1px solid var(--landing-border)",
                  }}
                >
                  <IconFileSearch
                    className="size-8"
                    style={{ color: "var(--landing-text-muted)" }}
                  />
                </div>
                <h3
                  className="font-semibold text-lg"
                  style={{ color: "var(--landing-text)" }}
                >
                  {t("blogPage.noResults.title")}
                </h3>
                <p
                  className="mx-auto mt-2 max-w-sm text-sm"
                  style={{ color: "var(--landing-text-muted)" }}
                >
                  {search || category
                    ? t("blogPage.noResults.desc")
                    : t("blogPage.noResults.descEmpty")}
                </p>
                {(search || category) && (
                  <button
                    className="mt-6 inline-flex h-10 items-center rounded-full px-6 font-medium text-sm transition-all duration-200 hover:scale-[1.03]"
                    onClick={() => {
                      setCategory(null);
                      setSearch(null);
                    }}
                    style={{
                      backgroundColor: "var(--landing-accent)",
                      color: "var(--landing-accent-foreground)",
                    }}
                    type="button"
                  >
                    {t("blogPage.noResults.clear")}
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-6 py-24">
          <div
            className="mx-auto max-w-4xl rounded-3xl px-8 py-16 text-center md:px-16"
            style={{
              backgroundColor: "var(--landing-card)",
              boxShadow: "0 25px 50px -12px var(--landing-shadow)",
              border: "1px solid var(--landing-border)",
            }}
          >
            <h2
              className="font-bold text-3xl tracking-tight sm:text-4xl"
              style={{ color: "var(--landing-text)" }}
            >
              {t("blogPage.newsletter.title")}
            </h2>
            <p
              className="mx-auto mt-4 max-w-lg text-lg leading-relaxed"
              style={{ color: "var(--landing-text-muted)" }}
            >
              {t("blogPage.newsletter.desc")}
            </p>
            <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                aria-label="Email address"
                className="h-12 flex-1 rounded-full px-5 text-base outline-none transition-all placeholder:opacity-50 focus:ring-2"
                placeholder={t("blogPage.newsletter.placeholder")}
                style={{
                  backgroundColor: "var(--landing-bg)",
                  color: "var(--landing-text)",
                  border: "1px solid var(--landing-border)",
                }}
                type="email"
              />
              <button
                className="h-12 rounded-full px-6 font-medium text-base transition-all duration-200 hover:scale-[1.03]"
                style={{
                  backgroundColor: "var(--landing-accent)",
                  color: "var(--landing-accent-foreground)",
                }}
                type="submit"
              >
                {t("blogPage.newsletter.subscribe")}
              </button>
            </form>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
