"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

const reviews = [
  {
    name: "Sarah Mitchell",
    location: "New Farm, Brisbane",
    rating: 5,
    text: "Absolutely fantastic service! They cleaned our carpets and they look brand new. The team was professional, punctual, and the results exceeded our expectations.",
    service: "Carpet Cleaning",
  },
  {
    name: "David Chen",
    location: "South Brisbane",
    rating: 5,
    text: "Had my car seats cleaned and I'm amazed at the difference. Removed stains I thought were permanent. Fair pricing and excellent customer service.",
    service: "Car Seat Cleaning",
  },
  {
    name: "Emma Thompson",
    location: "Paddington, Brisbane",
    rating: 5,
    text: "Professional mattress cleaning service. My allergies have improved significantly since the cleaning. Highly recommend!",
    service: "Mattress Cleaning",
  },
  {
    name: "Michael Roberts",
    location: "West End, Brisbane",
    rating: 5,
    text: "They cleaned our antique Persian rug with such care. The colors are vibrant again and no damage whatsoever. True professionals!",
    service: "Rug Cleaning",
  },
  {
    name: "Lisa Anderson",
    location: "Fortitude Valley",
    rating: 5,
    text: "Upholstery cleaning for our lounge suite was perfect. They removed pet odors and stains completely. Great value for money.",
    service: "Upholstery Cleaning",
  },
  {
    name: "James Wilson",
    location: "Kangaroo Point",
    rating: 5,
    text: "Curtain cleaning service was excellent. They cleaned them on-site and they look fresh and new. Very convenient and professional.",
    service: "Curtain Cleaning",
  },
];

export interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

export interface ReviewServiceOption {
  id: string;
  name: string;
}

