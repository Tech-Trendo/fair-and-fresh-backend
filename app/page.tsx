import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Reviews } from "@/components/reviews";
import { AboutPreview } from "@/components/about-preview";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db";
import { staticPages, beforeAfterImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { getContentGroup } from "@/lib/site-content";
import { BeforeAfterSlider } from "@/components/before-after-slider";

export const dynamic = 'force-dynamic';

// Dynamically generate homepage metadata from staticPages table in DB
export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: eq(staticPages.slug, "home"),
  });

  if (!page) {
    return {
      title: "Professional Cleaning Services",
    };
  }

  return {
    title: page.metaTitle || "Professional Cleaning Services",
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
    orderBy: (services, { asc }) => [asc(services.sortOrder), asc(services.name)],
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

  // Fetch before/after images
  const dbBeforeAfter = await db
    .select()
    .from(beforeAfterImages)
    .orderBy(asc(beforeAfterImages.sortOrder), asc(beforeAfterImages.createdAt));

  const beforeAfterImagesData = dbBeforeAfter.map((img) => ({
    image_url: img.imageUrl,
    caption: img.caption || undefined,
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

  // Fetch homepage about section content from site_content table
  const homeContent = await getContentGroup('home');
  const aboutSection = {
    image: homeContent.home_about_image || '/professional-cleaning-team-with-equipment-in-brisb.jpg',
    heading: homeContent.home_about_heading || "Brisbane's Most Trusted Fabric Cleaning Specialists",
    description: homeContent.home_about_description || 'For over 15 years, we have been transforming homes and businesses across Brisbane with our professional fabric cleaning services.',
    ctaText: homeContent.home_about_cta_text || 'Learn More About Us',
    stats: [
      { value: Number(homeContent.home_about_years_value) || 15, suffix: '+', label: homeContent.home_about_years_label || 'Years' },
      { value: Number(homeContent.home_about_clients_value) || 2.5, suffix: 'K+', label: homeContent.home_about_clients_label || 'Clients', decimals: 1 as const },
      { value: Number(homeContent.home_about_satisfaction_value) || 98, suffix: '%', label: homeContent.home_about_satisfaction_label || 'Satisfaction' },
    ],
    features: [
      { title: homeContent.home_about_feature_1_title || 'Fully Insured', description: homeContent.home_about_feature_1_desc || 'Complete protection' },
      { title: homeContent.home_about_feature_2_title || 'Certified Experts', description: homeContent.home_about_feature_2_desc || 'Professional training' },
      { title: homeContent.home_about_feature_3_title || '2,500+ Happy Clients', description: homeContent.home_about_feature_3_desc || 'Proven track record' },
      { title: homeContent.home_about_feature_4_title || '100% Guarantee', description: homeContent.home_about_feature_4_desc || 'Satisfaction guaranteed' },
    ],
  };

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      {servicesList.length > 0 && (
        <Services services={servicesList} categories={categoriesList} />
      )}
      <BeforeAfterSlider images={beforeAfterImagesData} />
      <AboutPreview
        image={aboutSection.image}
        heading={aboutSection.heading}
        description={aboutSection.description}
        stats={aboutSection.stats}
        features={aboutSection.features}
        ctaText={aboutSection.ctaText}
      />
      {testimonialsList.length > 0 && (
        <Reviews reviews={testimonialsList} />
      )}
      <CtaSection />
      <Footer />
    </main>
  );
}
