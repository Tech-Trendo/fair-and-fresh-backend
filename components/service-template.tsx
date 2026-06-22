"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Reviews, Review } from "@/components/reviews";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle, Phone, ArrowRight, Shield, Clock, Sparkles, Award, Star, LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, CountUp } from "@/components/motion-wrapper";

interface Benefit {
  iconName: string;
  title: string;
  description: string;
}

const IconRenderer = ({ iconName, className }: { iconName: string; className?: string }) => {
  const Icon = (lucideIcons as any)[iconName] || lucideIcons.Sparkles;
  return <Icon className={className} />;
};

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
  stats: {
    label: string;
    value: number;
    suffix?: string;
    iconName?: string;
  }[];
  benefitsTitle: string;
  benefitsDescription: string;
  benefits: Benefit[];
  galleryTitle: string;
  galleryDescription: string;
  galleryImages: {
    url: string;
    alt: string;
  }[];
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

const circles = [
  { size: 180, top: "10%", left: "20%", duration: "6s" },
  { size: 250, top: "40%", left: "70%", duration: "8s" },
  { size: 150, top: "75%", left: "30%", duration: "7s" },
  { size: 300, top: "20%", left: "80%", duration: "9s" },
  { size: 220, top: "60%", left: "10%", duration: "6.5s" },
  { size: 200, top: "50%", left: "50%", duration: "7.5s" },
];


import * as lucideIcons from "lucide-react";

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
    <main className="min-h-screen bg-background selection:bg-primary/20">
      <Header />

      {/* ─── Hero Section ─── */}
      <section className="relative pt-8 pb-20 lg:pt-16 xl:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-br from-background via-secondary/15 to-background">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div>
              <FadeIn y={20}>
                <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium backdrop-blur-md">
                  {badge}
                </Badge>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground mb-6 lg:mb-8 text-balance leading-[1.1] tracking-tight">
                  {title}
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-8 lg:mb-10 text-pretty leading-relaxed max-w-xl">
                  {description}
                </p>
              </FadeIn>

              {/* Enhanced Stats Cards */}
              <StaggerContainer className="grid grid-cols-3 gap-3 md:gap-4 mb-10">
                {stats.map((stat, idx) => (
                  <StaggerItem key={idx}>
                    <Card className="border-0 bg-white/50 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 group">
                      <CardContent className="p-3 md:p-6 text-center">
                        <div className="text-2xl md:text-3xl font-bold text-primary mb-1 inline-flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                          <CountUp end={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="text-[10px] md:text-xs lg:text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-4 lg:gap-5">
                <Link href="/quote" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-8 lg:px-10 py-6 lg:py-7 text-base lg:text-lg font-bold shadow-[0_10px_30px_-10px_rgba(var(--primary),0.5)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    Get Free Quote
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="tel:0430799567" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground px-8 lg:px-10 py-6 lg:py-7 text-base lg:text-lg font-bold transition-all duration-300 group bg-white/50 backdrop-blur-md"
                  >
                    <Phone className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Call Now
                  </Button>
                </Link>
              </FadeIn>
            </div>

            {/* Right Visual Area */}
            <div className="relative">
              <ScaleIn delay={0.2}>
                <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] ring-1 ring-white/20 group">
                  <Image
                    src={heroImage}
                    alt={heroImageAlt}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </ScaleIn>

              {/* Premium Floating Badge */}
              <FadeIn delay={0.6} y={0} className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 lg:-left-12">
                <div className="bg-white/80 backdrop-blur-2xl p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-[2rem] shadow-2xl border border-white flex items-center gap-3 md:gap-5 hover:scale-105 transition-transform duration-300">
                  <div className="bg-primary/10 p-2 md:p-4 rounded-xl md:rounded-2xl">
                    <Shield className="h-6 w-6 md:h-10 md:w-10 text-primary" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-base md:text-xl text-foreground whitespace-nowrap">Fully Insured</div>
                    <div className="text-[10px] md:text-sm font-medium text-muted-foreground whitespace-nowrap">& Quality Certified</div>
                  </div>
                </div>
              </FadeIn>

              {/* Decorative Circle */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Benefits Section ─── */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
                {benefitsTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {benefitsDescription}
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <Card className="h-full border-0 bg-secondary/30 backdrop-blur-sm shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group rounded-3xl overflow-hidden">
                  <CardContent className="p-8 text-center flex flex-col h-full">
                    <div className="bg-primary/10 p-5 rounded-2xl w-20 h-20 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                      <IconRenderer iconName={benefit.iconName} className="h-10 w-10 text-primary group-hover:text-inherit" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed flex-grow">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Gallery Section ─── */}
      <section className="py-24 lg:py-32 bg-secondary/15 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                {galleryTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground">
                {galleryDescription}
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {galleryImages.map((image, index) => (
              <StaggerItem key={index}>
                <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-lg group">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-6 left-6 text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-semibold text-lg">{image.alt}</p>
                  </div>
                  {image.url === "/placeholder.svg" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-[2px]">
                      <p className="text-muted-foreground text-sm italic">Image coming soon</p>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Process Section ─── */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                {processTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-xl text-muted-foreground">
                {processDescription}
              </p>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Visual connector line (hidden on mobile) */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-1 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 -z-10 rounded-full" />

            {processSteps.map((step, index) => (
              <FadeIn key={index} delay={index * 0.15} y={40}>
                <div className="text-center group">
                  <div className="bg-primary text-primary-foreground text-3xl font-serif font-bold w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-[0_15px_30px_-10px_rgba(var(--primary),0.6)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Types/Checklist Section ─── */}
      <section className="py-24 lg:py-32 bg-secondary/15">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <FadeIn>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-16 text-center leading-tight">
                {typesTitle}
              </h2>
            </FadeIn>
            <StaggerContainer className="grid md:grid-cols-2 gap-6">
              {types.map((type, index) => (
                <StaggerItem key={index}>
                  <div className="flex items-center gap-5 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white hover:shadow-md hover:scale-[1.02] transition-all duration-300">
                    <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                      <CheckCircle className="h-7 w-7 text-primary" />
                    </div>
                    <span className="text-foreground text-lg font-semibold">{type}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ─── */}
      <Reviews reviews={reviews} />

      {/* ─── FAQs Section ─── */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <FadeIn className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1.5 bg-primary/20 mx-auto rounded-full" />
            </FadeIn>

            <FadeIn delay={0.2}>
              <Accordion type="single" collapsible className="space-y-6">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="border border-secondary/50 rounded-[1.5rem] px-8 py-2 bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden group data-[state=open]:bg-white data-[state=open]:shadow-xl"
                  >
                    <AccordionTrigger className="text-left font-serif font-bold text-xl hover:text-primary transition-colors py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-lg leading-relaxed pb-8 pt-2">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 lg:py-36 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary pointer-events-none" />
        {/* Animated pattern for CTA */}
        <div className="absolute inset-0 opacity-10 blur-sm">
          {circles.map((circle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: circle.size,
                height: circle.size,
                top: circle.top,
                left: circle.left,
                animationDelay: `${i * 0.5}s`,
                animationDuration: circle.duration,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-white leading-tight">
                {ctaTitle}
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-2xl mb-12 text-white/90 font-medium">
                {ctaDescription}
              </p>
            </FadeIn>
            <FadeIn delay={0.4} className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-bold px-12 py-8 text-xl shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="tel:0430799567">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white hover:text-primary font-bold px-12 py-8 text-xl transition-all duration-300 group bg-white/10 backdrop-blur-md w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-6 w-6 group-hover:animate-bounce" />
                  Call Now
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

