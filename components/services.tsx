"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { useState } from "react";

const SECTIONS = [
  { key: "steam", label: "Steam Cleaning" },
  { key: "maintenance", label: "Home Maintenance" },
  { key: "specialized", label: "Specialized Cleaning & Restoration" },
] as const;

export interface ServiceData {
  name: string;
  slug: string;
  image?: string;
  icon?: string;
  shortDescription?: string;
  category?: { id: string; title: string; slug: string }[];
  homeSection?: string;
}

export function Services({ services }: { services: ServiceData[] }) {
  const [activeSection, setActiveSection] = useState("steam");

  const filtered = services.filter((s) => s.homeSection === activeSection);

  return (
    <section id="services" className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground text-balance">
              Our Professional Cleaning Services
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-muted-foreground mt-3 max-w-2xl mx-auto text-pretty font-body">
              We specialize in fabric cleaning with state-of-the-art equipment and eco-friendly solutions.
            </p>
          </FadeIn>
        </div>

        {/* Section Tabs */}
        <FadeIn delay={0.15}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  activeSection === section.key
                    ? "bg-red-600 text-white"
                    : "bg-white text-foreground border border-border hover:bg-muted"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </FadeIn>

        <StaggerContainer
          key={activeSection}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filtered.map((service) => (
            <StaggerItem key={service.slug}>
              <Link href={`/services/${service.slug}`} className="block h-full group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col border border-border">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      width={400}
                      height={250}
                      sizes="(min-width: 1280px) 286px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-base font-heading-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-2 flex-grow">
                        {service.shortDescription}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn y={12} delay={0.2} className="text-center mt-10">
          <Link href="/quote">
            <Button
              size="lg"
              className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground px-8 font-nav text-base"
            >
              Get Free Quote
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
