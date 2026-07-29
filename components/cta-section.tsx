"use client";

import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/motion-wrapper";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Block — solid emerald green rounded-xl, no gradient */}
        <div className="bg-primary rounded-xl px-8 py-14 md:px-16 md:py-20 text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-primary-foreground mb-4 text-balance">
              Ready for Fresh, Clean Fabrics?
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-primary-foreground/85 max-w-xl mx-auto text-pretty font-body mb-8">
              Get your free quote today and experience Brisbane&apos;s best fabric cleaning service
            </p>
          </FadeIn>
          <FadeIn delay={0.2} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/quote">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary hover:bg-white/90 font-nav text-base px-8 w-full sm:w-auto"
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="tel:0430799567">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-white/40 text-white hover:bg-white/10 font-nav text-base px-8 bg-transparent w-full sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" />
                0430 799 567
              </Button>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
