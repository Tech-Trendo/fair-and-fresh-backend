"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import Link from "next/link";

const headingWords = "Ready for Fresh, Clean Fabrics?".split(" ");

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.25, 0.4, 0, 1] },
  },
};

const bubbles = [
  { left: "5%", top: "18%", size: 84, duration: 9, delay: 0 },
  { left: "16%", top: "68%", size: 48, duration: 7, delay: 1.5 },
  { left: "30%", top: "12%", size: 34, duration: 8, delay: 0.8 },
  { left: "48%", top: "78%", size: 56, duration: 10, delay: 2.2 },
  { left: "68%", top: "22%", size: 42, duration: 7.5, delay: 0.4 },
  { left: "84%", top: "62%", size: 66, duration: 9.5, delay: 1.2 },
  { left: "92%", top: "16%", size: 30, duration: 6.5, delay: 0.6 },
  { left: "58%", top: "8%", size: 24, duration: 8.5, delay: 2.6 },
];

export function CtaSection() {
  const blockRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 55, damping: 18 });

  const glowX = useTransform(smoothX, (v) => v * 42);
  const glowY = useTransform(smoothY, (v) => v * 42);
  const layerX = useTransform(smoothX, (v) => v * -22);
  const layerY = useTransform(smoothY, (v) => v * -18);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = blockRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={blockRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => {
            mouseX.set(0);
            mouseY.set(0);
          }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#314c9f] via-[#28398f] to-[#1c2a63] px-6 py-16 md:px-16 md:py-24 text-center shadow-xl shadow-primary/10"
        >
          {/* Ambient glow layer (follows the cursor) */}
          <motion.div
            aria-hidden
            style={{ x: glowX, y: glowY }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-sky-300/20 blur-3xl" />
          </motion.div>

          {/* Floating soap bubbles (parallax layer) */}
          <motion.div
            aria-hidden
            style={{ x: layerX, y: layerY }}
            className="pointer-events-none absolute inset-0"
          >
            {bubbles.map((b, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full border border-white/20 bg-white/10"
                style={{ left: b.left, top: b.top, width: b.size, height: b.size }}
                animate={prefersReducedMotion ? undefined : { y: [0, -26, 0], x: [0, 14, 0] }}
                transition={{
                  duration: b.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: b.delay,
                }}
              />
            ))}
          </motion.div>

          {/* Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-nav tracking-wide text-white/90 backdrop-blur">
                Brisbane&apos;s Trusted Fabric Cleaning Specialists
              </span>
            </motion.div>

            <motion.h2
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              className="mt-6 text-3xl md:text-4xl lg:text-5xl font-heading-bold text-white leading-tight text-balance"
            >
              {headingWords.map((w, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="inline-block mr-[0.25em]"
                >
                  {w}
                </motion.span>
              ))}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-5 text-base md:text-lg text-white/80 max-w-xl mx-auto text-pretty font-body"
            >
              Get your free quote today and experience Brisbane&apos;s best fabric
              cleaning service
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link href="/quote">
                <Button
                  size="lg"
                  className="group relative overflow-hidden rounded-full bg-white text-primary hover:bg-white/95 font-nav text-base px-8 w-full sm:w-auto shadow-lg shadow-black/10"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#314c9f]/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <span className="relative flex items-center gap-2">
                    Get Free Quote
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <a href="tel:0430799567">
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative overflow-hidden rounded-full border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white/60 font-nav text-base px-8 backdrop-blur w-full sm:w-auto"
                >
                  <span className="relative flex items-center">
                    <span className="mr-2 flex h-2.5 w-2.5 relative">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <Phone className="mr-2 h-4 w-4" />
                    0430 799 567
                  </span>
                </Button>
              </a>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
