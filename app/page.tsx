import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Reviews } from "@/components/reviews";
import { AboutPreview } from "@/components/about-preview";
import { CtaSection } from "@/components/cta-section";
import { ServiceAreaMap } from "@/components/service-area-map";
import { Footer } from "@/components/footer";
import { db } from "@/lib/db";
import { staticPages, beforeAfterImages, homeServiceCategories } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { getContentGroup } from "@/lib/site-content";
import { normalizeHomeSection } from "@/lib/home-sections";
import { BeforeAfterSlider } from "@/components/before-after-slider";

// Revalidated on a schedule: site content (hero copy, images, services) only
// changes through the admin dashboard, so a short ISR window keeps edits fast
// without re-rendering + re-querying the DB on every single visit.
export const revalidate = 60;

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
     homeSection: normalizeHomeSection(s.homeSection),
    }));

  // Fetch home service categories (homepage section tabs), admin-managed
  const dbHomeSections = await db
    .select()
    .from(homeServiceCategories)
    .orderBy(asc(homeServiceCategories.sortOrder), asc(homeServiceCategories.title));

  const homeSections = dbHomeSections.map((c) => ({ slug: c.slug, title: c.title }));

  // Fetch before/after images
  const dbBeforeAfter = await db
    .select()
    .from(beforeAfterImages)
    .orderBy(asc(beforeAfterImages.sortOrder), asc(beforeAfterImages.createdAt));

  const beforeAfterImagesData = dbBeforeAfter.map((img) => ({
    image_url: img.imageUrl,
    before_image_url: img.beforeImageUrl || undefined,
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
    location: t.location || "Brisbane, QLD",
    rating: t.rating,
    text: t.content,
    service: t.service?.name || "Cleaning Service",
  }));

  // Fetch homepage about section content from site_content table
  const homeContent = await getContentGroup('home');
  const siteSettings = await getContentGroup('site_settings');
  const heroContent = {
    title: homeContent.home_hero_title || 'Professional Fabric Cleaning in <span class="text-primary">Brisbane</span>',
    description: homeContent.home_hero_description || "Carpet, mattress, rug, upholstery, and curtain cleaning across Brisbane. Straightforward pricing, thorough work, and results you can see — and feel.",
    promoText: homeContent.home_promo_text || "Same-day booking — 20% off",
    heroImage: homeContent.home_hero_image || "/placeholder.svg",
    phone: siteSettings.site_phone || "0430 799 567",
  };
  const aboutSection = {
    image: homeContent.home_about_image || '/professional-cleaning-team-with-equipment-in-brisb.jpg',
    heading: homeContent.home_about_heading || "Brisbane's Most Trusted Fabric Cleaning Specialists",
    description: homeContent.home_about_description || 'For over 15 years, we have been transforming homes and businesses across Brisbane with our professional fabric cleaning services.',
    ctaText: homeContent.home_about_cta_text || 'Learn More About Us',
  };

  return (
    <main className="min-h-screen">
      <HeaderWrapper />
      <Hero content={heroContent} />
      {servicesList.length > 0 && (
        <Services services={servicesList} sections={homeSections} />
      )}
      <BeforeAfterSlider images={beforeAfterImagesData} />
      <AboutPreview
        image={aboutSection.image}
        heading={aboutSection.heading}
        description={aboutSection.description}
        ctaText={aboutSection.ctaText}
      />
      {testimonialsList.length > 0 && (
        <Reviews reviews={testimonialsList} />
      )}
      <CtaSection />
      <ServiceAreaMap />
      <Footer />
    </main>
  );
}
