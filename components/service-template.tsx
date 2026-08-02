"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reviews, Review } from "@/components/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Phone, ArrowRight, Shield, Clock, Sparkles, Award, Star, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";

interface Benefit {
  iconName: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ServiceTemplateProps {
  badge: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  stats: { label: string; value: number; suffix?: string; iconName?: string }[];
  benefitsTitle: string;
  benefitsDescription: string;
  benefits: Benefit[];
  galleryTitle: string;
  galleryDescription: string;
  galleryImages: { url: string; alt: string }[];
  processTitle: string;
  processDescription: string;
  processSteps: ProcessStep[];
  typesTitle: string;
  types: string[];
  faqs: FAQ[];
  ctaTitle: string;
  ctaDescription: string;
  reviews?: Review[];
}

import * as lucideIcons from "lucide-react";

const IconRenderer = ({ iconName, className }: { iconName: string; className?: string }) => {
  const Icon = (lucideIcons as any)[iconName] || lucideIcons.Sparkles;
  return <Icon className={className} />;
};

export function ServiceTemplate({
  badge,
  title,
  description,
  heroImage,
  heroImageAlt,
  stats,
  benefitsTitle,
  benefitsDescription,
  benefits,
  galleryTitle,
  galleryDescription,
  galleryImages,
  processTitle,
  processDescription,
  processSteps,
  typesTitle,
  types,
  faqs,
  ctaTitle,
  ctaDescription,
  reviews,
}: ServiceTemplateProps) {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <FadeIn>
                <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-5">{badge}</span>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground mb-5 text-balance leading-tight">{title}</h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-base md:text-lg text-muted-foreground mb-8 text-pretty font-body leading-relaxed">{description}</p>
              </FadeIn>
              <StaggerContainer className="grid grid-cols-3 gap-3 mb-8">
                {stats.map((stat, idx) => (
                  <StaggerItem key={idx}>
                    <div className="bg-white rounded-xl border border-border p-4 text-center shadow-sm">
                      <div className="text-lg md:text-xl font-heading-bold text-primary"><CountUp end={stat.value} suffix={stat.suffix} /></div>
                      <div className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <FadeIn delay={0.3} className="flex flex-col sm:flex-row gap-3">
                <Link href="/quote">
                  <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground px-8 font-nav text-base">
                    Get Free Quote <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <a href="tel:0430799567">
                  <Button size="lg" variant="outline" className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-primary-foreground px-8 font-nav text-base bg-transparent">
                    <Phone className="mr-2 h-4 w-4" /> Call Now
                  </Button>
                </a>
              </FadeIn>
            </div>
            <FadeIn delay={0.2}>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <Image src={heroImage} alt={heroImageAlt} width={600} height={500} className="w-full h-auto object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">{benefitsTitle}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">{benefitsDescription}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-xl border border-border p-6 shadow-sm h-full">
                  <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center mb-4">
                    <IconRenderer iconName={benefit.iconName} className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-base font-heading-bold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{benefit.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">{galleryTitle}</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">{galleryDescription}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {galleryImages.map((image, index) => (
              <StaggerItem key={index}>
                <div className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-border">
                  <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
                  {image.url === "/placeholder.svg" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background"><p className="text-xs text-muted-foreground font-body">Image coming soon</p></div>
                  )}
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
            <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">{processDescription}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <div className="bg-primary text-primary-foreground text-lg font-heading-bold w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">{step.step}</div>
                  <h3 className="text-base font-heading-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-body">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Types */}
      {types.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">{typesTitle}</h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {types.map((type, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white rounded-xl border border-border p-5 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0"><CheckCircle className="h-5 w-5 text-primary" /></div>
                    <span className="text-sm font-heading text-foreground">{type}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <Reviews reviews={reviews} />

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">Frequently Asked Questions</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`} className="border border-border rounded-xl px-6 py-1 bg-white shadow-sm data-[state=open]:shadow-md transition-shadow">
                  <AccordionTrigger className="text-left font-heading text-sm text-foreground hover:text-primary transition-colors py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground font-body leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-xl px-8 py-14 md:px-16 md:py-20 text-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-primary-foreground mb-4">{ctaTitle}</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto font-body mb-8">{ctaDescription}</p>
            </FadeIn>
            <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/quote"><Button size="lg" className="rounded-full bg-white text-red-600 hover:bg-white/90 font-nav text-base px-8">Get Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <a href="tel:0430799567"><Button size="lg" variant="outline" className="rounded-full border-white/40 text-white hover:bg-white/10 font-nav text-base px-8 bg-transparent"><Phone className="mr-2 h-4 w-4" /> Call Now</Button></a>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
