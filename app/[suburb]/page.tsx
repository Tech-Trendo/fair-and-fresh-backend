import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { suburbs, suburbCopyBlocks } from "@/lib/schema";
import { eq, and, ne, asc } from "drizzle-orm";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Footer } from "@/components/footer";
import { CtaSection } from "@/components/cta-section";
import { SuburbMap } from "@/components/suburb-map";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  Home,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { getRegionLabel, pickByHash } from "@/lib/suburbs";
import { buildSuburbJsonLd } from "@/lib/schema-suburb";

interface PageProps {
  params: Promise<{ suburb: string }>;
}

export const dynamicParams = true; // new suburbs (added via dashboard) render without a redeploy
export const revalidate = 86400; // ISR â€” regenerate once per day

export async function generateStaticParams() {
  const activeSuburbs = await db
    .select({ slug: suburbs.slug })
    .from(suburbs)
    .where(eq(suburbs.isActive, true));
  return activeSuburbs.map((s) => ({ suburb: s.slug }));
}

const SITE_URL = 'https://www.fairandfreshcleaning.com.au';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { suburb } = await params;
  const row = await db.query.suburbs.findFirst({
    where: eq(suburbs.slug, suburb),
  });

  if (!row || !row.isActive) {
    return { title: "Suburb Not Found" };
  }

  const regionLabel = getRegionLabel(row.region);
  const title = `Fabric & Carpet Cleaning in ${row.name} | Fair & Fresh Cleaning`;
  const description =
    row.metaDescription ??
    `Professional fabric, carpet, mattress, rug and upholstery cleaning in ${row.name}, ${regionLabel}. Fair pricing, thorough results.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/${row.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/fair-fresh-logo.svg", alt: row.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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

export default async function SuburbPage({ params }: PageProps) {
  const { suburb } = await params;

  const row = await db.query.suburbs.findFirst({
    where: and(eq(suburbs.slug, suburb), eq(suburbs.isActive, true)),
    with: {
      suburbTestimonials: {
        with: { review: { with: { service: true } } },
      },
    },
  });

  if (!row) notFound();

  const salt = String(row.id);
  const regionLabel = getRegionLabel(row.region);

  // Deterministic copy-block selection (stable across rebuilds/revalidations).
  const [introBlocks, localDetailBlocks, faqQuestions, faqAnswers] = await Promise.all([
    getCopyBlocks(row.regionType, "intro"),
    getCopyBlocks(row.regionType, "local-detail"),
    getCopyBlocks(row.regionType, "faq-question"),
    getCopyBlocks(row.regionType, "faq-answer"),
  ]);

  const intro =
    pickByHash(introBlocks, `${salt}:intro`, 1)[0] ??
    `Professional fabric cleaning in ${row.name} â€” fair pricing, fresh results, thorough inspections on every job.`;
  const localDetail = pickByHash(localDetailBlocks, `${salt}:local`, 1)[0] ?? null;

  // Pair each FAQ question with its matching answer by index (seed data must insert
  // question/answer pairs in matching order), then deterministically pick 3 pairs.
  const maxPairs = Math.min(faqQuestions.length, faqAnswers.length);
  const faqPairs: { question: string; answer: string }[] = [];
  for (let i = 0; i < maxPairs; i++) {
    if (faqAnswers[i]) faqPairs.push({ question: faqQuestions[i], answer: faqAnswers[i]! });
  }
  const faqs = pickByHash(faqPairs, `${salt}:faq`, 3);

  // Services grid â€” all services, ordered by site sort order.
  const allServices = await db.query.services.findMany({
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
    with: { images: { limit: 1 } },
  });

  // Suburb-specific testimonials, with honest fallback to general reviews (<2 linked = not enough).
  const linkedReviews = row.suburbTestimonials
    .map((st) => st.review)
    .filter((r): r is NonNullable<typeof r> => r !== null);

  let displayReviews = linkedReviews;
  if (linkedReviews.length < 2) {
    displayReviews = await db.query.testimonials.findMany({
      limit: 3,
      orderBy: (t, { desc }) => [desc(t.rating)],
      with: { service: true },
    });
  }

  // Nearby suburbs cross-linking (same region, deterministic subset).
  const nearbySuburbs = await db
    .select({ slug: suburbs.slug, name: suburbs.name })
    .from(suburbs)
    .where(
      and(
        eq(suburbs.region, row.region),
        eq(suburbs.isActive, true),
        ne(suburbs.id, row.id)
      )
    )
    .orderBy(asc(suburbs.name));
  const nearbyPick = pickByHash(nearbySuburbs, `${salt}:nearby`, 4);

  // Local detail strip â€” only fields that are actually populated. No placeholder text.
  const localFacts = [
    row.travelTimeMins
      ? { icon: Clock, label: "Travel time", value: `Around ${row.travelTimeMins} minutes from our team` }
      : null,
    row.localLandmark ? { icon: MapPin, label: "Local landmark", value: row.localLandmark } : null,
    row.postcode ? { icon: Mail, label: "Postcode", value: row.postcode } : null,
  ].filter((f): f is { icon: typeof Clock; label: string; value: string } => f !== null);

  const mapEnabled = Boolean(
    row.lat && row.lng && process.env.GEOAPIFY_API_KEY
  );

  // Phase 6 â€” JSON-LD (AggregateRating only included when 3+ suburb-linked reviews exist).
  const jsonLd = buildSuburbJsonLd({
    name: row.name,
    slug: row.slug,
    region: row.region,
    regionLabel,
    postcode: row.postcode,
    lat: row.lat,
    lng: row.lng,
    description: row.metaDescription ?? intro,
    services: allServices.map((s) => ({ name: s.name, slug: s.slug })),
    faqs,
    linkedReviews: linkedReviews.map((r) => ({ rating: r.rating })),
  });

  return (
    <>
      <HeaderWrapper />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-background">
        {/* Breadcrumbs: Home > Region > Suburb */}
        <nav aria-label="Breadcrumb" className="bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-nav text-muted-foreground">
              <li>
                <Link href="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="w-3.5 h-3.5" /> Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li className="text-muted-foreground">{regionLabel}</li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li aria-current="page" className="text-foreground">
                {row.name}
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="py-14 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-3xl">
              <span className="inline-flex items-center bg-accent-tint text-primary text-xs font-nav px-3 py-1 rounded-full mb-4">
                <MapPin className="w-3 h-3 mr-1.5" />
                {regionLabel}
                {row.postcode ? ` Â· Postcode ${row.postcode}` : ""}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading-bold text-foreground mb-4 leading-tight text-balance">
                Fabric &amp; Carpet Cleaning in {row.name}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-body leading-relaxed mb-6 text-pretty">
                We service {row.name} and surrounding {regionLabel}. {intro}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground px-8 font-nav text-base"
                >
                  <Link href="/quote">
                    Get Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-primary-foreground px-8 font-nav text-base bg-transparent"
                >
                  <a href="tel:0430799567">
                    <Phone className="mr-2 h-4 w-4" /> Call 0430 799 567
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs text-muted-foreground font-body">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Upfront Pricing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Eco-Friendly Products
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" /> Same-Day Service
                </span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Local-detail copy block (regionType pool) */}
        {localDetail && (
          <section className="py-14 md:py-16 bg-white border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn className="max-w-4xl mx-auto text-center">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-heading-bold text-foreground mb-4">
                  Caring for Fabrics in {row.name}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed">
                  {localDetail}
                </p>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Local detail strip â€” only populated fields */}
        {localFacts.length > 0 && (
          <section className="py-10 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {localFacts.map((f) => (
                  <StaggerItem key={f.label}>
                    <div className="flex items-center gap-3 bg-background rounded-xl border border-border p-4">
                      <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center shrink-0">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground font-body">{f.label}</div>
                        <div className="text-sm font-heading text-foreground truncate">{f.value}</div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </section>
        )}

        {/* Services grid */}
        <section className="py-16 md:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="mb-10">
              <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground">
                Our Cleaning Services in {row.name}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-body mt-2 max-w-2xl">
                Professional fabric care across {regionLabel} â€” book any service in {row.name} today.
              </p>
            </FadeIn>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allServices.map((service) => (
                <StaggerItem key={service.id}>
                  <Link href={`/services/${service.slug}`} className="block h-full group">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col border border-border">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <Image
                          src={service.images[0]?.imageUrl || "/placeholder.svg"}
                          alt={service.name}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-base font-heading-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                        {service.shortDescription && (
                          <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2 flex-grow">
                            {service.shortDescription}
                          </p>
                        )}
                        <div className="mt-3 flex items-center gap-1 text-xs font-nav text-primary group-hover:gap-2 transition-all">
                          Book in {row.name} <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Testimonials â€” suburb-specific when 2+ linked, otherwise honest general fallback */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground">
                {linkedReviews.length >= 2 ? `Reviews from ${row.name}` : "What Our Customers Say"}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground font-body mt-2">
                Hear from customers we&apos;ve helped across Brisbane and Queensland
              </p>
            </FadeIn>
            {displayReviews.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground font-body">
                No reviews yet â€” be the first to share your experience.
              </p>
            ) : (
              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {displayReviews.map((review, i) => (
                  <StaggerItem key={review.id ?? i}>
                    <div className="bg-background rounded-xl border border-border p-6 h-full flex flex-col">
                      <div className="flex mb-3">
                        {[...Array(Math.max(1, review.rating || 5))].map((_, s) => (
                          <Star key={s} className="h-4 w-4 text-primary fill-primary" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground font-body leading-relaxed flex-grow mb-4">
                        &ldquo;{review.content}&rdquo;
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-9 h-9 rounded-full bg-accent-tint flex items-center justify-center text-primary font-heading-bold text-sm shrink-0">
                          {review.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-heading text-foreground truncate">{review.author}</div>
                          <div className="text-xs text-muted-foreground font-body truncate">
                            {review.service?.name ?? "Fair & Fresh Cleaning"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* FAQ â€” regionType pool, deterministic selection of 3 */}
        {faqs.length > 0 && (
          <section className="py-16 md:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-3 gap-10">
                <FadeIn>
                  <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-3">
                    Cleaning Questions for {row.name}
                  </h2>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    Answers to the questions we hear most from homes and businesses in {regionLabel}.
                  </p>
                </FadeIn>
                <FadeIn delay={0.1} className="lg:col-span-2">
                  <Accordion
                    type="single"
                    collapsible
                    className="bg-white rounded-xl border border-border px-6 divide-y divide-border"
                  >
                    {faqs.map((faq, i) => (
                      <AccordionItem key={i} value={`faq-${i}`} className="border-0">
                        <AccordionTrigger className="text-sm font-heading text-foreground hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground font-body leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </FadeIn>
              </div>
            </div>
          </section>
        )}

        {/* Static map â€” only renders when coordinates AND API key exist */}
        {mapEnabled && (
          <section className="py-16 md:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <FadeIn>
                  <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-3">
                    Serving {row.name} &amp; Surrounding Areas
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground font-body leading-relaxed mb-5">
                    We bring professional fabric cleaning to homes and businesses in {row.name} and
                    the surrounding {regionLabel} region.
                  </p>
                </FadeIn>
                <FadeIn delay={0.1}>
                  <SuburbMap suburb={{ lat: row.lat, lng: row.lng, name: row.name, region: row.region }} />
                </FadeIn>
              </div>
            </div>
          </section>
        )}

        {/* Nearby suburbs cross-linking */}
        {nearbyPick.length > 0 && (
          <section className="py-12 bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeIn>
                <h2 className="text-xl md:text-2xl font-heading-bold text-foreground mb-5">
                  Also Servicing Nearby Areas
                </h2>
                <div className="flex flex-wrap gap-2.5">
                  {nearbyPick.map((n) => (
                    <Link
                      key={n.slug}
                      href={`/${n.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-nav text-primary bg-accent-tint hover:bg-primary hover:text-primary-foreground transition-colors px-3.5 py-1.5 rounded-full"
                    >
                      <MapPin className="w-3 h-3" /> {n.name}
                    </Link>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
