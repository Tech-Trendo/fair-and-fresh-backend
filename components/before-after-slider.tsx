'use client';

import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const MotionImage = motion.create(Image);

export interface SliderImage {
  image_url: string;
  before_image_url?: string;
  caption?: string;
}

const MIN_POS = 4;
const MAX_POS = 96;

function clampPos(value: number) {
  return Math.min(MAX_POS, Math.max(MIN_POS, value));
}

function BeforeAfterCompare({ image }: { image: SliderImage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(clampPos(next));
  }, []);

  if (!image.before_image_url) {
    return (
      <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[600px] flex items-center justify-center bg-background">
        <MotionImage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={image.image_url}
          alt={image.caption || 'Before & After transformation'}
          width={1280}
          height={720}
          sizes="(min-width: 1024px) 1024px, calc(100vw - 32px)"
          className="w-full h-auto object-cover max-h-[600px]"
        />
      </div>
    );
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    setDragging(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={`relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[600px] select-none touch-none bg-background overflow-hidden ${dragging ? 'cursor-ew-resize' : 'cursor-col-resize'
        }`}
    >
      {/* After image (base layer) */}
      <Image
        src={image.image_url}
        alt={image.caption ? `${image.caption} (after)` : 'After transformation'}
        fill
        sizes="(min-width: 1024px) 1024px, calc(100vw - 32px)"
        className="object-cover pointer-events-none"
        draggable={false}
      />

      {/* Before image (clipped layer) */}
      <Image
        src={image.before_image_url}
        alt={image.caption ? `${image.caption} (before)` : 'Before transformation'}
        fill
        sizes="(min-width: 1024px) 1024px, calc(100vw - 32px)"
        className="object-cover pointer-events-none"
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      {/* Divider line + handle */}
      <div
        className="absolute inset-y-0 z-10"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]" />
        <button
          type="button"
          role="slider"
          aria-label="Drag to compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              setPos((p) => clampPos(p - 2));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              setPos((p) => clampPos(p + 2));
            } else if (e.key === 'Home') {
              e.preventDefault();
              setPos(MIN_POS);
            } else if (e.key === 'End') {
              e.preventDefault();
              setPos(MAX_POS);
            }
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white shadow-md border border-border flex items-center justify-center hover:bg-accent-tint transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-col-resize"
        >
          <ChevronsLeftRight className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 z-10 bg-black/60 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
        Before
      </span>
      <span className="absolute top-3 right-3 z-10 bg-emerald-600/80 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
        After
      </span>
    </div>
  );
}

export function BeforeAfterSlider({ images = [] }: { images?: SliderImage[] }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const activeImage = images[current];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-5xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3 text-balance">
            Transform with Advanced Cleaning Expertise
          </h2>
          <p className="text-base text-muted-foreground font-body w-full max-w-[920px] mx-auto px-4">
            Transform your living space with our professional services in Brisbane. Experience the perfect blend of expertise and care that eliminates tough stains, odors, and allergens, restoring the comfort and freshness of your furniture. Let us make your house look and feel as good as new.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="max-w-5xl mx-auto relative">
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-border">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center bg-background"
              >
                <BeforeAfterCompare image={activeImage} />
              </motion.div>
            </AnimatePresence>

            {/* Caption */}
            {activeImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-12 pointer-events-none">
                <p className="text-white text-sm md:text-base font-body">
                  {activeImage.caption}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:-left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-accent-tint text-foreground p-2.5 rounded-full shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              <button
                onClick={next}
                className="absolute right-3 sm:-right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-accent-tint text-foreground p-2.5 rounded-full shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>

              {/* Indicator Dots */}
              <div className="flex justify-center items-center gap-3 mt-5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-3 rounded-full transition-all duration-200 ${idx === current ? 'w-8 bg-primary' : 'w-3 bg-border hover:bg-primary/50'
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
