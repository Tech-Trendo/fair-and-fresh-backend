import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/service-template";
import { db } from "@/lib/db";
import { services } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for SEO based on database columns
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await db.query.services.findFirst({
    where: eq(services.slug, slug),
  });

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.metaTitle || `Professional ${service.name} Brisbane | Fair & Fresh`,
    description: service.metaDescription || `Brisbane's top-rated ${service.name.toLowerCase()} service. We provide premium cleaning using eco-friendly solutions. Get a free quote today!`,
    keywords: service.metaKeywords ? service.metaKeywords.split(",").map(k => k.trim()) : [service.name.toLowerCase(), "Brisbane", "cleaning", "Fair and Fresh"],
    openGraph: {
      title: service.ogTitle || service.name,
      description: service.ogDescription || service.shortDescription || undefined,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;

  // Query service details including all related benefits, inclusions, images, and reviews
  const service = await db.query.services.findFirst({
    where: eq(services.slug, slug),
    with: {
      benefits: true,
      whatsIncluded: true,
      images: true,
      testimonials: true,
    },
  });

  if (!service) {
    notFound();
  }

  // Map database benefits to Template format
  const benefitsList = service.benefits.map((b, idx) => {
    const icons = ["Sparkles", "Shield", "Clock", "Award"];
    return {
      iconName: icons[idx % icons.length],
      title: b.title,
      description: b.description || "",
    };
  });

  // Map database inclusions/steps to Template format
  const processSteps = service.whatsIncluded.map((w, idx) => ({
    step: `0${idx + 1}`,
    title: w.title,
    description: w.description || "",
  }));

  // Use database images if available, otherwise fallback to local gallery folders
  const galleryImages = service.images.length > 0
    ? service.images.map((img, idx) => ({
        url: img.imageUrl,
        alt: `${service.name} result ${idx + 1}`,
      }))
    : [1, 2, 3, 4].map((num) => ({
        url: `/${service.slug}/photo${num}.jpg`,
        alt: `${service.name} result ${num}`,
      }));

  const standardFaqs = [
    {
      question: `How long does the ${service.name.toLowerCase()} process take?`,
      answer: `Most residential ${service.name.toLowerCase()} jobs take between 2 to 4 hours, depending on the size of the area, and the level of cleaning required. We always provide a clear time estimate when you book.`
    },
    {
      question: `How long until we can use the cleaned area/items?`,
      answer: `Thanks to our strong extraction process, items are typically dry and ready within 4-6 hours. You can use them shortly after, but it's best to minimize usage until fully dry.`
    },
    {
      question: `Are your cleaning solutions safe for pets and children?`,
      answer: `Absolutely. We pride ourselves on using eco-friendly, biodegradable, and non-toxic cleaning products that are 100% safe for your entire family, including pets and babies.`
    },
    {
      question: `Can you guarantee the removal of all stains?`,
      answer: `While we use advanced techniques and have a very high success rate with tough stains, some substances permanently alter the fabric dye. We will set honest expectations during our pre-inspection.`
    }
  ];

  const typesList = [
    "Residential & Home Fabric Care",
    "Commercial Office & Corporate Spaces",
    "Delicate Fiber & Material Protections",
    "Deep Stain Extractions & Odor Control",
  ];

  return (
    <ServiceTemplate
      badge="Professional Cleaning Care"
      title={`Brisbane's Best ${service.name} Services`}
      description={service.longDescription || service.shortDescription || ""}
      heroImage={service.images[0]?.imageUrl || "/placeholder.svg"}
      heroImageAlt={service.name}
      stats={[
        { label: "Happy Clients", value: 2500, suffix: "+" },
        { label: "Years Experience", value: 15, suffix: "+" },
        { label: "Rating", value: 4.9 },
      ]}
      benefitsTitle={`Why Choose Our ${service.name}?`}
      benefitsDescription={`Professional results that extend the life of your ${service.name.toLowerCase()} and improve your indoor air quality.`}
      benefits={benefitsList}
      galleryTitle="Our Cleaning Results"
      galleryDescription={`See the remarkable difference our professional ${service.name.toLowerCase()} makes.`}
      galleryImages={galleryImages}
      processTitle="Our Systematic Cleaning Process"
      processDescription="A proven, systematic approach to ensure spotless, revitalized results every time."
      processSteps={processSteps}
      typesTitle={`Types of ${service.name} We Masterfully Clean`}
      types={typesList}
      faqs={standardFaqs}
      ctaTitle={`Experience Brisbane's Best ${service.name} Care`}
      ctaDescription={`Don't wait—restore the beauty and hygiene of your space today. Contact us for a free, no-obligation quote.`}
    />
  );
}
