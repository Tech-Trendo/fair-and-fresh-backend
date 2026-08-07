"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ServiceAreaMap } from "@/components/service-area-map";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, CheckCircle2, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { CtaSection } from "@/components/cta-section";

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");

// Display names on this page that map to differently-slugged seeded suburbs.
// Empty string = no hub page exists yet -> render as plain text (no broken link).
const areaSlugOverrides: Record<string, string> = {
  "Ipswich CBD": "ipswich",
  Noosa: "noosa-heads",
};

const getSuburbHref = (name: string): string | null => {
  if (name in areaSlugOverrides) {
    return areaSlugOverrides[name] ? `/${areaSlugOverrides[name]}` : null;
  }
  return `/${slugify(name)}`;
};

export default function BrisbanePage() {
  const serviceAreas = [
    { region: "Brisbane City & Inner Suburbs", suburbs: ["Brisbane CBD", "Fortitude Valley", "South Brisbane", "West End", "New Farm", "Paddington", "Milton", "Toowong", "Indooroopilly", "Taringa", "St Lucia", "Woolloongabba", "Kangaroo Point", "Teneriffe", "Newstead"] },
    { region: "Brisbane North", suburbs: ["Chermside", "Aspley", "Kedron", "Nundah", "Stafford", "Everton Park", "Mitchelton", "Keperra", "Arana Hills", "Albany Creek", "Strathpine", "Petrie", "Redcliffe", "North Lakes", "Mango Hill"] },
    { region: "Brisbane South", suburbs: ["Sunnybank", "Calamvale", "Stretton", "Parkinson", "Algester", "Acacia Ridge", "Runcorn", "Eight Mile Plains", "Macgregor", "Robertson", "Upper Mount Gravatt", "Mount Gravatt", "Holland Park", "Greenslopes", "Coorparoo"] },
    { region: "Brisbane East", suburbs: ["Carindale", "Carina", "Camp Hill", "Cannon Hill", "Morningside", "Balmoral", "Bulimba", "Hawthorne", "Norman Park", "Seven Hills", "Tingalpa", "Wakerley", "Gumdale", "Ransome", "Chandler"] },
    { region: "Brisbane West", suburbs: ["Kenmore", "Chapel Hill", "Fig Tree Pocket", "Jindalee", "Mount Ommaney", "Jamboree Heights", "Middle Park", "Sumner", "Riverhills", "Bellbowrie", "Moggill", "Pullenvale", "Brookfield", "Anstead", "Karana Downs"] },
    { region: "Gold Coast", suburbs: ["Surfers Paradise", "Broadbeach", "Southport", "Robina", "Burleigh Heads", "Coolangatta", "Palm Beach", "Currumbin", "Mermaid Beach", "Miami", "Varsity Lakes", "Mudgeeraba", "Nerang", "Coomera", "Helensvale"] },
    { region: "Sunshine Coast & Moreton Bay", suburbs: ["Caloundra", "Mooloolaba", "Maroochydore", "Noosa", "Kawana", "Caboolture", "Morayfield", "Narangba", "Burpengary", "Deception Bay", "Bribie Island", "Sandstone Point", "Beachmere", "Ningi", "Bellara"] },
    { region: "Ipswich & Logan", suburbs: ["Ipswich CBD", "Springfield", "Springfield Lakes", "Redbank", "Goodna", "Logan Central", "Springwood", "Underwood", "Shailer Park", "Loganholme", "Browns Plains", "Forest Lake", "Richlands", "Darra", "Oxley"] },
  ];

  const whyChooseUs = [
    { title: "Local Brisbane Experts", description: "Born and bred in Brisbane, we understand the unique cleaning challenges of Queensland's climate and lifestyle.", icon: MapPin },
    { title: "Fast Response Times", description: "Same-day service available across most Brisbane suburbs. We're never more than 30 minutes away.", icon: Clock },
    { title: "Upfront Pricing", description: "Honest quotes with no hidden fees, so you know exactly what to expect.", icon: Star },
    { title: "All Areas Covered", description: "From the CBD to the coast, we service all Brisbane suburbs and surrounding regions.", icon: CheckCircle2 },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-4xl mx-auto text-center">
              <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-5">
                Proudly Serving Brisbane & Queensland
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground mb-5 text-balance">
                Brisbane&apos;s Most Trusted Fabric Cleaning Service
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty font-body">
                Professional carpet, mattress, upholstery, and rug cleaning services across Brisbane, Gold Coast, Sunshine Coast, and all Queensland regions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground px-8 font-nav text-base">
                  <Link href="/quote">Get Free Quote <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full border-accent text-accent hover:bg-accent hover:text-primary-foreground px-8 font-nav text-base bg-transparent">
                  <a href="tel:0430799567"><Phone className="mr-2 h-4 w-4" /> Call 0430 799 567</a>
                </Button>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">Why Brisbane Chooses Us</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto font-body">We&apos;re not just another cleaning company â€” we&apos;re your local Brisbane fabric care specialists</p>
            </FadeIn>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {whyChooseUs.map((item, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm h-full">
                    <div className="w-12 h-12 bg-accent-tint rounded-lg flex items-center justify-center mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-base font-heading-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">{item.description}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3">Areas We Service Across Brisbane & Queensland</h2>
              <p className="text-base text-muted-foreground max-w-3xl mx-auto font-body">Proudly serving homes and businesses throughout Brisbane, Gold Coast, Sunshine Coast, Ipswich, Logan, and surrounding Queensland regions.</p>
            </FadeIn>

            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceAreas.map((area, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white rounded-xl border border-border p-6 shadow-sm h-full">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-base font-heading-bold text-foreground">{area.region}</h3>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">{area.suburbs.length} suburbs covered</p>
                        </div>
                      </div>
                      <span className="bg-accent-tint text-primary text-[10px] font-nav px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {area.suburbs.map((suburb, subIndex) => (
                        <div key={subIndex} className="flex items-center gap-1.5 py-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                          {(() => {
                            const href = getSuburbHref(suburb);
                            return href ? (
                              <Link
                                href={href}
                                className="text-xs text-muted-foreground font-body hover:text-primary transition-colors"
                              >
                                {suburb}
                              </Link>
                            ) : (
                              <span className="text-xs text-muted-foreground font-body">{suburb}</span>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-border">
                      <Link href="/quote" className="text-xs font-nav text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                        Book Service in {area.region.split(" ")[0]} <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn className="mt-10 text-center">
              <p className="text-sm text-muted-foreground font-body mb-5">Don&apos;t see your suburb listed? We service many more areas across Queensland!</p>
              <Button asChild size="lg" className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground font-nav">
                <a href="tel:0430799567"><Phone className="mr-2 h-4 w-4" /> Call to Check Your Area</a>
              </Button>
            </FadeIn>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-heading-bold text-foreground mb-6">Professional Fabric Cleaning Services Throughout Brisbane & Queensland</h2>
              <div className="space-y-5 text-sm text-muted-foreground font-body leading-relaxed">
                <p>We have been Brisbane&apos;s trusted choice for professional fabric cleaning services for over 15 years. We specialize in carpet cleaning, mattress cleaning, upholstery cleaning, rug cleaning, curtain cleaning, car seat cleaning, and flood damage restoration across all Brisbane suburbs, Gold Coast, Sunshine Coast, and throughout Queensland.</p>
                <h3 className="text-lg font-heading-bold text-foreground mt-8 mb-3">Why Choose Local Brisbane Cleaners?</h3>
                <p>As a locally owned and operated Brisbane business, we understand the unique challenges that Queensland&apos;s subtropical climate presents for fabric care. Our team is trained to handle Brisbane&apos;s specific environmental conditions, ensuring your carpets, mattresses, and upholstery receive the care they need.</p>
                <h3 className="text-lg font-heading-bold text-foreground mt-8 mb-3">Same-Day Service Available</h3>
                <p>We offer same-day cleaning services across most Brisbane suburbs. Call us at <a href="tel:0430799567" className="text-primary hover:underline font-heading">0430 799 567</a> to check availability in your area.</p>
                <h3 className="text-lg font-heading-bold text-foreground mt-8 mb-3">Eco-Friendly Cleaning</h3>
                <p>All our cleaning products are eco-friendly, non-toxic, and safe for children and pets. We use advanced cleaning technology that minimizes water usage while maximizing cleaning power.</p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Service Area Google Map */}
        <ServiceAreaMap />

        {/* CTA */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
