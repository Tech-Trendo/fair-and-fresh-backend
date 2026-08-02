"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Star, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const ease = [0.25, 0.4, 0, 1] as const;

export function Hero() {
  const [content, setContent] = useState({
    title: 'Professional Fabric Cleaning in <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Brisbane</span>',
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
    <section className="relative bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-background py-16 md:py-24 overflow-hidden border-b border-border/40">
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

          {/* Right image column — with floating trust badges */}
          <motion.div
            className="relative lg:pl-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
          >
            {/* Background card glow aura */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/15 to-indigo-600/15 rounded-3xl transform rotate-1 scale-105 blur-xl pointer-events-none" />

            {/* Hero image card */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-slate-900/10 border-4 border-white bg-white">
              <Image
                width={700}
                height={480}
                src={content.heroImage}
                alt="Professional carpet cleaning service in Brisbane"
                className="w-full h-auto object-cover transform transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>

            {/* FLOATING TRUST BADGES */}

            {/* Top-Right Badge: Rating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -6, 0]
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.3 },
                scale: { duration: 0.4, delay: 0.3 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-900/10 border border-slate-100 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-heading-bold text-slate-900 text-base leading-none">4.9</span>
                    <span className="text-xs text-slate-400 font-medium">/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                    ))}
                    <span className="text-[10px] font-semibold text-slate-500 ml-1">Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Left-Middle Badge: Happy Customers */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, 6, 0]
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.4 },
                scale: { duration: 0.4, delay: 0.4 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
              className="absolute top-1/2 -translate-y-1/2 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-900/10 border border-slate-100 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading-bold text-slate-900 text-lg leading-none">{content.statsValue}</span>
                  <span className="text-xs font-semibold text-slate-500 mt-0.5">{content.statsLabel}</span>
                </div>
              </div>
            </motion.div>

            {/* Bottom-Right Badge: Brisbane Suburbs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: [0, -6, 0]
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.5 },
                scale: { duration: 0.4, delay: 0.5 },
                y: { duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-900/10 border border-slate-100 z-20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading-bold text-slate-900 text-lg leading-none">12+</span>
                  <span className="text-xs font-semibold text-slate-500 mt-0.5">Brisbane Suburbs</span>
                </div>
              </div>
            </motion.div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