export interface ReviewsProps {
  reviews?: Review[];
  services?: ReviewServiceOption[];
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-xl border border-border p-6 h-full flex flex-col">
      {/* Star rating + Google badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-primary fill-primary" />
          ))}
        </div>
        {/* Google logo */}
        <svg viewBox="0 0 24 24" width="16" height="16" aria-label="Google Review" className="mt-0.5 flex-shrink-0">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      </div>
      {/* Quote text */}
      <p className="text-sm text-muted-foreground font-body leading-relaxed flex-grow mb-4 line-clamp-4">
        &ldquo;{review.text}&rdquo;
      </p>
      {/* Author info */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <div className="w-9 h-9 rounded-full bg-accent-tint flex items-center justify-center text-primary font-heading-bold text-sm">
          {review.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <div className="text-sm font-heading text-foreground">{review.name}</div>
          <div className="text-xs text-muted-foreground font-body">{review.location} · {review.service}</div>
        </div>
      </div>
    </div>
  );
}

export function Reviews({ reviews: customReviews, services: customServicesOptions }: ReviewsProps = {}) {
  const router = useRouter();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [author, setAuthor] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [servicesOptions, setServicesOptions] = useState<ReviewServiceOption[]>(customServicesOptions || []);

  useEffect(() => {
    if (customServicesOptions && customServicesOptions.length > 0) {
      setServicesOptions(customServicesOptions);
      setServiceId(customServicesOptions[0].id);
    } else {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.results) {
            const mapped = data.results.map((s: any) => ({ id: s.id, name: s.name }));
            setServicesOptions(mapped);
            if (mapped.length > 0) setServiceId(mapped[0].id);
          }
        })
        .catch(() => {});
    }
  }, [customServicesOptions]);

  const activeReviews = customReviews !== undefined ? customReviews : reviews;
  const displayedReviews = showAllReviews ? activeReviews : activeReviews.slice(0, 3);

  const isCarousel = activeReviews.length > 3;

  const [perPage, setPerPage] = useState(3);
  const [currentPage, setCurrentPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const compute = () => {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      setPerPage(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const pageCount = Math.max(1, Math.ceil(activeReviews.length / perPage));

  useEffect(() => {
    if (currentPage > pageCount - 1) {
      setCurrentPage(Math.max(0, pageCount - 1));
    }
  }, [pageCount, currentPage]);

  useEffect(() => {
    if (!isCarousel || paused || pageCount <= 1) return;
    const id = setInterval(() => {
      setCurrentPage((p) => (p === pageCount - 1 ? 0 : p + 1));
    }, 10000);
    return () => clearInterval(id);
  }, [isCarousel, paused, pageCount]);

  const goPrev = useCallback(() => {
    setCurrentPage((p) => (p === 0 ? pageCount - 1 : p - 1));
  }, [pageCount]);

  const goNext = useCallback(() => {
    setCurrentPage((p) => (p === pageCount - 1 ? 0 : p + 1));
  }, [pageCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, serviceId, rating, content }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit review");
      toast.success("Review submitted successfully! Thank you.");
      setAuthor("");
      setServiceId(servicesOptions[0]?.id || "");
      setRating(5);
      setContent("");
      setShowReviewForm(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-12 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground text-balance">
              What Our Customers Say
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-base md:text-lg text-muted-foreground mt-3 text-pretty font-body">
              Don&apos;t just take our word for it — hear from our satisfied customers across Brisbane
            </p>
          </FadeIn>
        </div>

        {isCarousel ? (
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentPage * (100 / perPage)}%)` }}
              >
                {activeReviews.map((review, index) => (
                  <div
                    key={`${review.name}-${index}`}
                    className="flex-shrink-0 px-2 sm:px-3"
                    style={{ width: `${100 / perPage}%` }}
                  >
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {pageCount > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-accent-tint text-foreground p-2.5 rounded-full shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-10"
                  aria-label="Previous reviews"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-accent-tint text-foreground p-2.5 rounded-full shadow-sm border border-border transition-colors focus:outline-none focus:ring-2 focus:ring-primary z-10"
                  aria-label="Next reviews"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>
              </>
            )}

            {/* Indicator Dots */}
            {pageCount > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                {Array.from({ length: pageCount }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`h-3 rounded-full transition-all duration-200 ${
                      idx === currentPage ? 'w-8 bg-primary' : 'w-3 bg-border hover:bg-primary/50'
                    }`}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedReviews.map((review, index) => (
              <StaggerItem key={`${review.name}-${index}`}>
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!isCarousel && (
          <div className="text-center mt-6 md:hidden">
            <Button
              variant="outline"
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="rounded-full border-border text-muted-foreground bg-transparent"
            >
              {showAllReviews ? (
                <><span className="text-sm">Show Less</span> <ChevronUp className="ml-2 h-4 w-4" /></>
              ) : (
                <><span className="text-sm">Show More Reviews</span> <ChevronDown className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </div>
        )}

        <div className="text-center mt-10">
          <FadeIn className="bg-white rounded-xl border border-border p-8 max-w-md mx-auto">
            <h3 className="text-lg font-heading-bold text-foreground mb-2">Share Your Experience</h3>
            <p className="text-sm text-muted-foreground font-body mb-5">
              We&apos;d love to hear about your experience.
            </p>
            <Button
              size="lg"
              onClick={() => setShowReviewForm(!showReviewForm)}
className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground font-nav text-sm"
            >
              Leave a Review
            </Button>

            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  className="mt-6 text-left overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-heading mb-4 text-sm text-foreground">Write Your Review</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Your Name</label>
                      <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="w-full p-2.5 border border-border rounded-lg text-sm text-foreground bg-background" placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Service Used</label>
                      <select value={serviceId} onChange={(e) => setServiceId(e.target.value)} className="w-full p-2.5 border border-border rounded-lg text-sm text-foreground bg-background">
                        {servicesOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} onClick={() => setRating(star)} className={`h-5 w-5 cursor-pointer transition-colors ${star <= rating ? "text-primary fill-primary" : "text-muted-foreground"}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Your Review</label>
                      <textarea rows={4} value={content} onChange={(e) => setContent(e.target.value)} required className="w-full p-2.5 border border-border rounded-lg text-sm text-foreground bg-background" placeholder="Tell us about your experience..."></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button type="submit" disabled={isSubmitting} className="rounded-full bg-accent hover:bg-accent-dark text-primary-foreground font-nav text-sm">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} className="rounded-full border-border bg-transparent font-nav text-sm">
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
