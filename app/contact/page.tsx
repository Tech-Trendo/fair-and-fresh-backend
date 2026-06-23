import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  FileText,
  ArrowRight,
  CheckCircle2,
  Shield,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, CountUp, ScaleIn } from "@/components/motion-wrapper";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { ContactForm } from "@/components/contact-form";

// Dynamically generate contact page metadata from staticPages table in DB
export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: eq(staticPages.slug, "contact-us"),
  });

  if (!page) {
    return {
      title: "Contact Us | Fair and Fresh Cleaning",
    };
  }

  return {
    title: page.metaTitle || "Contact Us | Fair and Fresh Cleaning",
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

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative py-8 md:py-8 lg:py-12 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Left Content */}
            <FadeIn>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
                <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" />
                <span>Available 7 Days a Week</span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 md:mb-6 text-balance">
                Ready to Transform Your Fabrics?
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 text-pretty leading-relaxed">
                Get in touch with Brisbane&apos;s most trusted fabric cleaning specialists. Whether you need a
                quick quote, expert advice, or want to book a service, we&apos;re here to help.
              </p>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="text-center p-3 md:p-4 bg-background rounded-lg border border-border">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                    <CountUp end={24} suffix="hr" />
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-background rounded-lg border border-border">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                    <CountUp end={2500} suffix="+" />
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">Happy Clients</div>
                </div>
                <div className="text-center p-3 md:p-4 bg-background rounded-lg border border-border col-span-2 md:col-span-1">
                  <div className="text-xl md:text-2xl font-bold text-primary mb-1">
                    <CountUp end={5} suffix="★" />
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">Rated Service</div>
                </div>
              </div>

              {/* Quick Features */}
              <StaggerContainer className="space-y-2 md:space-y-3">
                <StaggerItem className="flex items-center gap-2 md:gap-3">
                  <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                    <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground">
                    Fully Insured & Certified
                  </span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2 md:gap-3">
                  <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                    <Award className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground">15+ Years of Excellence</span>
                </StaggerItem>
                <StaggerItem className="flex items-center gap-2 md:gap-3">
                  <div className="bg-primary/10 p-1.5 md:p-2 rounded-full">
                    <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                  <span className="text-sm md:text-base text-muted-foreground">
                    Same-Day Service Available
                  </span>
                </StaggerItem>
              </StaggerContainer>
            </FadeIn>

            {/* Right Image */}
            <SlideIn direction="right" className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/professional-cleaning-team-with-equipment-ready-to.jpg"
                  alt="Fair and Fresh Cleaning Team"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                />
                {/* Overlay Card */}
                <ScaleIn className="absolute bottom-3 left-3 right-3 md:bottom-6 md:left-6 md:right-6 bg-background/95 backdrop-blur-sm p-3 md:p-6 rounded-xl border border-border shadow-lg">
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="bg-primary/10 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Phone className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] md:text-sm text-muted-foreground mb-0.5 md:mb-1">
                        Call us now for instant support
                      </p>
                      <a
                        href="tel:0430799567"
                        className="text-sm md:text-xl font-bold text-primary hover:underline block truncate"
                      >
                        0430 799 567
                      </a>
                    </div>
                  </div>
                </ScaleIn>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Main Action Buttons */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <StaggerContainer className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-12 md:mb-16">
              {/* Call Now */}
              <StaggerItem>
                <Card className="group border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl cursor-pointer h-full">
                  <a href="tel:0430799567">
                    <CardContent className="p-4 md:p-6 lg:p-8 text-center">
                      <div className="bg-primary/10 group-hover:bg-primary group-hover:scale-110 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-300">
                        <Phone className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">Call Now</h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 text-pretty">
                        Speak directly with our team for immediate assistance
                      </p>
                      <p className="text-primary font-semibold text-base md:text-lg mb-3 md:mb-4">
                        0430 799 567
                      </p>
                      <div className="flex items-center justify-center text-primary font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                        <span>Call Us</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </a>
                </Card>
              </StaggerItem>

              {/* Message Us */}
              <StaggerItem>
                <Card className="group border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl cursor-pointer h-full">
                  <a href="mailto:support@fairandfreshcleaning.com.au">
                    <CardContent className="p-4 md:p-6 lg:p-8 text-center">
                      <div className="bg-primary/10 group-hover:bg-primary group-hover:scale-110 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-300">
                        <MessageSquare className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">Message Us</h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 text-pretty">
                        Send us an email and we&apos;ll respond within 24 hours
                      </p>
                      <p className="text-primary font-semibold text-xs md:text-sm mb-3 md:mb-4 break-all px-2">
                        support@fairandfreshcleaning.com.au
                      </p>
                      <div className="flex items-center justify-center text-primary font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                        <span>Email Us</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </a>
                </Card>
              </StaggerItem>

              {/* Get a Quote */}
              <StaggerItem>
                <Card className="group border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-2xl cursor-pointer h-full">
                  <Link href="/quote">
                    <CardContent className="p-4 md:p-6 lg:p-8 text-center">
                      <div className="bg-primary/10 group-hover:bg-primary group-hover:scale-110 w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 transition-all duration-300">
                        <FileText className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 md:mb-3">
                        Get a Quote
                      </h3>
                      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4 text-pretty">
                        Fill out our quick form for a free, no-obligation quote
                      </p>
                      <p className="text-primary font-semibold text-base md:text-lg mb-3 md:mb-4">
                        Free Estimate
                      </p>
                      <div className="flex items-center justify-center text-primary font-medium text-sm md:text-base group-hover:gap-2 transition-all">
                        <span>Request Quote</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </StaggerItem>
            </StaggerContainer>

              {/* Contact Section with Form */}
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6">
                {/* Left Side: Contact info cards */}
                <div className="lg:col-span-5 space-y-4">
                  <FadeIn>
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-2">
                      Get in Touch
                    </h2>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed mb-4">
                      Have questions about our cleaning services, pricing, or availability? Drop us a message, and our team will get back to you as soon as possible.
                    </p>
                  </FadeIn>

                  <StaggerContainer className="space-y-4">
                    <StaggerItem>
                      <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4 md:p-5">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                              <Phone className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm mb-0.5">Phone Support</h3>
                              <a href="tel:0430799567" className="text-primary font-medium hover:underline text-xs md:text-sm">
                                0430 799 567
                              </a>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Mon - Sun: 7:00 AM - 7:00 PM</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>

                    <StaggerItem>
                      <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4 md:p-5">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                              <Mail className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-foreground text-sm mb-0.5">Email Inquiries</h3>
                              <a href="mailto:support@fairandfreshcleaning.com.au" className="text-primary font-medium hover:underline text-xs break-all block">
                                support@fairandfreshcleaning.com.au
                              </a>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Average response time: &lt; 2 hours</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>

                    <StaggerItem>
                      <Card className="border border-border/60 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4 md:p-5">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                              <MapPin className="h-4.5 w-4.5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground text-sm mb-0.5">Service Coverage</h3>
                              <p className="text-foreground/90 font-medium text-xs md:text-sm">Brisbane, Queensland</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">And surrounding metropolitan areas</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  </StaggerContainer>
                </div>

                {/* Right Side: Form */}
                <div className="lg:col-span-7">
                  <SlideIn direction="up">
                    <ContactForm />
                  </SlideIn>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <FadeIn className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Why Brisbane Trusts Us
            </h2>
            <div className="grid grid-cols-3 gap-4 md:gap-8 mt-8 md:mt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountUp end={2500} suffix="+" />
                </div>
                <p className="text-xs md:text-base text-muted-foreground">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountUp end={15} suffix="+" />
                </div>
                <p className="text-xs md:text-base text-muted-foreground">Years Experience</p>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  <CountUp end={98} suffix="%" />
                </div>
                <p className="text-xs md:text-base text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
