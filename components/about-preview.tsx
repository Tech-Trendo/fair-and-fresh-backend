"use client";

import { Button } from "@/components/ui/button";
import { Shield, Award, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SlideIn, ScaleIn, CountUp, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

export function AboutPreview() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image and stats */}
          <div className="relative">
            <SlideIn direction="left">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/professional-cleaning-team-with-equipment-in-brisb.jpg"
                  alt="Fair and Fresh Cleaning team"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  width={500}
                  height={400}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>

                {/* Stats overlay with CountUp animations */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold">
                        <CountUp end={15} suffix="+" />
                      </div>
                      <div className="text-xs md:text-sm opacity-90">Years</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold">
                        <CountUp end={2.5} suffix="K+" decimals={1} />
                      </div>
                      <div className="text-xs md:text-sm opacity-90">Clients</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-bold">
                        <CountUp end={98} suffix="%" />
                      </div>
                      <div className="text-xs md:text-sm opacity-90">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Floating badge with ScaleIn spring animation */}
            <ScaleIn delay={0.5} className="absolute -top-4 -right-4 z-10">
              <div className="bg-accent text-white px-6 py-3 rounded-full shadow-lg">
                <div className="text-sm font-semibold">Brisbane&apos;s #1</div>
              </div>
            </ScaleIn>
          </div>

          {/* Right side - Content */}
          <div>
            <SlideIn direction="left" delay={0.2}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                Brisbane&apos;s Most Trusted Fabric Cleaning Specialists
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
                For over 15 years, Fair and Fresh Cleaning has been transforming homes and businesses across
                Brisbane with our professional fabric cleaning services. We combine cutting-edge technology
                with eco-friendly practices to deliver exceptional results.
              </p>

              {/* Key features grid with staggered items */}
              <StaggerContainer className="grid sm:grid-cols-2 gap-4 mb-8">
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg transition-all duration-300 hover:bg-secondary/50 h-full">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">Fully Insured</div>
                      <div className="text-sm text-muted-foreground">Complete protection & peace of mind</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg transition-all duration-300 hover:bg-secondary/50 h-full">
                    <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">Certified Experts</div>
                      <div className="text-sm text-muted-foreground">Professional trained technicians</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg transition-all duration-300 hover:bg-secondary/50 h-full">
                    <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-foreground">2,500+ Happy Clients</div>
                      <div className="text-sm text-muted-foreground">Proven track record</div>
                    </div>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg transition-all duration-300 hover:bg-secondary/50 h-full">
                    <svg
                      className="h-6 w-6 text-primary flex-shrink-0 mt-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <div className="font-semibold text-foreground">100% Guarantee</div>
                      <div className="text-sm text-muted-foreground">Satisfaction guaranteed</div>
                    </div>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <Link href="/about">
                <Button size="lg" className="group">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </SlideIn>
          </div>
        </div>
      </div>
    </section>
  );
}
