"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Calendar, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, CountUp } from "@/components/motion-wrapper";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-12 md:mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              Ready for Fresh, Clean Fabrics?
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Get your free quote today and experience Brisbane&apos;s best fabric cleaning service
            </p>
          </FadeIn>
        </div>

        {/* CTA Cards with Staggered Entry */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6 mb-12">
          <StaggerItem>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Book Online</h3>
                <p className="text-muted-foreground mb-4 text-sm flex-grow">
                  Fill out our quick 2-step form and get your free quote instantly
                </p>
                <Link href="/quote">
                  <Button className="w-full group">
                    Get Free Quote
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-accent/50 h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Call Us Now</h3>
                <p className="text-muted-foreground mb-4 text-sm flex-grow">
                  Speak directly with our team for immediate assistance
                </p>
                <a href="tel:0430799567">
                  <Button
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent hover:text-white group bg-transparent"
                  >
                    0430 799 567
                    <Phone className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 h-full">
              <CardContent className="p-6 text-center flex flex-col h-full">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Contact Us</h3>
                <p className="text-muted-foreground mb-4 text-sm flex-grow">
                  Visit our contact page for more ways to reach us
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full group bg-transparent">
                    Contact Page
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerContainer>

        {/* Trust indicators with scale-in and count-up animations */}
        <ScaleIn className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={2} suffix=" Hours" />
              </div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Same Day</div>
              <div className="text-sm text-muted-foreground">Service Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Eco-Friendly</div>
              <div className="text-sm text-muted-foreground">Products Used</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={100} suffix="%" />
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction Guarantee</div>
            </div>
          </div>
        </ScaleIn>
      </div>
    </section>
  );
}
