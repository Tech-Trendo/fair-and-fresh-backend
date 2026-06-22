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
    openGraph: {
      title: page.ogTitle || undefined,
      description: page.ogDescription || undefined,
      type: "website",
    },
  };
}

export default async function Home() {
  // Query all services and fetch their first image dynamically using Drizzle relations
  const dbServices = await db.query.services.findMany({
    with: {
      images: {
        limit: 1,
      },
    },
    orderBy: (services, { asc }) => [asc(services.name)],
  });

  const servicesList = dbServices.map((s) => ({
    name: s.name,
    slug: s.slug,
    image: s.images[0]?.imageUrl || "/placeholder.svg",
  }));

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services services={servicesList} />
      <AboutPreview />
      <Reviews />
      <CtaSection />
      <Footer />
    </main>
  );
}
