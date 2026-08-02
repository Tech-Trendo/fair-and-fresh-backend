import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Clock,
  Award,
  Sparkles,
  CheckCircle,
  Phone,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { staticPages, beforeAfterImages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { BeforeAfterSlider } from "@/components/before-after-slider";
import { getContentGroup } from "@/lib/site-content";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: eq(staticPages.slug, "services"),
  });

  if (!page) {
    return {
      title: "Our Professional Services",
    };
  }

  return {
    title: page.metaTitle || "Our Professional Services",
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: page.canonicalUrl || undefined },
    robots: page.metaRobots || undefined,
    other: page.metaRobots ? { "x-robots-tag": page.metaRobots } : undefined,
    openGraph: {
      title: page.ogTitle || undefined,
      description: page.ogDescription || undefined,
      type: "website",
    },
  };
}

const benefits = [
  { icon: Shield, title: "Eco-Friendly Products", description: "Safe for your family and pets" },
  { icon: Award, title: "Certified Professionals", description: "Trained and experienced technicians" },
  { icon: Clock, title: "Fast Service", description: "Quick turnaround times" },
  { icon: Sparkles, title: "Satisfaction Guaranteed", description: "100% satisfaction or we return" },
];

export default async function ServicesPage() {
  const servicesContent = await getContentGroup('services');

  const badgeText = servicesContent.services_badge || "Professional Fabric Cleaning Services";
  const heroTitle = servicesContent.services_hero_title || "Transform Your Space with Expert Care";
  const heroDesc = servicesContent.services_hero_description || "Brisbane's most trusted fabric cleaning specialists. From carpets to curtains, we bring new life to every surface.";
  const whyTitle = servicesContent.services_why_title || "Why Choose Us?";
  const whyDesc = servicesContent.services_why_description || "We're committed to delivering exceptional results with every cleaning service.";
  const processTitle = servicesContent.services_process_title || "Our Cleaning Process";
  const processDesc = servicesContent.services_process_description || "A systematic approach that ensures consistent, high-quality results every time.";
  const ctaTitle = servicesContent.services_cta_title || "Ready to Experience the Difference?";
  const ctaDesc = servicesContent.services_cta_description || "Get a free, no-obligation quote today and discover why Brisbane trusts us.";

  const dbServices = await db.query.services.findMany({
    with: { images: { limit: 1 }, whatsIncluded: true },
    orderBy: (services, { asc }) => [asc(services.sortOrder), asc(services.name)],
  });

  const dbBeforeAfter = await db
    .select()
    .from(beforeAfterImages)
    .orderBy(asc(beforeAfterImages.sortOrder), asc(beforeAfterImages.createdAt));

  const beforeAfterImagesData = dbBeforeAfter.map((img) => ({
    image_url: img.imageUrl,
    caption: img.caption || undefined,
  }));

  const services = dbServices.map((s) => ({
    title: s.name,
    description: s.shortDescription || s.longDescription || "",
    features: s.whatsIncluded.map((w) => w.title),
    image: s.images[0]?.imageUrl || "/placeholder.svg",
    slug: s.slug,
  }));

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-5">
              {badgeText}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground mb-5 text-balance leading-tight">
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty font-body">
              {heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote">
                <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground px-8 font-nav text-base">
                  Get Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="tel:0430799567">
                <Button size="lg" variant="outline" className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-primary-foreground px-8 font-nav text-base bg-transparent">
                  <Phone className="mr-2 h-4 w-4" /> 0430 799 567
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Service Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">Our Specialized Services</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">Each service is tailored to deliver exceptional results with care and precision</p>
          </FadeIn>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <StaggerItem key={service.slug}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col border border-border">
                  <Link href={`/services/${service.slug}`} className="block">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image src={service.image || "/placeholder.svg"} alt={service.title} width={400} height={250} className="w-full h-full object-cover" />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-heading-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      <Link href={`/services/${service.slug}`}>{service.title}</Link>
                    </h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4 flex-grow">{service.description}</p>
                    <div className="space-y-2 mb-4">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-xs text-muted-foreground font-body">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`/services/${service.slug}`}>
                      <Button className="w-full rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground font-nav text-sm">
                        Learn More <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">{whyTitle}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">{whyDesc}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={benefit.title}>
                <div className="bg-white rounded-xl border border-border p-6 text-center h-full shadow-sm">
                  <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-heading-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">{processTitle}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">{processDesc}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Assessment & Quote", description: "We evaluate your cleaning needs and provide a transparent, upfront quote." },
              { step: "02", title: "Professional Cleaning", description: "Our certified technicians use eco-friendly products and advanced techniques." },
              { step: "03", title: "Quality Check", description: "We inspect our work to ensure it meets our high standards before completion." },
            ].map((process, index) => (
              <StaggerItem key={process.step}>
                <div className="text-center">
                  <div className="bg-primary text-primary-foreground text-xl font-heading-bold w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">{process.step}</div>
                  <h3 className="text-base font-heading-bold text-foreground mb-2">{process.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{process.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <BeforeAfterSlider images={beforeAfterImagesData} />

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-xl px-8 py-14 md:px-16 md:py-20 text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-primary-foreground mb-4 text-balance">{ctaTitle}</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto font-body mb-8">{ctaDesc}</p>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote">
                <Button size="lg" className="rounded-full bg-white text-red-600 hover:bg-white/90 font-nav text-base px-8">
                  Get Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:0430799567">
                <Button size="lg" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/10 font-nav text-base px-8 bg-transparent">
                  <Phone className="mr-2 h-4 w-4" /> 0430 799 567
                </Button>
              </a>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
