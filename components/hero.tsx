"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

export function Hero() {
  const [content, setContent] = useState({
    title: 'Professional Fabric Cleaning in <em class="font-display italic">Brisbane</em>',
    description: "Carpet, mattress, rug, upholstery, and curtain cleaning across Brisbane. Straightforward pricing, thorough work, and results you can see — and feel.",
    promoText: "Same-day booking — 20% off",
    ratingText: "4.9/5 Rating",
    statsLabel: "Jobs Completed",
    statsValue: "500+",
    heroImage: "/professional-carpet-cleaning-service-in-modern-hom.jpg",
    phone: "0430 799 567",
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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

  const { scrollYProgress } = useScroll();
  const imageParallaxY = useTransform(scrollYProgress, [0, 0.2], [0, -20]);

  return (
    <section className="bg-[#EDEFEC] py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left text column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
          >
            {/* Promo badge */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
              }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 border-l-2 border-[#B98A3D] bg-white/70 pl-3 pr-4 py-1.5 text-xs sm:text-sm text-[#16323A] font-sans-alt">
                {content.promoText}
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
              }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#16323A] leading-tight text-balance font-display"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />

            {/* Description */}
            <motion.p
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
              }}
              className="text-base md:text-lg text-[#5B6B6A] mt-4 md:mt-6 text-pretty font-sans-alt"
            >
              {content.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8"
            >
              <Link href="/quote">
                <Button
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-8 transition-all duration-300 bg-[#16323A] hover:bg-[#1f4350] text-white w-full sm:w-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A3D]"
                >
                  Get Free Quote
                </Button>
              </Link>
              <a href={`tel:${content.phone.replace(/\s/g, '')}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-8 bg-transparent transition-all duration-300 border-[#16323A] text-[#16323A] hover:bg-[#16323A] hover:text-white w-full sm:w-auto cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B98A3D]"
                >
                  <Phone className="mr-2 h-4 w-4 shrink-0" />
                  <span className="font-mono-alt">{content.phone}</span>
                </Button>
              </a>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease, delay: 0.3 } },
              }}
              className="mt-10 md:mt-14 border-t border-[#16323A]/10 pt-4"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-[#5B6B6A] font-sans-alt">
                <span>
                  <span className="text-[#B98A3D] font-sans-alt">★</span>{' '}
                  <span className="font-mono-alt font-medium text-[#16323A]">{content.ratingText}</span>
                </span>
                <span>
                  <span className="font-mono-alt font-medium text-[#16323A]">{content.statsValue}</span>{' '}
                  {content.statsLabel}
                </span>
                <span>
                  <span className="font-mono-alt font-medium text-[#16323A]">12+</span> Brisbane Suburbs
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right image column */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <motion.div style={reducedMotion ? {} : { y: imageParallaxY }}>
                <Image
                  width={500}
                  height={300}
                  src={content.heroImage}
                  alt="Professional carpet cleaning service showing the fresh difference"
                  className="w-full h-auto"
                />
                {/* Diagonal wipe overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(22,50,58,0.35) 0%, rgba(22,50,58,0.35) 45%, transparent 48%, transparent 100%)',
                  }}
                  aria-hidden="true"
                />
                {/* Diagonal accent line */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, transparent 47%, rgba(185,138,61,0.25) 49%, transparent 51%)',
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
