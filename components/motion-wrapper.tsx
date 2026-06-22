"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";

// ─── Shared viewport config ────────────────────────────────────────────────
const defaultViewport = { once: true, amount: 0.2 };

// ─── Fade In (from below) ──────────────────────────────────────────────────
interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}

export function FadeIn({ children, delay = 0, duration = 0.6, className, y = 30 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={defaultViewport}
      transition={{ duration, delay, ease: [0.25, 0.4, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Slide In (configurable direction) ─────────────────────────────────────
interface SlideInProps {
  children: ReactNode;
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  viewportTriggered?: boolean;
}

const slideOffsets = {
  left: { x: -60, y: 0 },
  right: { x: 60, y: 0 },
  up: { x: 0, y: -60 },
  down: { x: 0, y: 60 },
};

export function SlideIn({
  children,
  direction = "left",
  delay = 0,
  duration = 0.7,
  className,
  viewportTriggered = true,
}: SlideInProps) {
  const offset = slideOffsets[direction];
  const animateProps = viewportTriggered
    ? { whileInView: { opacity: 1, x: 0, y: 0 }, viewport: defaultViewport }
    : { animate: { opacity: 1, x: 0, y: 0 } };

  return (
    <motion.div
      initial={{ opacity: 0, ...offset }}
      {...animateProps}
      transition={{ duration, delay, ease: [0.25, 0.4, 0, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Container ─────────────────────────────────────────────────────
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

const staggerVariants: Variants = {
  hidden: {},
  visible: (custom: { staggerDelay: number; delayChildren: number }) => ({
    transition: {
      staggerChildren: custom.staggerDelay,
      delayChildren: custom.delayChildren,
    },
  }),
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.12,
  delayChildren = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={staggerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      custom={{ staggerDelay, delayChildren }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger Item (child of StaggerContainer) ──────────────────────────────
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0, 1] },
  },
};

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ─── Scale In (with optional spring) ───────────────────────────────────────
interface ScaleInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  spring?: boolean;
}

export function ScaleIn({ children, delay = 0, className, spring = true }: ScaleInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={defaultViewport}
      transition={
        spring
          ? { type: "spring", stiffness: 200, damping: 15, delay }
          : { duration: 0.5, delay, ease: [0.25, 0.4, 0, 1] }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── CountUp (animated number counter) ─────────────────────────────────────
interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function CountUp({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className,
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(eased * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </span>
  );
}
