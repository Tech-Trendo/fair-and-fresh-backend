"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Phone, Sparkles, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScaleIn } from "@/components/motion-wrapper";

const ease = [0.25, 0.4, 0, 1] as const;

export function Hero() {
  const [content, setContent] = useState({
    title: 'Professional Fabric Cleaning in <span className="text-primary">Brisbane</span>',
    description: "Expert cleaning services for carpets, mattresses, rugs, upholstery, curtains, and car seats in Brisbane. Fair pricing, fresh results, guaranteed satisfaction.",
    promoText: "Get 20% OFF on same day booking!",
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
    <section className="bg-gradient-to-br from-secondary/30 to-background py-12 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left text column — slides in from the left with staggered children */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
            }}
          >
            {/* Animated Promo Banner */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
              }}
              className="mb-6 inline-flex"
            >
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center gap-2 sm:gap-3 bg-card/90 backdrop-blur-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-primary/20 shadow-md transition-transform hover:scale-105 duration-300">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary/20 shrink-0" />
                  </motion.div>
                  <p className="text-xs sm:text-sm md:text-base font-medium text-foreground pr-1">
                    {content.promoText}
                  </p>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
              }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight text-balance"
              dangerouslySetInnerHTML={{ __html: content.title }}
            />

            <motion.p
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
              }}
              className="text-lg md:text-xl text-muted-foreground mt-4 md:mt-6 text-pretty"
            >
              {content.description}
            </motion.p>

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
                  className="text-base md:text-lg px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  Get Free Quote
                </Button>
              </Link>
              <a href={`tel:${content.phone.replace(/\s/g, '')}`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base md:text-lg px-6 md:px-8 bg-transparent transition-all duration-300 hover:scale-105 hover:shadow-lg border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call: {content.phone}
                </Button>
              </a>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
              }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mt-8 md:mt-12"
            >
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 md:h-5 w-4 md:w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm md:text-base text-muted-foreground">{content.ratingText}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right image column — slides in from the right */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            <Image
              width={500}
              height={300}
              src={content.heroImage}
              alt="Professional carpet cleaning service"
              className="rounded-lg shadow-2xl transition-transform duration-500 hover:scale-105"
            />
            {/* Floating badge with spring scale-in */}
            <ScaleIn delay={0.9} className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6">
              <div className="bg-card p-4 md:p-6 rounded-lg shadow-lg border border-border">
                <div className="text-2xl md:text-3xl font-bold text-primary">{content.statsValue}</div>
                <div className="text-sm md:text-base text-muted-foreground">{content.statsLabel}</div>
              </div>
            </ScaleIn>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
