import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { categories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle } from "lucide-react";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for category SEO indexability
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  });

  if (!category) {
    return {
      title: "Category Not Found | Fair and Fresh Cleaning",
    };
  }

  const title = category.metaTitle || `${category.title} Cleaning Services | Fair and Fresh`;
  const description = category.metaDescription || category.description || "Brisbane's trusted cleaning services.";

  return {
    title,
    description,
    keywords: category.metaKeywords || "",
    alternates: {
      canonical: category.canonicalUrl || `/category/${category.slug}`,
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  // Query category and its corresponding services
  const categoryData = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: {
      servicesCategories: {
        with: {
          service: {
            with: {
              images: {
                limit: 1,
              },
            },
          },
        },
      },
    },
  });

  if (!categoryData) {
    notFound();
  }

  // Extract linked services
  const servicesList = (categoryData.servicesCategories || [])
    .map((sc: any) => sc.service)
    .filter(Boolean)
    .map((s: any) => ({
      name: s.name,
      slug: s.slug,
      image: s.images[0]?.imageUrl || "/placeholder.svg",
      icon: s.icon || undefined,
      shortDescription: s.shortDescription || "",
    }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground font-sans">
        
        {/* Category Banner Hero */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-b border-border">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Back link */}
            <div className="mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-wider"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Category Info */}
              <div className="space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase bg-primary/10 text-primary border border-primary/20 tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Service Category
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                  {categoryData.title}
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {categoryData.description || "Professional cleaning solutions tailored to keep your spaces pristine and fresh."}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground pt-4">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Satisfaction Guarantee
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Eco-Friendly Products
                  </span>
                </div>
              </div>

              {/* Category Showcase Image */}
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

        {/* Services List Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
              Available {categoryData.title} Packages
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select any of our customized fabric and room cleaning solutions below to see details.
            </p>
          </div>

          {servicesList.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
              <h3 className="text-lg font-bold text-foreground">No services configured yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please check back later or contact us directly to inquire about {categoryData.title} cleaning packages.
              </p>
              <div className="mt-6">
                <Link href="/contact" className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all text-xs">
                  Contact Support
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {servicesList.map((service, index) => {
                return (
                  <div
                    key={service.slug}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group border border-border/40 bg-card rounded-2xl h-full flex flex-col"
                  >
                    <div className="p-0 h-full flex flex-col flex-grow">
                      <Link href={`/services/${service.slug}`} className="block flex-grow">
                        {/* Image */}
                        <div className="relative overflow-hidden aspect-video bg-muted">
                          <Image
                            src={service.image}
                            alt={service.name}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                        </div>

                        {/* Title and Short description */}
                        <div className="p-5 space-y-2.5">
                          <h3 className="text-base sm:text-lg font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug">
                            {service.name}
                          </h3>
                          {service.shortDescription && (
                            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                              {service.shortDescription}
                            </p>
                          )}
                        </div>
                      </Link>

                      {/* CTA link */}
                      <div className="p-5 pt-0 mt-auto">
                        <Link
                          href={`/services/${service.slug}`}
                          className="text-xs font-bold text-primary group-hover:text-accent flex items-center gap-1 transition-colors w-fit"
                        >
                          Learn More
                          <svg
                            className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
