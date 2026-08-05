'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SliderImage {
  image_url: string;
  caption?: string;
}

export function BeforeAfterSlider({ images = [] }: { images?: SliderImage[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  const activeImage = images[current];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-4">
            Proven Results
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3 text-balance">
            Real Transformations: Before & After
          </h2>
          <p className="text-base text-muted-foreground font-body max-w-2xl mx-auto">
            See the remarkable difference our deep steam cleaning process brings to Brisbane carpets, tiles, and upholstery.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div className="max-w-5xl mx-auto relative">
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-white border border-border">
            <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[600px] flex items-center justify-center bg-background">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage.image_url}
                  alt={activeImage.caption || 'Before & After transformation'}
                  className="w-full h-full object-cover max-h-[600px]"
                />
              </AnimatePresence>

              {/* Caption */}
              {activeImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-6 pt-12">
                  <p className="text-white text-sm md:text-base font-body">
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
                    className={`h-3 rounded-full transition-all duration-200 ${
                      idx === current ? 'w-8 bg-primary' : 'w-3 bg-border hover:bg-primary/50'
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
