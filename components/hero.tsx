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
    statsLabel: "Jobs Completed",
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
              />
            </div>

            {/* Floating trust badges — three corners of the image */}

            {/* Top-right: Rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.3 }}
              className="absolute top-4 right-4 lg:-top-4 lg:-right-4 bg-white rounded-xl shadow-md border border-border px-5 py-3.5 z-10"
            >
              <div className="flex items-center gap-1.5 min-w-[120px]">
                <svg className="h-4 w-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-heading font-bold text-foreground text-sm whitespace-nowrap">{content.ratingText}</span>
              </div>
            </motion.div>

            {/* Bottom-left: Happy Customers badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.4 }}
              className="absolute bottom-4 left-4 lg:-bottom-4 lg:-left-4 bg-white rounded-xl shadow-md border border-border px-5 py-3.5 z-10"
            >
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="font-heading font-bold text-foreground text-sm leading-tight">{content.statsValue}</span>
                <span className="text-xs text-muted-foreground font-body leading-tight mt-0.5 whitespace-nowrap">{content.statsLabel}</span>
              </div>
            </motion.div>

            {/* Bottom-right: Brisbane Suburbs badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease, delay: 0.5 }}
              className="absolute bottom-4 right-4 lg:-bottom-4 lg:-right-4 bg-white rounded-xl shadow-md border border-border px-5 py-3.5 z-10"
            >
              <div className="flex flex-col items-center min-w-[120px]">
                <span className="font-heading font-bold text-foreground text-sm leading-tight">12+</span>
                <span className="text-xs text-muted-foreground font-body leading-tight mt-0.5 whitespace-nowrap">Brisbane Suburbs</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
