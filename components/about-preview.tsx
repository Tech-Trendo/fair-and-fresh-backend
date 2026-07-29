"use client";

import { Button } from "@/components/ui/button";
import { Shield, Award, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, CountUp } from "@/components/motion-wrapper";

export function AboutPreview() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image and inline stats */}
          <div className="relative">
            <FadeIn>
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/professional-cleaning-team-with-equipment-in-brisb.jpg"
                  alt="Fair and Fresh Cleaning team"
                  className="w-full h-[400px] md:h-[450px] object-cover"
                  width={500}
                  height={400}
                />
              </div>
              {/* Stats overlay */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                  <div className="text-xl md:text-2xl font-heading-bold text-primary">
                    <CountUp end={15} suffix="+" />
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Years</div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                  <div className="text-xl md:text-2xl font-heading-bold text-primary">
                    <CountUp end={2.5} suffix="K+" decimals={1} />
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Clients</div>
                </div>
                <div className="bg-white rounded-xl border border-border p-4 text-center">
                  <div className="text-xl md:text-2xl font-heading-bold text-primary">
                    <CountUp end={98} suffix="%" />
                  </div>
                  <div className="text-xs text-muted-foreground font-body">Satisfaction</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right side - Content */}
          <div>
            <FadeIn delay={0.1}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-5 text-balance">
                Brisbane&apos;s Most Trusted Fabric Cleaning Specialists
              </h2>
              <p className="text-base text-muted-foreground mb-8 text-pretty leading-relaxed font-body">
                For over 15 years, Fair and Fresh Cleaning has been transforming homes and businesses across
                Brisbane with our professional fabric cleaning services. We combine cutting-edge technology
                with eco-friendly practices to deliver exceptional results.
              </p>

              {/* Key features — flat icon tile grid */}
              <StaggerContainer className="grid sm:grid-cols-2 gap-3 mb-8">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border">
                    <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-heading text-foreground">Fully Insured</div>
                      <div className="text-xs text-muted-foreground font-body">Complete protection</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border">
                    <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-heading text-foreground">Certified Experts</div>
                      <div className="text-xs text-muted-foreground font-body">Professional training</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border">
                    <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-heading text-foreground">2,500+ Happy Clients</div>
                      <div className="text-xs text-muted-foreground font-body">Proven track record</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-border">
                    <div className="w-10 h-10 bg-accent-tint rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-heading text-foreground">100% Guarantee</div>
                      <div className="text-xs text-muted-foreground font-body">Satisfaction guaranteed</div>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <Link href="/about">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-base"
                >
                  Learn More About Us
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
