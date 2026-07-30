"use client";

import { Button } from "@/components/ui/button";
import { Shield, Award, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

interface FeatureItem {
  title: string;
  description: string;
}

interface AboutPreviewProps {
  image: string;
  imageAlt?: string;
  stats: StatItem[];
  heading: string;
  description: string;
  features: FeatureItem[];
  ctaText: string;
  ctaHref?: string;
}

const iconMap = [Shield, Award, Users, null];

export function AboutPreview({
  image,
  imageAlt = "Cleaning team",
  stats,
  heading,
  description,
  features,
  ctaText,
  ctaHref = "/about",
}: AboutPreviewProps) {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image and inline stats */}
          <div className="relative">
            <FadeIn>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={image}
                  alt={imageAlt}
                  className="w-full h-[400px] md:h-[450px] object-cover"
                  width={500}
                  height={400}
                />
              </div>
              {/* Stats overlay */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-border p-4 text-center">
                    <div className="text-xl md:text-2xl font-heading-bold text-primary">
                      <CountUp end={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                    </div>
                    <div className="text-xs text-muted-foreground font-body">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right side - Content */}
          <div>
            <FadeIn delay={0.1}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-5 text-balance">
                {heading}
              </h2>
              <p className="text-base text-muted-foreground mb-8 text-pretty leading-relaxed font-body">
                {description}
              </p>

              {/* Key features — flat icon tile grid */}
              <StaggerContainer className="grid sm:grid-cols-2 gap-3 mb-8">
                {features.map((feature, idx) => {
                  const Icon = iconMap[idx] ?? (() => (
                    <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ));
                  return (
                    <StaggerItem key={idx}>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border">
                        <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-sm font-heading text-foreground">{feature.title}</div>
                          <div className="text-xs text-muted-foreground font-body">{feature.description}</div>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>

              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-base"
                >
                  {ctaText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
