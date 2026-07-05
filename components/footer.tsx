"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion-wrapper";

const fallbackServices = [
  { name: "Carpet Cleaning", slug: "carpet-cleaning" },
  { name: "Mattress Cleaning", slug: "mattress-cleaning" },
  { name: "Rug Cleaning", slug: "rug-cleaning" },
  { name: "Upholstery Cleaning", slug: "upholstery-cleaning" },
  { name: "Curtain Cleaning", slug: "curtain-cleaning" },
  { name: "Car Seat Cleaning", slug: "car-seat-cleaning" },
  { name: "Flood Damage Restoration", slug: "flood-damage-restoration" },
];

export function Footer() {
  const [services, setServices] = useState(fallbackServices);

  useEffect(() => {
    let active = true;
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          setServices(
            data.results.map((srv: { name: string; slug: string }) => ({
              name: srv.name,
              slug: srv.slug,
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to fetch footer services:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StaggerItem>
            <Image
              src="/fair-fresh-logo.svg"
              alt="Fair and Fresh Cleaning"
              width={150}
              height={50}
              className="h-12 w-auto mb-4"
            />
            <p className="text-background/80 mb-4 text-pretty">
              Brisbane&apos;s trusted fabric cleaning specialists. Fair pricing, fresh results, guaranteed
              satisfaction.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:support@fairandfreshcleaning.com.au"
                aria-label="Email us"
                className="text-background/60 hover:text-background transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <Facebook className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-background/60 hover:text-background cursor-pointer transition-colors" />
            </div>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-background/80">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="hover:text-background transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li>
                <Link href="/about" className="hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-background transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="hover:text-background transition-colors">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-background transition-colors">
                  Get Quote
                </Link>
              </li>
              <li>
                <Link href="/brisbane" className="hover:text-background transition-colors">
                  Service Areas
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-background transition-colors">
                  Emergency Service
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-background transition-colors">
                  All Services
                </Link>
              </li>
            </ul>
          </StaggerItem>

          <StaggerItem>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+61430799567" className="hover:text-background transition-colors">
                  0430 799 567
                </a>
              </div>
              <a
                href="mailto:support@fairandfreshcleaning.com.au"
                className="flex items-center gap-3 hover:text-background transition-colors"
              >
                <FaEnvelope className="h-4 w-4 shrink-0" />
                <span className="break-all">support@fairandfreshcleaning.com.au</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                <div>
                  <div>Brisbane and Surrounding Areas</div>
                  <div className="text-sm">Gold Coast and Sunshine Coast</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-background/10 rounded-lg">
              <div className="text-sm font-semibold text-primary">Business Hours</div>
              <div className="text-sm text-background/80 mt-1">
                <div>Monday - Sunday: 7AM - 7PM</div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>

        <motion.div
          className="border-t border-background/20 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-background/60 text-sm">
              © {currentYear} Fair and Fresh Cleaning. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-background/60 hover:text-background text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>

        <motion.a
          href="https://wa.me/+610430799567?text=Hello%20Fair%20and%20Fresh%20Cleaning%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 overflow-hidden bg-[#25D366] text-white flex items-center justify-center shadow-lg transition-colors duration-600 z-50 rounded-full group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5, type: "spring" }}
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <FaWhatsapp size={24} />
          </div>
          <div className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-700 ease-in-out hidden md:block">
            <span className="px-2">Chat on WhatsApp</span>
          </div>
        </motion.a>
      </div>
    </footer>
  );
}
