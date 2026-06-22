import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sofa,
  Car,
  Bed,
  Home,
  Sparkles,
  Shield,
  Clock,
  Award,
  CheckCircle,
  Phone,
  Shirt,
  Droplets,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";

// Map slugs to appropriate Lucide icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "carpet-cleaning": Home,
  "mattress-cleaning": Bed,
  "rug-cleaning": Sparkles,
  "upholstery-cleaning": Sofa,
  "curtain-cleaning": Shirt,
  "car-seat-cleaning": Car,
  "car-detailing": Car,
  "bond-cleaning": Home,
  "lawn-mowing": Scissors,
  "flood-damage-restoration": Droplets,
};

function getServiceIcon(slug: string) {
  return iconMap[slug] || HelpCircle;
}

const benefits = [
  {
    icon: Shield,
    title: "Eco-Friendly Products",
    description: "Safe for your family and pets",
  },
  {
    icon: Award,
    title: "Certified Professionals",
    description: "Trained and experienced technicians",
  },
  {
    icon: Clock,
    title: "Fast Service",
    description: "Quick turnaround times",
  },
  {
    icon: Sparkles,
    title: "Satisfaction Guaranteed",
    description: "100% satisfaction or we return",
  },
];

import { Scissors } from "lucide-react";

export default async function ServicesPage() {
  // Query all services along with their relations dynamically
  const dbServices = await db.query.services.findMany({
    with: {
      images: { limit: 1 },
      whatsIncluded: true,
    },
    orderBy: (services, { asc }) => [asc(services.name)],
  });

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

      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary text-primary-foreground border-0 animate-fade-in px-4 py-2 text-sm">
              Professional Fabric Cleaning Services
            </Badge>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 animate-fade-in animation-delay-200 text-balance leading-tight">
              Transform Your Space with Expert Care
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 animate-fade-in animation-delay-400 text-pretty max-w-3xl mx-auto leading-relaxed">
              Brisbane&apos;s most trusted fabric cleaning specialists. From carpets to curtains, we bring new
              life to every surface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-600">
              <Link href="/quote">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="tel:0430799567">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold transition-all duration-300 bg-transparent"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  0430 799 567
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
              Our Specialized Services
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Each service is tailored to deliver exceptional results with care and precision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {services.map((service, index) => {
              const IconComponent = getServiceIcon(service.slug);
              return (
                <Card
                  key={service.title}
                  className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group animate-fade-in-up overflow-hidden bg-white"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        width={400}
                        height={300}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 text-pretty leading-relaxed">
                        {service.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        {service.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <span className="text-sm text-foreground font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Link href={`/services/${service.slug}`}>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 group-hover:shadow-lg font-semibold py-6">
                          Learn More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in text-balance">
              Why Choose Fair and Fresh?
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in animation-delay-200 text-pretty">
              We&apos;re committed to delivering exceptional results with every cleaning service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in text-balance">
              Our Cleaning Process
            </h2>
            <p className="text-lg text-muted-foreground animate-fade-in animation-delay-200 text-pretty">
              A systematic approach that ensures consistent, high-quality results every time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Assessment & Quote",
                description: "We evaluate your cleaning needs and provide a transparent, upfront quote.",
              },
              {
                step: "02",
                title: "Professional Cleaning",
                description: "Our certified technicians use eco-friendly products and advanced techniques.",
              },
              {
                step: "03",
                title: "Quality Check",
                description: "We inspect our work to ensure it meets our high standards before completion.",
              },
            ].map((process, index) => (
              <div
                key={process.step}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-primary text-primary-foreground text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4">{process.title}</h3>
                <p className="text-muted-foreground text-pretty">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-balance">
              Ready to Experience the Difference?
            </h2>
            <p className="text-xl mb-10 opacity-95 text-pretty leading-relaxed">
              Get a free, no-obligation quote today and discover why Brisbane trusts Fair and Fresh Cleaning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="tel:0430799567">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-10 py-7 text-lg transition-all duration-300 hover:shadow-2xl shadow-xl"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call: 0430 799 567
                </Button>
              </Link>
              <Link href="/quote">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-10 py-7 text-lg transition-all duration-300 bg-transparent"
                >
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
