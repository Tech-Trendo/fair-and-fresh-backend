"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

export function Hero() {
  const [content, setContent] = useState({
    title: 'Professional Fabric Cleaning in <span class="text-primary">Brisbane</span>',
    description: "Carpet, mattress, rug, upholstery, and curtain cleaning across Brisbane. Straightforward pricing, thorough work, and results you can see — and feel.",
    promoText: "Same-day booking — 20% off",
    ratingText: "4.9/5 Rating",
    statsLabel: "Happy Customers",
    statsValue: "500+",
    heroImage: "/professional-carpet-cleaning-service-in-modern-hom.jpg",
    phone: "0430 799 567",
  });

  useEffect(() => {
    let active = true;
    fetch("/api/site-content?group=home")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const map: Record<string, string> = {};
          data.results.forEach((item: any) => { map[item.key] = item.value; });
          setContent((prev) => ({
            ...prev,
            title: map.home_hero_title || prev.title,
            description: map.home_hero_description || prev.description,
            promoText: map.home_promo_text || prev.promoText,
            ratingText: map.home_rating_text || prev.ratingText,
            statsLabel: map.home_stats_label || prev.statsLabel,
            statsValue: map.home_stats_value || prev.statsValue,
            heroImage: map.home_hero_image || prev.heroImage,
          }));
        }
      })
      .catch(() => {});

    fetch("/api/site-content?group=site_settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const phoneSetting = data.results.find((s: any) => s.key === "site_phone");
          if (phoneSetting) setContent((prev) => ({ ...prev, phone: phoneSetting.value }));
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  return (
    <section className="bg-background py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* Left text column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
            }}
          >
            {/* Eyebrow badge — light green tint pill */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="mb-5"
            >
              <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full">
                {content.promoText}
              </span>
            </motion.div>

            {/* Headline — large bold Poppins */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading-bold text-foreground leading-tight text-balance"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />

            {/* Description — grey */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="text-base md:text-lg text-muted-foreground mt-4 md:mt-5 text-pretty font-body leading-relaxed"
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons — pill shape */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
              }}
              className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8"
            >
              <Link href="/quote">
                <Button
                  size="lg"
                  className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-7 font-nav text-base w-full sm:w-auto"
                >
                  Get Free Quote
                </Button>
              </Link>
              <a href={`tel:${content.phone.replace(/\s/g, '')}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-7 font-nav text-base w-full sm:w-auto bg-transparent"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  {content.phone}
                </Button>
              </a>
            </motion.div>


          </motion.div>

          {/* Right image column — with floating trust badges */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            <div className="relative overflow-hidden rounded-xl shadow-sm">
              <Image
                width={600}
                height={400}
                src={content.heroImage}
                alt="Professional carpet cleaning service showing the fresh difference"
                className="w-full h-auto"
                priority
              />
            </div>

            {/* Floating trust badges — three corners of the image */}

            {/* Top-right: Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.3 }}
              className="absolute top-4 right-4 lg:-top-5 lg:-right-5 bg-gradient-to-br from-white via-white to-amber-50/80 rounded-xl shadow-lg shadow-black/5 border border-amber-100/50 backdrop-blur-sm px-4 py-3 z-10"
            >
              <div className="flex items-center gap-2 min-w-[125px]">
                {/* Star cluster */}
                <div className="flex items-center -space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-heading font-bold text-sm text-foreground tracking-tight">{content.ratingText}</span>
              </div>
            </motion.div>

            {/* Left-middle: Happy Customers badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.4 }}
              className="absolute top-1/2 -translate-y-1/2 left-4 lg:-left-5 bg-gradient-to-br from-white via-white to-emerald-50/80 rounded-xl shadow-lg shadow-black/5 border border-emerald-100/50 backdrop-blur-sm px-4 py-3 z-10"
            >
              <div className="flex flex-col min-w-[110px]">
                <div className="flex items-center gap-2 mb-0.5">
                  {/* Checkmark icon */}
                  <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-heading font-bold text-foreground text-sm leading-tight">{content.statsValue}</span>
                </div>
                <span className="text-[11px] font-medium text-emerald-700/70 font-body tracking-wide uppercase ml-6">{content.statsLabel}</span>
              </div>
            </motion.div>

            {/* Bottom-right: Brisbane Suburbs badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.5 }}
              className="absolute bottom-4 right-4 lg:-bottom-5 lg:-right-5 bg-gradient-to-br from-white via-white to-sky-50/80 rounded-xl shadow-lg shadow-black/5 border border-sky-100/50 backdrop-blur-sm px-4 py-3 z-10"
            >
              <div className="flex flex-col min-w-[110px]">
                <div className="flex items-center gap-2 mb-0.5">
                  {/* Map pin icon */}
                  <svg className="h-4 w-4 text-sky-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-heading font-bold text-foreground text-sm leading-tight">12+</span>
                </div>
                <span className="text-[11px] font-medium text-sky-700/70 font-body tracking-wide uppercase ml-6">Brisbane Suburbs</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
