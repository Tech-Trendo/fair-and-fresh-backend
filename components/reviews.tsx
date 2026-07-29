"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
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
    text: "Professional mattress cleaning service. My allergies have improved significantly since the cleaning. Highly recommend Fair and Fresh!",
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
    <section id="reviews" className="py-16 md:py-24 bg-background">
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

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedReviews.map((review, index) => (
            <StaggerItem key={`${review.name}-${index}`}>
              <div className="bg-white rounded-xl border border-border p-6 h-full flex flex-col">
                {/* Star rating */}
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                  ))}
                </div>
                {/* Quote text */}
                <p className="text-sm text-muted-foreground font-body leading-relaxed flex-grow mb-4">
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
            </StaggerItem>
          ))}
        </StaggerContainer>

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

        <div className="text-center mt-10">
          <FadeIn className="bg-white rounded-xl border border-border p-8 max-w-md mx-auto">
            <h3 className="text-lg font-heading-bold text-foreground mb-2">Share Your Experience</h3>
            <p className="text-sm text-muted-foreground font-body mb-5">
              We&apos;d love to hear about your experience with Fair and Fresh Cleaning.
            </p>
            <Button
              size="lg"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-sm"
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
                      <Button type="submit" disabled={isSubmitting} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-sm">
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
