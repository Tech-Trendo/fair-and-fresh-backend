"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, SlideIn } from "@/components/motion-wrapper";

export default function BrisbanePage() {
  const serviceAreas = [
    {
      region: "Brisbane City & Inner Suburbs",
      suburbs: [
        "Brisbane CBD",
        "Fortitude Valley",
        "South Brisbane",
        "West End",
        "New Farm",
        "Paddington",
        "Milton",
        "Toowong",
        "Indooroopilly",
        "Taringa",
        "St Lucia",
        "Woolloongabba",
        "Kangaroo Point",
        "Teneriffe",
        "Newstead",
      ],
    },
    {
      region: "Brisbane North",
      suburbs: [
        "Chermside",
        "Aspley",
        "Kedron",
        "Nundah",
        "Stafford",
        "Everton Park",
        "Mitchelton",
        "Keperra",
        "Arana Hills",
        "Albany Creek",
        "Strathpine",
        "Petrie",
        "Redcliffe",
        "North Lakes",
        "Mango Hill",
      ],
    },
    {
      region: "Brisbane South",
      suburbs: [
        "Sunnybank",
        "Calamvale",
        "Stretton",
        "Parkinson",
        "Algester",
        "Acacia Ridge",
        "Runcorn",
        "Eight Mile Plains",
        "Macgregor",
        "Robertson",
        "Upper Mount Gravatt",
        "Mount Gravatt",
        "Holland Park",
        "Greenslopes",
        "Coorparoo",
      ],
    },
    {
      region: "Brisbane East",
      suburbs: [
        "Carindale",
        "Carina",
        "Camp Hill",
        "Cannon Hill",
        "Morningside",
        "Balmoral",
        "Bulimba",
        "Hawthorne",
        "Norman Park",
        "Seven Hills",
        "Tingalpa",
        "Wakerley",
        "Gumdale",
        "Ransome",
        "Chandler",
      ],
    },
    {
      region: "Brisbane West",
      suburbs: [
        "Kenmore",
        "Chapel Hill",
        "Fig Tree Pocket",
        "Jindalee",
        "Mount Ommaney",
        "Jamboree Heights",
        "Middle Park",
        "Sumner",
        "Riverhills",
        "Bellbowrie",
        "Moggill",
        "Pullenvale",
        "Brookfield",
        "Anstead",
        "Karana Downs",
      ],
    },
    {
      region: "Gold Coast",
      suburbs: [
        "Surfers Paradise",
        "Broadbeach",
        "Southport",
        "Robina",
        "Burleigh Heads",
        "Coolangatta",
        "Palm Beach",
        "Currumbin",
        "Mermaid Beach",
        "Miami",
        "Varsity Lakes",
        "Mudgeeraba",
        "Nerang",
        "Coomera",
        "Helensvale",
      ],
    },
    {
      region: "Sunshine Coast & Moreton Bay",
      suburbs: [
        "Caloundra",
        "Mooloolaba",
        "Maroochydore",
        "Noosa",
        "Kawana",
        "Caboolture",
        "Morayfield",
        "Narangba",
        "Burpengary",
        "Deception Bay",
        "Bribie Island",
        "Sandstone Point",
        "Beachmere",
        "Ningi",
        "Bellara",
      ],
    },
    {
      region: "Ipswich & Logan",
      suburbs: [
        "Ipswich CBD",
        "Springfield",
        "Springfield Lakes",
        "Redbank",
        "Goodna",
        "Logan Central",
        "Springwood",
        "Underwood",
        "Shailer Park",
        "Loganholme",
        "Browns Plains",
        "Forest Lake",
        "Richlands",
        "Darra",
        "Oxley",
      ],
    },
  ];

  const whyChooseUs = [
    {
      title: "Local Brisbane Experts",
      description:
        "Born and bred in Brisbane, we understand the unique cleaning challenges of Queensland's climate and lifestyle.",
      icon: MapPin,
    },
    {
      title: "Fast Response Times",
      description:
        "Same-day service available across most Brisbane suburbs. We're never more than 30 minutes away.",
      icon: Clock,
    },
    {
      title: "Queensland's Trusted Choice",
      description: "Over 2,500 satisfied customers across Brisbane, Gold Coast, and surrounding areas.",
      icon: Star,
    },
    {
      title: "All Areas Covered",
      description: "From the CBD to the coast, we service all Brisbane suburbs and surrounding regions.",
      icon: CheckCircle2,
    },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <FadeIn className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 bg-primary text-white">Proudly Serving Brisbane & Queensland</Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 text-balance">
                Brisbane&apos;s Most Trusted Fabric Cleaning Service
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
                Professional carpet, mattress, upholstery, and rug cleaning services across Brisbane, Gold
                Coast, Sunshine Coast, and all Queensland regions. Local experts delivering exceptional
                results since 2009.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-white w-full sm:w-auto"
                >
                  <Link href="/quote">
                    Get Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  <a href="tel:0430799567">
                    <Phone className="mr-2 h-5 w-5" />
                    Call 0430 799 567
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <FadeIn>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Why Brisbane Chooses Fair & Fresh
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                  We&apos;re not just another cleaning company - we&apos;re your local Brisbane fabric care
                  specialists
                </p>
              </FadeIn>
            </div>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <StaggerItem key={index}>
                  <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full">
                    <item.icon className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Service Areas Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <FadeIn>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                  Areas We Service Across Brisbane & Queensland
                </h2>
                <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
                  Fair & Fresh Cleaning proudly serves homes and businesses throughout Brisbane, Gold Coast,
                  Sunshine Coast, Ipswich, Logan, and surrounding Queensland regions. No matter where you are,
                  we&apos;re here to help.
                </p>
              </FadeIn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {serviceAreas.map((area, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50 bg-gradient-to-br from-white to-primary/5"
                >
                  {/* Decorative gradient overlay */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative z-10">
                    {/* Header with icon and title */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {area.region}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1">
                            {area.suburbs.length} suburbs covered
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mb-4" />

                    {/* Suburbs grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {area.suburbs.map((suburb, subIndex) => (
                        <div
                          key={subIndex}
                          className="flex items-center gap-2 p-2 rounded-md bg-white/50 hover:bg-white transition-colors group/suburb"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/60 group-hover/suburb:bg-primary transition-colors" />
                          <span className="text-xs font-medium text-foreground/80 group-hover/suburb:text-foreground transition-colors">
                            {suburb}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer with CTA */}
                    <div className="mt-4 pt-4 border-t border-primary/10">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="w-full text-primary hover:text-primary hover:bg-primary/10 group/btn"
                      >
                        <Link href="/quote">
                          Book Service in {area.region.split(" ")[0]}
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <FadeIn className="mt-12 text-center">
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Don&apos;t see your suburb listed? We service many more areas across Queensland!
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <a href="tel:0430799567">
                  <Phone className="mr-2 h-5 w-5" />
                  Call to Check Your Area
                </a>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <FadeIn className="max-w-4xl mx-auto prose prose-lg">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                Professional Fabric Cleaning Services Throughout Brisbane & Queensland
              </h2>

              <div className="space-y-6 text-muted-foreground">
                <p>
                  Fair & Fresh Cleaning has been Brisbane&apos;s trusted choice for professional fabric
                  cleaning services for over 15 years. We specialize in carpet cleaning, mattress cleaning,
                  upholstery cleaning, rug cleaning, curtain cleaning, car seat cleaning, and flood damage
                  restoration across all Brisbane suburbs, Gold Coast, Sunshine Coast, and throughout
                  Queensland.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  Serving All Brisbane Regions
                </h3>
                <p>
                  Our mobile cleaning teams service every corner of Brisbane, from the bustling CBD to the
                  peaceful suburbs. Whether you&apos;re in Brisbane North (Chermside, Aspley, North Lakes),
                  Brisbane South (Sunnybank, Mount Gravatt, Calamvale), Brisbane East (Carindale, Bulimba,
                  Tingalpa), or Brisbane West (Kenmore, Indooroopilly, Jindalee), we&apos;re ready to deliver
                  exceptional cleaning results to your doorstep.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  Gold Coast & Sunshine Coast Coverage
                </h3>
                <p>
                  Beyond Brisbane, we proudly extend our services to the beautiful Gold Coast region,
                  including Surfers Paradise, Broadbeach, Burleigh Heads, and Coolangatta. We also service the
                  Sunshine Coast, covering Caloundra, Mooloolaba, Maroochydore, and Noosa. Our Queensland-wide
                  coverage ensures that wherever you are, you have access to premium fabric cleaning services.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  Why Choose Local Brisbane Cleaners?
                </h3>
                <p>
                  As a locally owned and operated Brisbane business, we understand the unique challenges that
                  Queensland&apos;s subtropical climate presents for fabric care. High humidity, dust,
                  allergens, and the occasional flood require specialized cleaning techniques and equipment.
                  Our team is trained to handle Brisbane&apos;s specific environmental conditions, ensuring
                  your carpets, mattresses, and upholstery receive the care they need to stay fresh, clean,
                  and healthy.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  Same-Day Service Available
                </h3>
                <p>
                  We know that life in Brisbane moves fast. That&apos;s why we offer same-day cleaning
                  services across most Brisbane suburbs. Whether you need emergency flood restoration,
                  last-minute carpet cleaning before guests arrive, or urgent mattress sanitization, our rapid
                  response team is ready to help. Call us at{" "}
                  <a href="tel:0430799567" className="text-primary hover:underline font-semibold">
                    0430 799 567
                  </a>{" "}
                  to check availability in your area.
                </p>

                <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">
                  Eco-Friendly Cleaning for Queensland Families
                </h3>
                <p>
                  We&apos;re committed to protecting Brisbane&apos;s beautiful environment and your
                  family&apos;s health. All our cleaning products are eco-friendly, non-toxic, and safe for
                  children and pets. We use advanced cleaning technology that minimizes water usage while
                  maximizing cleaning power – perfect for Brisbane&apos;s water-conscious households.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container mx-auto px-4">
            <FadeIn className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Ready to Experience Brisbane&apos;s Best Fabric Cleaning?
              </h2>
              <p className="text-base md:text-lg mb-8 opacity-90">
                Join over 2,500 satisfied customers across Brisbane and Queensland. Get your free quote today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  <Link href="/quote">
                    Get Free Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto bg-transparent"
                >
                  <a href="tel:0430799567">
                    <Phone className="mr-2 h-5 w-5" />
                    0430 799 567
                  </a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
