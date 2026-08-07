import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, CheckCircle2, Award, Users, Heart, Sparkles, Shield, Clock, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
import { getContentGroup } from "@/lib/site-content";

// Revalidated on a schedule so dashboard SEO edits appear without a full rebuild.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: or(eq(staticPages.slug, "about-us"), eq(staticPages.id, "about")),
  });
  if (!page) return { title: "About Us" };
  return {
    title: page.metaTitle || "About Us",
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: page.canonicalUrl || undefined },
    robots: page.metaRobots || undefined,
    other: page.metaRobots ? { "x-robots-tag": page.metaRobots } : undefined,
    openGraph: { title: page.ogTitle || undefined, description: page.ogDescription || undefined, type: "website" },
  };
}

export default async function AboutPage() {
  const content = await getContentGroup('about');
  const settings = await getContentGroup('site_settings');

  const badge = content.about_badge || "Brisbane's Trusted Fabric Care Experts";
  const heroTitle = content.about_hero_title || `Where expertise meets <span class="block text-primary mt-2">pristine perfection</span>`;
  const heroDesc = content.about_hero_description || "For over 15 years, we've been transforming Brisbane homes and businesses with professional fabric cleaning that goes beyond surface deep.";
  const section1Title = content.about_section1_title || "Brisbane's fabric cleaning experts";
  const section1Desc = content.about_section1_description || "Serving Brisbane families and businesses for over 15 years, specializing in comprehensive fabric care.\n\nWhat sets us apart is our unwavering commitment to quality, reliability, and customer satisfaction.";
  const missionTitle = content.about_mission_title || "Our Mission";
  const missionDesc = content.about_mission_description || "To provide Brisbane with exceptional fabric cleaning services that restore, protect, and extend the life of your valued possessions.";
  const visionTitle = content.about_vision_title || "Our Vision";
  const visionDesc = content.about_vision_description || "To be recognized as Brisbane's most trusted and innovative fabric cleaning company, setting the standard for quality and service.";
  const valuesTitle = content.about_values_title || "What drives us every day";
  const valuesDesc = content.about_values_description || "Our core values guide everything we do, from the products we use to the service we provide";
  const ctaTitle = content.about_cta_title || "Ready to experience the difference?";
  const ctaDesc = content.about_cta_description || "Contact us today for a free quote and discover why Brisbane trusts us with their most valued fabrics";

  const sitePhone = settings.site_phone || "0430 799 567";
  const siteEmail = settings.site_email || "support@fairandfreshcleaning.com.au";
  const section1Paragraphs = section1Desc.split('\n\n').filter(Boolean);

  // Fetch all services dynamically (same source as the API) with their first image
  const dbServices = await db.query.services.findMany({
    with: {
      images: {
        limit: 1,
      },
    },
    orderBy: (services, { asc }) => [asc(services.sortOrder), asc(services.name)],
  });

  const expertiseServices = dbServices.map((s) => ({
    title: s.name,
    slug: s.slug,
    image: s.images[0]?.imageUrl || "/placeholder.svg",
  }));

  return (
    <main className="min-h-screen bg-background">
      <HeaderWrapper />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-5">{badge}</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground leading-tight mb-5 text-balance" dangerouslySetInnerHTML={{ __html: heroTitle }} />
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto font-body">{heroDesc}</p>
            <div className="grid grid-cols-3 gap-6 py-8 max-w-md mx-auto">
              <div><div className="text-2xl md:text-3xl font-heading-bold text-primary"><CountUp end={15} suffix="+" /></div><div className="text-xs text-muted-foreground font-body">Years Experience</div></div>
              <div><div className="text-2xl md:text-3xl font-heading-bold text-primary"><CountUp end={75} suffix="+" /></div><div className="text-xs text-muted-foreground font-body">Brisbane Suburbs</div></div>
              <div><div className="text-2xl md:text-3xl font-heading-bold text-primary"><CountUp end={6} suffix="+" /></div><div className="text-xs text-muted-foreground font-body">Cleaning Services</div></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote"><Button size="lg" className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground font-nav text-base">Get Your Free Quote</Button></Link>
              <Link href="/services"><Button variant="outline" size="lg" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary-foreground font-nav text-base bg-transparent">Explore Our Services</Button></Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 1: Image + Intro */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <SlideIn direction="left">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm">
                <Image src="/professional-carpet-cleaning.png" alt="Professional cleaning team at work" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </SlideIn>
            <SlideIn direction="left">
              <div>
                <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-3 py-1 rounded-full mb-3">Who We Are</span>
                <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-4">{section1Title}</h2>
                <div className="space-y-3 text-sm text-muted-foreground font-body leading-relaxed">
                  {section1Paragraphs.map((p, i) => (<p key={i}>{p}</p>))}
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <StaggerItem>
              <div className="bg-white rounded-xl border border-border p-7 shadow-sm h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><Award className="h-6 w-6 text-primary" /></div>
                  <div><h2 className="text-lg font-heading-bold text-foreground mb-2">{missionTitle}</h2><p className="text-sm text-muted-foreground font-body leading-relaxed">{missionDesc}</p></div>
                </div>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-white rounded-xl border border-border p-7 shadow-sm h-full">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><Sparkles className="h-6 w-6 text-primary" /></div>
                  <div><h2 className="text-lg font-heading-bold text-foreground mb-2">{visionTitle}</h2><p className="text-sm text-muted-foreground font-body leading-relaxed">{visionDesc}</p></div>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-3 py-1 rounded-full mb-3">Our Values</span>
            <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-3">{valuesTitle}</h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-body">{valuesDesc}</p>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {[
              { icon: Award, title: "Excellence", description: "We strive for perfection in every cleaning job, using the best techniques available." },
              { icon: Heart, title: "Care", description: "We treat your fabrics and home with the same care we'd give our own." },
              { icon: Shield, title: "Trust", description: "Building lasting relationships through honest communication and reliable service." },
              { icon: TrendingUp, title: "Innovation", description: "Continuously improving our methods and adopting eco-friendly solutions." },
            ].map((value, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-xl border border-border p-6 text-center shadow-sm h-full">
                  <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center mx-auto mb-4"><value.icon className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-base font-heading-bold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dark Difference Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="inline-block bg-primary-foreground/10 text-primary-foreground text-xs font-nav px-3 py-1 rounded-full border border-primary-foreground/20 mb-3">Why Choose Us</span>
            <h2 className="text-2xl md:text-3xl font-heading-bold mb-3">The Difference</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { icon: Star, title: "15+ Years Experience", description: "Over a decade of experience in fabric cleaning across Brisbane" },
              { icon: Shield, title: "Transparent Pricing", description: "Honest quotes with no hidden fees" },
              { icon: Clock, title: "7 Days Service", description: "Flexible scheduling including weekends" },
              { icon: CheckCircle2, title: "Thorough Inspections", description: "Post-job inspection on every service" },
              { icon: Sparkles, title: "Eco-Friendly", description: "Safe, non-toxic cleaning solutions for your family" },
              { icon: Users, title: "Local Team", description: "Locally owned Brisbane business dedicated to quality" },
            ].map((reason, index) => (
              <StaggerItem key={index}>
                <div className="text-center p-5 rounded-xl bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors h-full">
                  <div className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center mx-auto mb-3"><reason.icon className="h-5 w-5 text-primary-foreground" /></div>
                  <h3 className="text-base font-heading-bold mb-1">{reason.title}</h3>
                  <p className="text-xs text-primary-foreground/80 font-body leading-relaxed">{reason.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Expertise Grid */}
      {expertiseServices.length > 0 && (
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-10">
            <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-3 py-1 rounded-full mb-3">Our Expertise</span>
            <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-2">Comprehensive Fabric Care</h2>
          </FadeIn>
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {expertiseServices.map((service, index) => (
              <StaggerItem key={`${service.slug}-${index}`}>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border group h-full">
                  <div className="relative w-full h-[200px] overflow-hidden">
                    <Image src={service.image} alt={service.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4"><h3 className="text-sm font-heading-bold text-white">{service.title}</h3></div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-3">{ctaTitle}</h2>
            <p className="text-sm text-muted-foreground font-body mb-6 max-w-xl mx-auto">{ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-5">
              <Link href="/quote"><Button size="lg" className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground font-nav text-base">Get Free Quote</Button></Link>
              <Link href={`tel:${sitePhone.replace(/\s/g, '')}`}><Button variant="outline" size="lg" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary-foreground font-nav text-base bg-transparent"><Phone className="mr-2 h-4 w-4" /> Call {sitePhone}</Button></Link>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-5 text-xs text-muted-foreground font-body">
              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-primary" /> {siteEmail}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-primary" /> 7 Days a Week</span>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
