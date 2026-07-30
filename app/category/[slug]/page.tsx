import React from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { serviceCategories } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { CategoryTabs } from "@/components/category-tabs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await db.query.serviceCategories.findMany({
    columns: { slug: true },
  });
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await db.query.serviceCategories.findFirst({
    where: eq(serviceCategories.slug, slug),
  });

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = category.metaTitle || `${category.title} Cleaning Services`;
  const description = category.metaDescription || category.description || "Brisbane's trusted cleaning services.";

  return {
    title,
    description,
    keywords: category.metaKeywords || "",
    alternates: { canonical: category.canonicalUrl || `/category/${category.slug}` },
    openGraph: {
      title: category.ogTitle || title,
      description: category.ogDescription || description,
      type: "website",
      images: [{ url: category.ogImage || category.image || "/placeholder.svg", alt: category.title }],
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

  const categoryData = await db.query.serviceCategories.findFirst({
    where: eq(serviceCategories.slug, slug),
    with: {
      servicesCategories: {
        with: {
          service: {
            with: { images: { limit: 1 } },
          },
        },
      },
    },
  });

  if (!categoryData) notFound();

  const allCategories = await db.query.serviceCategories.findMany({
    orderBy: (serviceCategories, { asc }) => [asc(serviceCategories.title)],
  });

  const categoriesList = allCategories.map((c) => ({ id: c.id, title: c.title, slug: c.slug }));

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
      <main className="min-h-screen bg-background">
        {/* Banner */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-nav text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <FadeIn>
                <span className="inline-flex items-center bg-accent-tint text-primary text-xs font-nav px-3 py-1 rounded-full mb-4">
                  <Sparkles className="w-3 h-3 mr-1.5" /> Service Category
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading-bold text-foreground mb-4 leading-tight">
                  {categoryData.title}
                </h1>
                <p className="text-base text-muted-foreground font-body leading-relaxed mb-5">
                  {categoryData.description || "Professional cleaning solutions tailored to keep your spaces pristine and fresh."}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-body">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Satisfaction Guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary" /> Eco-Friendly Products
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={0.1}>
                {categoryData.image && (
                  <div className="relative aspect-video lg:aspect-square lg:max-h-[360px] rounded-xl overflow-hidden bg-muted shadow-sm border border-border">
                    <Image src={categoryData.image} alt={categoryData.title} fill sizes="(max-width: 1024px) 100vw, 500px" priority className="object-cover" />
                  </div>
                )}
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryTabs categories={categoriesList} activeSlug={slug} />

            <FadeIn className="mb-8">
              <h2 className="text-xl md:text-2xl font-heading-bold text-foreground">Available {categoryData.title} Packages</h2>
              <p className="text-sm text-muted-foreground font-body mt-1">Select any of our customized fabric and room cleaning solutions below.</p>
            </FadeIn>

            {servicesList.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl bg-white">
                <h3 className="text-base font-heading-bold text-foreground">No services configured yet</h3>
                <p className="text-sm text-muted-foreground font-body mt-1">Please check back later or contact us directly.</p>
                <div className="mt-5">
                  <Link href="/contact" className="inline-flex items-center px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-nav hover:bg-primary/90 transition-colors">
                    Contact Support
                  </Link>
                </div>
              </div>
            ) : (
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {servicesList.map((service) => (
                  <StaggerItem key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="block h-full group">
                      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col border border-border">
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <Image src={service.image || "/placeholder.svg"} alt={service.name} width={400} height={250} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h3 className="text-base font-heading-bold text-foreground mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                          {service.shortDescription && (
                            <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2 flex-grow">{service.shortDescription}</p>
                          )}
                          <div className="mt-3 flex items-center gap-1 text-xs font-nav text-primary group-hover:gap-2 transition-all">
                            Learn More <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
