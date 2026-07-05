"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sofa, Car, Bed, Home, Shirt, Sparkles, Droplets, Scissors, HelpCircle, Brush, Trash2, Wind, ShieldCheck, Leaf, Utensils, Key, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { CategoryTabs } from "@/components/category-tabs";

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

const lucideIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Sofa,
  Bed,
  Car,
  Shirt,
  Sparkles,
  Droplets,
  Scissors,
  HelpCircle,
  Brush,
  Trash2,
  Wind,
  ShieldCheck,
  Leaf,
  Utensils,
  Key,
  Sun
};

function getServiceIcon(slug: string, customIcon?: string) {
  if (customIcon && lucideIconMap[customIcon]) {
    return lucideIconMap[customIcon];
  }
  return iconMap[slug] || HelpCircle;
}

export interface ServiceData {
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  shortDescription?: string;
  category?: { id: string; title: string; slug: string }[];
}

export function Services({
  services,
  categories = [],
}: {
  services: ServiceData[];
  categories?: { id: string; title: string; slug: string }[];
}) {
  return (
    <section id="services" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-balance">
              Our Professional Cleaning Services
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto text-pretty">
              We specialize in fabric cleaning with state-of-the-art equipment and eco-friendly solutions. Every
              service comes with our satisfaction guarantee.
            </p>
          </FadeIn>
        </div>

        <CategoryTabs categories={categories} activeSlug="all" />

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(service.slug, service.icon);
            return (
              <StaggerItem key={index}>
                <Card
                  className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group border border-border/40 bg-card rounded-2xl h-full flex flex-col"
                >
                  <CardContent className="p-0 h-full flex flex-col flex-grow">
                    <Link href={`/services/${service.slug}`} className="block flex-grow">
                      {/* Image aspect-video */}
                      <div className="relative overflow-hidden aspect-video bg-muted">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.name}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                        
                        {/* Floating category icon */}
                        <div className="absolute top-4 right-4 bg-white/95 p-2.5 rounded-xl backdrop-blur-xs shadow-md border border-border/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className="h-4.5 w-4.5 text-primary" />
                        </div>
                      </div>

                      {/* Card Content body */}
                      <div className="p-5 space-y-2.5">
                        <h3 className="text-lg md:text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-300 leading-snug">
                          {service.name}
                        </h3>
                        {service.shortDescription && (
                          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                            {service.shortDescription}
                          </p>
                        )}
                      </div>
                    </Link>

                    {/* Learn More link */}
                    <div className="p-5 pt-0 mt-auto">
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-xs font-bold text-primary group-hover:text-accent flex items-center gap-1 transition-colors w-fit"
                      >
                        Learn More
                        <svg
                          className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn y={20} delay={0.4} className="text-center mt-12">
          <Link href="/services">
            <Button
              size="lg"
              className="text-base md:text-lg px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Free Quote for All Services
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

