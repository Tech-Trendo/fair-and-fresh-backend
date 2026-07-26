'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SliderImage {
  image_url: string;
  caption?: string;
}

export function BeforeAfterSlider({ images = [] }: { images?: SliderImage[] }) {
  const [current, setCurrent] = useState(0);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const activeImage = images[current];

  return (
    <section className="py-16 md:py-24 bg-secondary/30 border-y border-border/40">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Proven Results</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight leading-tight">
            Real Transformations: <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">Before & After</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            See the remarkable difference our deep steam cleaning process brings to Brisbane carpets, tiles, and upholstery.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="max-w-6xl mx-auto relative">
          <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white border border-border/60">
            <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[650px] flex items-center justify-center bg-slate-900/5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  src={activeImage.image_url}
                  alt={activeImage.caption || 'Before & After transformation'}
                  className="w-full h-full object-cover max-h-[650px]"
                />
              </AnimatePresence>

              {/* Caption Overlay */}
              {activeImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-12">
                  <p className="text-white text-base sm:text-lg font-medium drop-shadow-sm max-w-3xl">
                    {activeImage.caption}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 sm:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-foreground p-3 rounded-full shadow-lg border border-slate-200/80 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary z-20"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-slate-700" />
              </button>

              <button
                onClick={next}
                className="absolute right-3 sm:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-slate-50 text-foreground p-3 rounded-full shadow-lg border border-slate-200/80 transition-all hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary z-20"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-slate-700" />
              </button>

              {/* Indicator Dots */}
              <div className="flex justify-center items-center gap-2 mt-6">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === current ? 'w-8 bg-primary' : 'w-2.5 bg-primary/25 hover:bg-primary/50'
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
