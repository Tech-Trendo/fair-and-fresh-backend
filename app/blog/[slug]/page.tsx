import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { blogs } from "@/lib/schema";
import { eq, desc, ne } from "drizzle-orm";
import { Calendar, User, ArrowLeft, Tag, Clock, Share2, Sparkles } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically for SEO optimization
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await db.query.blogs.findFirst({
    where: eq(blogs.slug, slug),
  });

  if (!post) {
    return {
      title: "Article Not Found | Fair and Fresh Cleaning",
    };
  }

  const title = post.metaTitle || `${post.title} | Fair and Fresh Cleaning`;
  const description = post.metaDescription || "Read the latest cleaning advice and guides from Fair and Fresh specialists.";

  return {
    title,
    description,
    keywords: post.metaKeywords || "",
    alternates: {
      canonical: post.canonicalUrl || `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      type: "article",
      images: [
        {
          url: post.ogImage || post.featuredImage || "/uploads/blog_workspace.jpg",
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || title,
      description: post.twitterDescription || description,
      images: [post.twitterImage || post.featuredImage || "/uploads/blog_workspace.jpg"],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Query database directly
  const post = await db.query.blogs.findFirst({
    where: eq(blogs.slug, slug),
    with: {
      blogsCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Fetch recent posts excluding the current one
  const recentPostsRaw = await db.query.blogs.findMany({
    where: ne(blogs.id, post.id),
    limit: 3,
    orderBy: desc(blogs.createdAt),
    with: {
      blogsCategories: {
        with: {
          category: true,
        },
      },
    },
  });

  const formattedDate = new Date(post.createdAt).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const resolvedCategory = post.blogsCategories.length > 0 
    ? post.blogsCategories[0].category.title 
    : "General";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground font-sans py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <div className="mb-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to all articles
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Article Content */}
            <article className="lg:col-span-2 space-y-8">
              
              {/* Header Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <span className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg">
                    <Tag className="w-3.5 h-3.5" />
                    {resolvedCategory}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
                  {post.title}
                </h1>

                {/* Author & Date Metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2 border-b border-border pb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      FF
                    </div>
                    <span className="font-semibold text-foreground">Fair & Fresh Team</span>
                  </div>
                  <span className="text-border hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    {formattedDate}
                  </div>
                  <span className="text-border hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    5 min read
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border">
                <Image
                  src={post.featuredImage || "/uploads/blog_workspace.jpg"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  priority
                  className="object-cover"
                />
              </div>

              {/* Render Rich Description content */}
              <div 
                className="prose prose-zinc max-w-none text-foreground leading-relaxed text-base sm:text-lg space-y-6
                  [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                  [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                  [&_p]:mb-4 [&_p]:text-muted-foreground
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-muted-foreground
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-muted-foreground
                  [&_strong]:font-semibold [&_strong]:text-foreground
                  [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: post.description }}
              />
            </article>

            {/* Sidebar */}
            <aside className="space-y-8 lg:sticky lg:top-24 h-fit">
              
              {/* Promo Banner CTA */}
              <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 p-6 shadow-md">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary">
                    <Sparkles className="w-3 h-3" /> Special Offer
                  </span>
                  <h3 className="text-xl font-bold text-foreground leading-snug">
                    Need Help Keeping Your Place Fresh?
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Book any professional cleaning service today and get an instant <strong>20% OFF</strong>! Professional equipment, insured cleaners.
                  </p>
                  <Link href="/quote" className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all text-xs text-center shadow-sm">
                    Get Free Quote Now
                  </Link>
                </div>
              </div>

              {/* Related/Recent Posts */}
              {recentPostsRaw.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Recommended Reading
                  </h3>
                  <div className="space-y-4">
                    {recentPostsRaw.map((recentPost) => {
                      const recDate = new Date(recentPost.createdAt).toLocaleDateString("en-AU", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                      return (
                        <div key={recentPost.id} className="flex gap-4 group">
                          <Link href={`/blog/${recentPost.slug}`} className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border">
                            <Image
                              src={recentPost.featuredImage || "/uploads/blog_workspace.jpg"}
                              alt={recentPost.title}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </Link>
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                              <Link href={`/blog/${recentPost.slug}`}>
                                {recentPost.title}
                              </Link>
                            </h4>
                            <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {recDate}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
