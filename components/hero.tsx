"use client";

import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

export type HeroContent = {
  title: string;
  description: string;
  promoText: string;
  heroImage: string;
  phone: string;
};

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="relative bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-background py-12 md:py-16 overflow-hidden border-b border-border/40">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left text column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            {/* Eyebrow badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="mb-6"
            >
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-600/10 border border-blue-500/20 text-blue-700 text-xs sm:text-sm font-semibold px-4 py-2 rounded-full shadow-xs backdrop-blur-xs">
                <span>{content.promoText}</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-slate-900 leading-[1.15] tracking-tight text-balance"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="text-base sm:text-lg text-slate-600 mt-5 md:mt-6 text-pretty font-body leading-relaxed max-w-xl"
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10"
            >
              <Link href="/quote">
                <Button
                  size="lg"
                  className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground px-8 py-6 font-nav text-base w-full sm:w-auto shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/35 transition-all duration-300 group"
                >
                  <span>Get Free Quote</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href={`tel:${content.phone.replace(/\s/g, '')}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-slate-200 hover:border-red-600 bg-white/80 hover:bg-red-600/5 text-slate-800 hover:text-red-600 px-8 py-6 font-nav text-base w-full sm:w-auto shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <Phone className="mr-2.5 h-4 w-4 text-primary" />
                  <span>{content.phone}</span>
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Right image column - no opacity animation: LCP image must be
              visible as soon as it loads, otherwise LCP is delayed until the
              animation finishes */}
          <div className="relative lg:pl-4">
            {/* Background card glow aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 rounded-3xl transform rotate-1 scale-105 blur-xl pointer-events-none" />

            {/* Hero image card */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10 border-4 border-white bg-white">
              <Image
                width={700}
                height={480}
                src={content.heroImage}
                alt="Professional carpet cleaning service in Brisbane"
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
