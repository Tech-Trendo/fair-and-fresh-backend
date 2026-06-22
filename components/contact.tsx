import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export function Contact() {
  return (
    <section id="contact" className="py-12 md:py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-balance animate-fade-in">
            Get Your Free Quote Today
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 text-pretty animate-fade-in animation-delay-200">
            Ready for fresh, clean fabrics? Contact us for a free, no-obligation quote
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="animate-fade-in-left">
            <Card className="transition-all duration-300 hover:shadow-lg border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Phone className="h-5 md:h-6 w-5 md:w-6 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-foreground">Phone</div>
                      <div className="text-muted-foreground text-sm md:text-base">0430 799 567</div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Available Monday - Saturday
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Mail className="h-5 md:h-6 w-5 md:w-6 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-foreground">Email</div>
                      <div className="text-muted-foreground text-sm md:text-base break-all">
                        support@fairandfreshcleaning.com.au
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        We respond within 2 hours
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 md:h-6 w-5 md:w-6 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-foreground">Service Area</div>
                      <div className="text-muted-foreground text-sm md:text-base">
                        Brisbane and Surrounding Areas
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Including Gold Coast and Sunshine Coast
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 md:h-6 w-5 md:w-6 text-primary flex-shrink-0" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-foreground">Business Hours</div>
                      <div className="text-muted-foreground text-sm md:text-base">
                        <div>Mon - Sat: 7:00 AM - 6:00 PM</div>
                        <div>Sunday: Closed</div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
                        Emergency services available
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-semibold text-primary mb-2 text-sm md:text-base">
                    Quick Response Guarantee
                  </h4>
                  <p className="text-primary/80 text-xs md:text-sm">
                    We respond to all inquiries within 2 hours during business hours. Same-day service
                    available for urgent cleaning needs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-right animation-delay-200">
            <Card className="transition-all duration-300 hover:shadow-lg border-0 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-foreground">Get Free Quote</h3>

                <form className="space-y-4 md:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                      Service Needed *
                    </label>
                    <select
                      required
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                    >
                      <option value="">Select a service</option>
                      <option value="carpet">Carpet Cleaning</option>
                      <option value="mattress">Mattress Cleaning</option>
                      <option value="rug">Rug Cleaning</option>
                      <option value="upholstery">Upholstery Cleaning</option>
                      <option value="curtain">Curtain Cleaning</option>
                      <option value="car-seat">Car Seat Cleaning</option>
                      <option value="multiple">Multiple Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                      Property Address
                    </label>
                    <input
                      type="text"
                      placeholder="Brisbane address for accurate quote"
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                      Additional Details
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us about the size of the area, any specific stains or concerns..."
                      className="w-full p-2 md:p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm md:text-base bg-background resize-none"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full text-base md:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get Free Quote
                  </Button>

                  <p className="text-xs md:text-sm text-muted-foreground text-center">
                    * Required fields. We&apos;ll contact you within 2 hours with your personalized quote.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Need more detailed information?</p>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Visit Our Contact Page
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
