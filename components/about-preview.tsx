"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, CountUp } from "@/components/motion-wrapper";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

interface AboutPreviewProps {
  image: string;
  imageAlt?: string;
  stats?: StatItem[];
  heading: string;
  description: string;
  ctaText: string;
  ctaHref?: string;
}

export function AboutPreview({
  image,
  imageAlt = "Cleaning team",
  stats,
  heading,
  description,
  ctaText,
  ctaHref = "/about",
}: AboutPreviewProps) {
  return (
    <section id="about" className="py-12 md:py-16 bg-background">
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
              {stats && stats.length > 0 && (
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
              )}
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

              <Link href={ctaHref}>
                <Button
                  size="lg"
                  className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground font-nav text-base"
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
