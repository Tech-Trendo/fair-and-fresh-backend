"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sofa, Car, Bed, Home, Shirt, Sparkles, Droplets, Scissors } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

const services = [
  {
    icon: Home,
    title: "Carpet Cleaning",
    url: "/services/carpet-cleaning",
    image: "/professional-carpet-cleaning.png",
  },
  {
    icon: Bed,
    title: "Mattress Cleaning",
    url: "/services/mattress-cleaning",
    image: "/mattress-deep-cleaning-service.jpg",
  },
  {
    icon: Sparkles,
    title: "Rug Cleaning",
    url: "/services/rug-cleaning",
    image: "/professional-rug-cleaning-service.jpg",
  },
  {
    icon: Sofa,
    title: "Upholstery Cleaning",
    url: "/services/upholstery-cleaning",
    image: "/upholstery-cleaning-photo.jpg",
  },
  {
    icon: Shirt,
    title: "Curtain Cleaning",
    url: "/services/curtain-cleaning",
    image: "/curtain-cleaning-photo.jpg",
  },
  {
    icon: Car,
    title: "Car Seat Cleaning",
    url: "/services/car-seat-cleaning",
    image: "/car-seat-cleaning-photo.jpg",
  },
  {
    icon: Car,
    title: "Car Detailing",
    url: "/services/car-detailing",
    image: "/car-detailing-hero-image.jpg",
  },
  {
    icon: Home,
    title: "Bond Cleaning",
    url: "/services/bond-cleaning",
    image: "/bond-cleaning-hero-image.png",
  },
  {
    icon: Scissors,
    title: "Lawn Mowing",
    url: "/services/lawn-mowing",
    image: "/lawn-mowing-hero-image.jpg",
  },
  {
    icon: Droplets,
    title: "Flood Damage Restoration",
    url: "/services/flood-damage-restoration",
    image: "/flood-damage-restoration-water-extraction-emergenc.jpg",
  },
];

export function Services() {
  return (
    <section id="services" className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-balance">
              Our Professional Cleaning Services
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-600 mt-4 max-w-3xl mx-auto text-pretty">
              We specialize in fabric cleaning with state-of-the-art equipment and eco-friendly solutions. Every
              service comes with our satisfaction guarantee.
            </p>
          </FadeIn>
        </div>

        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <Card
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group border-0 h-full"
              >
                <CardContent className="p-0 h-full">
                  <Link href={service.url} className="block h-full">
                    <div className="relative overflow-hidden h-56 md:h-64">
                      <Image
                        src={service.image || "/placeholder.svg"}
                        alt={service.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                      <div className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                        <service.icon className="h-5 w-5 text-primary" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-accent transition-colors duration-300">
                          {service.title}
                        </h3>
                        <Button
                          variant="secondary"
                          className="w-full bg-white text-primary hover:bg-accent hover:text-white transition-all duration-300 font-semibold"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn y={20} delay={0.4} className="text-center mt-8 md:mt-12">
          <Link href="/quote">
            <Button
              size="lg"
              className="text-base md:text-lg px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Free Quote for All Services
            </Button>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
