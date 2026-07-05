import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogCategories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Metadata } from "next";
import { BlogCategoryTabs } from "@/components/blog-category-tabs";
import { BlogPostCard } from "@/components/blog-post-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await db.query.blogCategories.findMany({
    columns: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const category = await db.query.blogCategories.findFirst({
    where: eq(blogCategories.slug, slug),
  });

  if (!category) {
    return {
      title: "Category Not Found | Fair and Fresh Cleaning",
    };
  }

  const title = category.metaTitle || `${category.title} | Fair and Fresh Blog`;
  const description =
    category.metaDescription ||
    category.description ||
    `Read expert ${category.title.toLowerCase()} articles from Fair and Fresh Cleaning.`;

  return {
    title,
    description,
    keywords: category.metaKeywords || "",
    alternates: {
      canonical: category.canonicalUrl || `/blog/category/${category.slug}`,
    },
    openGraph: {
      title: category.ogTitle || title,
      description: category.ogDescription || description,
      type: "website",
      images: [
        {
          url: category.ogImage || category.image || "/placeholder.svg",
          alt: category.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.twitterTitle || title,
      description: category.twitterDescription || description,
      images: [category.twitterImage || category.image || "/placeholder.svg"],
    },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const categoryData = await db.query.blogCategories.findFirst({
    where: eq(blogCategories.slug, slug),
    with: {
      blogsCategories: {
        with: {
          blog: true,
        },
      },
    },
  });

  if (!categoryData) {
    notFound();
  }

  const allCategories = await db.query.blogCategories.findMany({
    orderBy: (blogCategories, { asc }) => [asc(blogCategories.title)],
  });

  const categoriesList = allCategories.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
  }));

  const postsList = (categoryData.blogsCategories || [])
    .map((bc) => bc.blog)
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground font-sans">
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-b border-border">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20 tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  Blog Category
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                  {categoryData.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {categoryData.description ||
                    `Explore our latest articles and expert advice on ${categoryData.title.toLowerCase()}.`}
                </p>
              </div>

              {categoryData.image && (
                <div className="relative aspect-video lg:aspect-square lg:max-h-[380px] rounded-2xl overflow-hidden bg-muted border border-border shadow-md">
                  <Image
                    src={categoryData.image}
                    alt={categoryData.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 500px"
                    priority
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border">
          <BlogCategoryTabs categories={categoriesList} activeSlug={slug} />
        </section>

        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Articles in {categoryData.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse helpful tips and guides from our cleaning experts.
            </p>
          </div>

          {postsList.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-bold text-foreground">No articles in this category yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Check back soon for new {categoryData.title.toLowerCase()} content.
              </p>
              <div className="mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all text-xs"
                >
                  View All Articles
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {postsList.map((post) => (
                <BlogPostCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  featuredImage={post.featuredImage || ""}
                  description={post.description || ""}
                  createdAt={post.createdAt}
                  categoryTitle={categoryData.title}
                  categorySlug={categoryData.slug}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
