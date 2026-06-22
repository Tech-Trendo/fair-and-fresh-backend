import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  CheckCircle2,
  Award,
  Users,
  Heart,
  Sparkles,
  Shield,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq } from "drizzle-orm";

// Dynamically generate about page metadata from staticPages table in DB
export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: eq(staticPages.slug, "about-us"),
  });

  if (!page) {
    return {
      title: "About Us | Fair and Fresh Cleaning",
    };
  }

  return {
    title: page.metaTitle || "About Us | Fair and Fresh Cleaning",
    description: page.metaDescription || undefined,
    keywords: page.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: page.ogTitle || undefined,
      description: page.ogDescription || undefined,
      type: "website",
    },
  };
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <FadeIn className="space-y-4 md:space-y-6">
              <Badge variant="default" className="text-xs md:text-sm px-4 md:px-6 py-1.5 md:py-2">
                Brisbane&apos;s Trusted Fabric Care Experts
              </Badge>

              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-normal text-balance leading-tight">
                Where expertise meets
                <span className="block text-primary mt-2">pristine perfection</span>
              </h1>

              <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                For over 15 years, we&apos;ve been transforming Brisbane homes and businesses with
                professional fabric cleaning that goes beyond surface deep.
              </p>

              <div className="grid grid-cols-3 gap-4 md:gap-6 lg:gap-8 py-6 md:py-8 max-w-2xl mx-auto">
                <div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
                    <CountUp end={2500} suffix="+" />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Happy Clients</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
                    <CountUp end={15} suffix="+" />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
                    <CountUp end={98} suffix="%" />
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/quote">
                  <Button size="lg" className="group w-full sm:w-auto">
                    Get Your Free Quote
                    <CheckCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Explore Our Services
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            <SlideIn direction="left">
              <div className="relative aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="/professional-carpet-cleaning.png"
                  alt="Professional cleaning team at work"
                  fill
                  className="object-cover"
                />
              </div>
            </SlideIn>
            <SlideIn direction="left">
              <div className="space-y-3 md:space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2 md:mb-3 text-xs">
                    Who We Are
                  </Badge>
                  <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mb-3 md:mb-4 leading-tight">
                    Brisbane&apos;s fabric cleaning experts
                  </h2>
                </div>
                <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                  <p>
                    Fair & Fresh Cleaning has been serving Brisbane families and businesses for over 15 years,
                    specializing in comprehensive fabric care. From carpets and mattresses to upholstery and
                    curtains, we bring new life to every fabric we touch.
                  </p>
                  <p>
                    What sets us apart is our unwavering commitment to quality, reliability, and customer
                    satisfaction. We treat every home and business as if it were our own, ensuring meticulous
                    attention to detail.
                  </p>
                </div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {/* Mission */}
            <StaggerItem>
              <Card className="border-primary/20 h-full">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl md:text-2xl font-normal mb-2">Our Mission</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        To provide Brisbane with exceptional fabric cleaning services that restore, protect,
                        and extend the life of your valued possessions using eco-friendly products and
                        advanced techniques.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            {/* Vision */}
            <StaggerItem>
              <Card className="border-accent/20 h-full">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="font-serif text-xl md:text-2xl font-normal mb-2">Our Vision</h2>
                      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                        To be recognized as Brisbane&apos;s most trusted and innovative fabric cleaning
                        company, setting the standard for quality, customer service, and environmental
                        responsibility.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <FadeIn>
              <Badge variant="outline" className="mb-2 md:mb-3 text-xs">
                Our Values
              </Badge>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mb-3">
                What drives us every day
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                Our core values guide everything we do, from the products we use to the service we provide
              </p>
            </FadeIn>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Award,
                title: "Excellence",
                description:
                  "We strive for perfection in every cleaning job, using the best techniques available.",
                color: "primary",
              },
              {
                icon: Heart,
                title: "Care",
                description: "We treat your fabrics and home with the same care we'd give our own.",
                color: "accent",
              },
              {
                icon: Shield,
                title: "Trust",
                description:
                  "Building lasting relationships through honest communication and reliable service.",
                color: "primary",
              },
              {
                icon: TrendingUp,
                title: "Innovation",
                description: "Continuously improving our methods and adopting eco-friendly solutions.",
                color: "accent",
              },
            ].map((value, index) => (
              <StaggerItem key={index}>
                <Card className="text-center group hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full">
                  <CardContent className="p-4 md:p-6">
                    <div
                      className={`mb-3 md:mb-4 inline-flex items-center justify-center w-12 h-12 bg-${value.color}/10 rounded-lg group-hover:scale-110 transition-transform`}
                    >
                      <value.icon className={`h-6 w-6 text-${value.color}`} />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <FadeIn>
              <Badge
                variant="secondary"
                className="mb-2 md:mb-3 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 text-xs"
              >
                Why Choose Us
              </Badge>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mb-3">
                The Fair & Fresh difference
              </h2>
            </FadeIn>
          </div>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Star,
                title: "15+ Years Experience",
                description: "Over a decade of expertise in fabric cleaning across Brisbane",
              },
              {
                icon: Shield,
                title: "Fully Insured",
                description: "Complete peace of mind with comprehensive insurance coverage",
              },
              {
                icon: Clock,
                title: "7 Days Service",
                description: "Flexible scheduling including weekends",
              },
              {
                icon: CheckCircle2,
                title: "Satisfaction Guaranteed",
                description: "We're not happy until you're thrilled with the results",
              },
              {
                icon: Sparkles,
                title: "Eco-Friendly",
                description: "Safe, non-toxic cleaning solutions",
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Highly trained professionals",
              },
            ].map((reason, index) => (
              <StaggerItem
                key={index}
                className="text-center p-4 rounded-lg bg-primary-foreground/5 hover:bg-primary-foreground/10 transition-colors h-full"
              >
                <div className="mb-3 inline-flex items-center justify-center w-10 h-10 bg-primary-foreground/10 rounded-lg">
                  <reason.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="text-base md:text-lg font-semibold mb-1">{reason.title}</h3>
                <p className="text-xs md:text-sm text-primary-foreground/80 leading-relaxed">
                  {reason.description}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <FadeIn>
              <Badge variant="outline" className="mb-2 md:mb-3 text-xs">
                Our Expertise
              </Badge>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mb-2">
                Comprehensive fabric care
              </h2>
            </FadeIn>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { title: "Carpet Cleaning", image: "/professional-carpet-cleaning.png" },
              { title: "Bond Cleaning", image: "/bond-cleaning-hero-image.png" },
              { title: "Mattress Cleaning", image: "/mattress-deep-cleaning-service.jpg" },
              { title: "Lawn Mowing", image: "/lawn-mowing-hero-image.jpg" },
              { title: "Rugs Cleaning", image: "/professional-rug-cleaning-service.jpg" },
              { title: "Upholstery Cleaning", image: "/upholstery-cleaning-photo.jpg" },
              { title: "Curtain Cleaning", image: "/curtain-cleaning-photo.jpg" },
              { title: "Car Detailing", image: "/car-detailing-hero-image.jpg" },
              {
                title: "Flood Damage Restoration",
                image: "/flood-damage-restoration-water-extraction-emergenc.jpg",
              },
            ].map((service, index) => (
              <StaggerItem key={index}>
                <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative w-full h-[240px] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white drop-shadow-lg">{service.title}</h3>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-8 md:py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <FadeIn className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-normal mb-3 md:mb-4">
              Ready to experience the difference?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
              Contact us today for a free quote and discover why Brisbane trusts us with their most valued
              fabrics
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <Link href="/quote">
                <Button size="lg" className="group w-full sm:w-auto">
                  Get Free Quote
                  <CheckCircle2 className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Link href="tel:0430799567">
                <Button variant="outline" size="lg" className="group w-full sm:w-auto bg-transparent">
                  <Phone className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Call 0430 799 567
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 text-muted-foreground text-xs md:text-sm">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>support@fairandfreshcleaning.com.au</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>7 Days a Week</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </main>
  );
}
