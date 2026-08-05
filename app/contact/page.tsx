import type { Metadata } from "next";
import { HeaderWrapper } from "@/components/header-wrapper";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageSquare, FileText, ArrowRight, CheckCircle2, Shield, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getContentGroup } from "@/lib/site-content";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({ where: eq(staticPages.slug, "contact-us") });
  if (!page) return { title: "Contact Us" };
  return {
    title: page.metaTitle || "Contact Us",
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: page.canonicalUrl || undefined },
    robots: page.metaRobots || undefined,
    other: page.metaRobots ? { "x-robots-tag": page.metaRobots } : undefined,
    openGraph: { title: page.ogTitle || undefined, description: page.ogDescription || undefined, type: "website" },
  };
}

export default async function ContactPage() {
  const content = await getContentGroup('contact');
  const badgeText = content.contact_badge || "Available 7 Days a Week";
  const heroTitle = content.contact_hero_title || "Ready to Transform Your Fabrics?";
  const heroDesc = content.contact_hero_description || "Get in touch with Brisbane's most trusted fabric cleaning specialists.";

  return (
    <main className="min-h-screen bg-background">
      <HeaderWrapper />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <FadeIn>
              <span className="inline-flex items-center gap-1.5 bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-5">
                <CheckCircle2 className="h-3.5 w-3.5" /> {badgeText}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground mb-4 text-balance">{heroTitle}</h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 text-pretty font-body leading-relaxed">{heroDesc}</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-white rounded-xl border border-border shadow-sm">
                  <div className="text-lg md:text-xl font-heading-bold text-primary"><CountUp end={24} suffix="hr" /></div>
                  <div className="text-[10px] text-muted-foreground font-body">Response Time</div>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border border-border shadow-sm">
                  <div className="text-lg md:text-xl font-heading-bold text-primary"><CountUp end={15} suffix="+" /></div>
                  <div className="text-[10px] text-muted-foreground font-body">Brisbane Suburbs</div>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border border-border shadow-sm">
                  <div className="text-lg md:text-xl font-heading-bold text-primary"><CountUp end={6} suffix="+" /></div>
                  <div className="text-[10px] text-muted-foreground font-body">Cleaning Services</div>
                </div>
              </div>
              <StaggerContainer className="space-y-2">
                <StaggerItem className="flex items-center gap-2"><div className="w-8 h-8 bg-accent-tint rounded-full flex items-center justify-center"><Shield className="h-4 w-4 text-primary" /></div><span className="text-sm text-muted-foreground font-body">Locally Owned & Operated</span></StaggerItem>
                <StaggerItem className="flex items-center gap-2"><div className="w-8 h-8 bg-accent-tint rounded-full flex items-center justify-center"><Award className="h-4 w-4 text-primary" /></div><span className="text-sm text-muted-foreground font-body">15+ Years of Excellence</span></StaggerItem>
                <StaggerItem className="flex items-center gap-2"><div className="w-8 h-8 bg-accent-tint rounded-full flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-primary" /></div><span className="text-sm text-muted-foreground font-body">Same-Day Service Available</span></StaggerItem>
              </StaggerContainer>
            </FadeIn>
            <SlideIn direction="right">
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <Image src="/professional-cleaning-team-with-equipment-ready-to.jpg" alt="Cleaning Team" width={600} height={600} className="w-full h-auto" />
                <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-white/95 p-4 md:p-5 rounded-xl border border-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent-tint p-2.5 rounded-full flex-shrink-0"><Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" /></div>
                    <div><p className="text-[10px] md:text-xs text-muted-foreground font-body mb-0.5">Call us now for instant support</p><a href="tel:0430799567" className="text-sm md:text-base font-heading-bold text-primary hover:underline block">0430 799 567</a></div>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12">
            <StaggerItem>
              <a href="tel:0430799567">
                <div className="bg-white rounded-xl border border-border p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full group">
                  <div className="w-14 h-14 bg-accent-tint rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"><Phone className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-lg font-heading-bold text-foreground mb-2">Call Now</h3>
                  <p className="text-sm text-muted-foreground font-body mb-3">Speak directly with our team for immediate assistance</p>
                  <p className="text-primary font-heading text-sm mb-3">0430 799 567</p>
                  <span className="text-xs font-nav text-primary flex items-center justify-center gap-1">Call Us <ArrowRight className="h-3 w-3" /></span>
                </div>
              </a>
            </StaggerItem>
            <StaggerItem>
              <a href="mailto:support@fairandfreshcleaning.com.au">
                <div className="bg-white rounded-xl border border-border p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full group">
                  <div className="w-14 h-14 bg-accent-tint rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"><MessageSquare className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-lg font-heading-bold text-foreground mb-2">Message Us</h3>
                  <p className="text-sm text-muted-foreground font-body mb-3">Send us an email and we&apos;ll respond within 24 hours</p>
                  <p className="text-primary font-heading text-xs mb-3 break-all">support@fairandfreshcleaning.com.au</p>
                  <span className="text-xs font-nav text-primary flex items-center justify-center gap-1">Email Us <ArrowRight className="h-3 w-3" /></span>
                </div>
              </a>
            </StaggerItem>
            <StaggerItem>
              <Link href="/quote">
                <div className="bg-white rounded-xl border border-border p-7 text-center shadow-sm hover:shadow-md transition-shadow h-full group">
                  <div className="w-14 h-14 bg-accent-tint rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"><FileText className="h-7 w-7 text-primary" /></div>
                  <h3 className="text-lg font-heading-bold text-foreground mb-2">Get a Quote</h3>
                  <p className="text-sm text-muted-foreground font-body mb-3">Fill out our quick form for a free, no-obligation quote</p>
                  <p className="text-primary font-heading text-sm mb-3">Free Estimate</p>
                  <span className="text-xs font-nav text-primary flex items-center justify-center gap-1">Request Quote <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            </StaggerItem>
          </StaggerContainer>

          {/* Contact Info + Form */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <FadeIn>
                <h2 className="text-xl md:text-2xl font-heading-bold text-foreground mb-2">Get in Touch</h2>
                <p className="text-sm text-muted-foreground font-body mb-5">Have questions about our cleaning services, pricing, or availability? Drop us a message.</p>
              </FadeIn>
              <StaggerContainer className="space-y-4">
                <StaggerItem>
                  <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="h-5 w-5 text-primary" /></div>
                      <div><h3 className="text-sm font-heading text-foreground mb-0.5">Phone Support</h3><a href="tel:0430799567" className="text-sm text-primary font-heading hover:underline">0430 799 567</a><p className="text-[10px] text-muted-foreground font-body mt-0.5">Mon - Sun: 7:00 AM - 7:00 PM</p></div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="h-5 w-5 text-primary" /></div>
                      <div className="min-w-0 flex-1"><h3 className="text-sm font-heading text-foreground mb-0.5">Email Inquiries</h3><a href="mailto:support@fairandfreshcleaning.com.au" className="text-sm text-primary font-heading hover:underline break-all block">support@fairandfreshcleaning.com.au</a><p className="text-[10px] text-muted-foreground font-body mt-0.5">Average response time: &lt; 2 hours</p></div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="h-5 w-5 text-primary" /></div>
                      <div><h3 className="text-sm font-heading text-foreground mb-0.5">Service Coverage</h3><p className="text-sm text-foreground/90 font-body">Brisbane, Queensland</p><p className="text-[10px] text-muted-foreground font-body mt-0.5">And surrounding metropolitan areas</p></div>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
            <div className="lg:col-span-7">
              <SlideIn direction="up"><ContactForm /></SlideIn>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-heading-bold text-foreground mb-6">{content.contact_why_title || "Why Brisbane Trusts Us"}</h2>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="bg-white rounded-xl border border-border p-5 shadow-sm"><div className="text-2xl md:text-3xl font-heading-bold text-primary mb-1"><CountUp end={15} suffix="+" /></div><p className="text-xs text-muted-foreground font-body">Years Experience</p></div>
              <div className="bg-white rounded-xl border border-border p-5 shadow-sm"><div className="text-2xl md:text-3xl font-heading-bold text-primary mb-1"><CountUp end={75} suffix="+" /></div><p className="text-xs text-muted-foreground font-body">Brisbane Suburbs</p></div>
              <div className="bg-white rounded-xl border border-border p-5 shadow-sm"><div className="text-2xl md:text-3xl font-heading-bold text-primary mb-1"><CountUp end={6} suffix="+" /></div><p className="text-xs text-muted-foreground font-body">Cleaning Services</p></div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
