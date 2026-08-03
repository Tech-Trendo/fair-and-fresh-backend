import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceTemplate } from "@/components/service-template";
import { db } from "@/lib/db";
import { services, suburbs, comboPageTargets, suburbCopyBlocks } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getRegionLabel, pickByHash } from "@/lib/suburbs";
import { getSuburbPrice, formatSuburbPrice } from "@/lib/suburb-pricing";

interface PageProps {
  params: Promise<{ slug: string; suburb: string }>;
}

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  const targets = await db.query.comboPageTargets.findMany({
    where: eq(comboPageTargets.isActive, true),
    with: { service: true, suburb: true },
  });
  return targets.map((t) => ({ slug: t.service.slug, suburb: t.suburb.slug }));
}

const SITE_URL = 'https://www.fairandfreshcleaning.com.au';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, suburb } = await params;
  const [svc, sub] = await Promise.all([
    db.query.services.findFirst({ where: eq(services.slug, slug) }),
    db.query.suburbs.findFirst({ where: eq(suburbs.slug, suburb) }),
  ]);
  if (!svc || !sub || !sub.isActive) return { title: "Service Not Found" };

  const regionLabel = getRegionLabel(sub.region);
  const title = `${svc.name} in ${sub.name} | Fair & Fresh Cleaning`;
  const description = `Professional ${svc.name.toLowerCase()} in ${sub.name}, ${regionLabel}. Local pricing, fast response, and thorough results.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/services/${svc.slug}/${sub.slug}` },
    openGraph: { title, description, type: "website", images: [{ url: "/fair-fresh-logo.svg" }] },
  };
}

async function getCopyBlocks(regionType: string, blockType: string): Promise<string[]> {
  const rows = await db
    .select({ content: suburbCopyBlocks.content })
    .from(suburbCopyBlocks)
    .where(
      and(
        eq(suburbCopyBlocks.regionType, regionType),
        eq(suburbCopyBlocks.blockType, blockType)
      )
    );
  return rows.map((r) => r.content);
}

export default async function ServiceSuburbPage({ params }: PageProps) {
  const { slug, suburb } = await params;

  const [svc, sub] = await Promise.all([
    db.query.services.findFirst({
      where: eq(services.slug, slug),
      with: { benefits: true, whatsIncluded: true, serviceTypes: true, images: true, testimonials: true },
    }),
    db.query.suburbs.findFirst({ where: and(eq(suburbs.slug, suburb), eq(suburbs.isActive, true)) }),
  ]);

  if (!svc || !sub) notFound();

  // Must be a curated combo target — never render un-curated combinations.
  const target = await db.query.comboPageTargets.findFirst({
    where: and(
      eq(comboPageTargets.serviceId, svc.id),
      eq(comboPageTargets.suburbId, sub.id),
      eq(comboPageTargets.isActive, true)
    ),
  });
  if (!target) notFound();

  const salt = String(sub.id);
  const regionLabel = getRegionLabel(sub.region);

  // Suburb copy blocks so the page is not just a name swap.
  const [introBlocks, localBlocks, faqQuestions, faqAnswers] = await Promise.all([
    getCopyBlocks(sub.regionType, "intro"),
    getCopyBlocks(sub.regionType, "local-detail"),
    getCopyBlocks(sub.regionType, "faq-question"),
    getCopyBlocks(sub.regionType, "faq-answer"),
  ]);
  const intro = pickByHash(introBlocks, `${salt}:c-intro`, 1)[0] ?? null;
  const localDetail = pickByHash(localBlocks, `${salt}:c-local`, 1)[0] ?? null;

  const maxPairs = Math.min(faqQuestions.length, faqAnswers.length);
  const faqPairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < maxPairs; i++) {
    if (faqAnswers[i]) faqPairs.push({ question: faqQuestions[i], answer: faqAnswers[i]! });
  }
  const suburbFaqs = pickByHash(faqPairs, `${salt}:c-faq`, 3);

  // Local pricing via Phase 5.
  const price = await getSuburbPrice(svc.id, sub.id);
  const priceNote = price.price != null
    ? `${svc.name} in ${sub.name} from ${formatSuburbPrice(price.price)}`
    : undefined;

  const benefitsList = svc.benefits.map((b, idx) => {
    const icons = ["Sparkles", "Shield", "Clock", "Award"];
    return { iconName: icons[idx % icons.length], title: b.title, description: b.description || "" };
  });

  const processSteps = svc.whatsIncluded.map((w, idx) => ({
    step: `0${idx + 1}`,
    title: w.title,
    description: w.description || "",
  }));

  const galleryImages = svc.images.length > 0
    ? svc.images.map((img, idx) => ({ url: img.imageUrl, alt: `${svc.name} result ${idx + 1}` }))
    : [1, 2, 3, 4].map((num) => ({ url: `/${svc.slug}/photo${num}.jpg`, alt: `${svc.name} result ${num}` }));

  const typesList = svc.serviceTypes.map((t) => t.title);

  const testimonialsList = svc.testimonials.map((t) => ({
    name: t.author,
    location: `${sub.name}, QLD`,
    rating: t.rating,
    text: t.content,
    service: svc.name,
  }));

  const heroCopy = [
    localDetail ?? intro ?? "",
    `Our professional ${svc.name.toLowerCase()} team serves ${sub.name} and the surrounding ${regionLabel} area, with local pricing and fast, reliable service.`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <ServiceTemplate
      badge={`${sub.name} · ${regionLabel}`}
      title={`${svc.name} in ${sub.name}`}
      description={heroCopy}
      heroImage={svc.images[0]?.imageUrl || "/placeholder.svg"}
      heroImageAlt={svc.name}
      stats={[
        { label: "Brisbane Suburbs", value: 75, suffix: "+" },
        { label: "Years Experience", value: 15, suffix: "+" },
        { label: "Cleaning Services", value: 6, suffix: "+" },
      ]}
      benefitsTitle={`Why Choose Our ${svc.name} in ${sub.name}?`}
      benefitsDescription={`Professional results that extend the life of your ${svc.name.toLowerCase()} — trusted across ${regionLabel}.`}
      benefits={benefitsList}
      galleryTitle="Our Cleaning Results"
      galleryDescription={`See the remarkable difference professional ${svc.name.toLowerCase()} makes in ${sub.name}.`}
      galleryImages={galleryImages}
      processTitle="Our Systematic Cleaning Process"
      processDescription="A proven, systematic approach to ensure spotless, revitalized results every time."
      processSteps={processSteps}
      typesTitle={`Types of ${svc.name} We Masterfully Clean`}
      types={typesList}
      faqs={suburbFaqs.length > 0 ? suburbFaqs : undefined}
      ctaTitle={`Book ${svc.name} in ${sub.name}`}
      ctaDescription={`Get a free, no-obligation quote for ${svc.name.toLowerCase()} in ${sub.name} — fair pricing, fresh results.`}
      reviews={testimonialsList.length > 0 ? testimonialsList : undefined}
      priceNote={priceNote}
    />
  );
}
