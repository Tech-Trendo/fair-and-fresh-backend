"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/motion-wrapper";

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

  // Form states
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
            if (mapped.length > 0) {
              setServiceId(mapped[0].id);
            }
          }
        })
        .catch((err) => console.error("Failed to load services in review form", err));
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author,
          serviceId,
          rating,
          content,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

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
    <section id="reviews" className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-balance">
              What Our Customers Say
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-600 mt-4 text-pretty">
              Don&apos;t just take our word for it - hear from our satisfied customers across Brisbane
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {displayedReviews.map((review, index) => (
            <StaggerItem key={`${review.name}-${index}`}>
              <Card
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full"
              >
                <CardContent className="p-4 md:p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Quote className="h-6 md:h-8 w-6 md:w-8 text-blue-600 opacity-50" />
                  </div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 md:h-5 w-4 md:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm md:text-base text-pretty flex-grow">
                    &quot;{review.text}&quot;
                  </p>
                  <div className="border-t pt-4 mt-auto">
                    <div className="font-semibold text-gray-900 text-sm md:text-base">{review.name}</div>
                    <div className="text-xs md:text-sm text-gray-600">{review.location}</div>
                    <div className="text-xs md:text-sm text-blue-600 font-medium mt-1">{review.service}</div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mb-8 md:hidden">
          <Button
            variant="outline"
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="transition-all duration-300 hover:scale-105"
          >
            {showAllReviews ? (
              <>
                Show Less <ChevronUp className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Show More Reviews <ChevronDown className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center">
          <ScaleIn className="bg-blue-50 rounded-lg p-6 md:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base text-pretty">
              We&apos;d love to hear about your experience with Fair and Fresh Cleaning. Your feedback helps
              us improve and helps other customers make informed decisions.
            </p>
            <Button
              size="lg"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-base md:text-lg px-6 md:px-8 transition-all duration-300 hover:scale-105"
            >
              Leave a Review
            </Button>

            <AnimatePresence>
              {showReviewForm && (
                <motion.div
                  className="mt-8 text-left bg-white p-4 md:p-6 rounded-lg shadow-sm overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.4, 0, 1] }}
                >
                  <h4 className="font-semibold mb-4 text-sm md:text-base">Write Your Review</h4>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        required
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-900"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Service Used
                      </label>
                      <select 
                        value={serviceId}
                        onChange={(e) => setServiceId(e.target.value)}
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-900 bg-white"
                      >
                        {servicesOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            onClick={() => setRating(star)}
                            className={`h-5 md:h-6 w-5 md:w-6 cursor-pointer transition-colors duration-200 ${
                              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                        Your Review
                      </label>
                      <textarea
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="w-full p-2 md:p-3 border border-gray-300 rounded-lg text-sm md:text-base text-gray-900"
                        placeholder="Tell us about your experience..."
                      ></textarea>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="submit" disabled={isSubmitting} className="transition-all duration-300 hover:scale-105">
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowReviewForm(false)}
                        className="transition-all duration-300 hover:scale-105"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
