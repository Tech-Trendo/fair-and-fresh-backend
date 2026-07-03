import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Reviews } from "@/components/reviews";
import { AboutPreview } from "@/components/about-preview";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Dynamically generate homepage metadata from staticPages table in DB
export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: eq(staticPages.slug, "home"),
  });

  if (!page) {
    return {
      title: "Fair and Fresh Cleaning",
    };
  }

  return {
    title: page.metaTitle || "Fair and Fresh Cleaning",
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    alternates: {
      canonical: page.canonicalUrl || undefined,
    },
    robots: page.metaRobots || undefined,
    other: page.metaRobots ? {
      "x-robots-tag": page.metaRobots,
    } : undefined,
    openGraph: {
      title: page.ogTitle || undefined,
      description: page.ogDescription || undefined,
      type: "website",
    },
  };
}

export default async function Home() {
  // Query all services and fetch their first image and categories dynamically using Drizzle relations
  const dbServices = await db.query.services.findMany({
    with: {
      images: {
        limit: 1,
      },
      servicesCategories: {
        with: {
          category: true,
        },
      },
    },
    orderBy: (services, { asc }) => [asc(services.name)],
  });

  const servicesList = dbServices.map((s) => ({
    name: s.name,
    slug: s.slug,
    image: s.images[0]?.imageUrl || "/placeholder.svg",
    icon: s.icon || undefined,
    shortDescription: s.shortDescription || "",
    category: s.servicesCategories.map((sc) => sc.category),
  }));

  // Fetch all categories for filtering tabs
  const dbCategories = await db.query.serviceCategories.findMany({
    orderBy: (serviceCategories, { asc }) => [asc(serviceCategories.title)],
  });

  const categoriesList = dbCategories.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
  }));

  // Fetch testimonials from database dynamically using Drizzle query
  const dbTestimonials = await db.query.testimonials.findMany({
    with: {
      service: true,
    },
  });

  const testimonialsList = dbTestimonials.map((t) => ({
    name: t.author,
    location: "Brisbane, QLD",
    rating: t.rating,
    text: t.content,
    service: t.service?.name || "Cleaning Service",
  }));

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services services={servicesList} categories={categoriesList} />
      <AboutPreview />
      <Reviews reviews={testimonialsList} />
      <CtaSection />
      <Footer />
    </main>
  );
}
