"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const servicesMenu = [
  { name: "Bond Cleaning", href: "/services/bond-cleaning" },
  { name: "Carpet Cleaning", href: "/services/carpet-cleaning" },
  { name: "Mattress Cleaning", href: "/services/mattress-cleaning" },
  { name: "Rug Cleaning", href: "/services/rug-cleaning" },
  { name: "Lawn Mowing", href: "/services/lawn-mowing" },
  { name: "Car Detailing", href: "/services/car-detailing" },
  { name: "Upholstery Cleaning", href: "/services/upholstery-cleaning" },
  { name: "Curtain Cleaning", href: "/services/curtain-cleaning" },
  { name: "Car Seat Cleaning", href: "/services/car-seat-cleaning" },
  { name: "Flood Damage Restoration", href: "/services/flood-damage-restoration" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <motion.header
      className="bg-card shadow-sm sticky top-0 z-50 border-b border-border"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.4, 0, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/fair-fresh-logo.svg"
                alt="Fair and Fresh Cleaning"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </Link>
            <div
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1 bg-transparent border-0 cursor-pointer">
                Services
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Animated Dropdown Menu */}
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className="absolute top-full left-0 w-64 pt-2"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.4, 0, 1] }}
                  >
                    <div className="bg-card shadow-lg rounded-lg border border-border overflow-hidden">
                      <div className="py-2">
                        {servicesMenu.map((service, index) => (
                          <motion.div
                            key={service.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                          >
                            <Link
                              href={service.href}
                              className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200"
                            >
                              {service.name}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/brisbane"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Service Areas
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-medium">
              About
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-primary">
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-semibold">0430 799 567</span>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/quote">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <a href="tel:0430799567">
              <Phone className=" md:hidden h-7 w-7 mr-4 inline-block text-primary" />
            </a>
            <button className="md:hidden text-primary bg-transparent border-0 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation — AnimatePresence for smooth slide */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
            >
              <nav className="flex flex-col space-y-4">
                <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
                  Home
                </Link>
                <div>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="text-foreground hover:text-primary transition-colors font-medium flex items-center justify-between w-full bg-transparent border-0 cursor-pointer"
                  >
                    Services
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        className="mt-2 ml-4 space-y-2 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.4, 0, 1] }}
                      >
                        {servicesMenu.map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  href="/brisbane"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Service Areas
                </Link>
                <Link
                  href="/about"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  Contact
                </Link>
                <div className="flex items-center text-primary pt-2">
                  <Phone className="h-4 w-4 mr-2" />
                  <span className="font-semibold">0430 799 567</span>
                </div>
                <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/quote">Get Quote</Link>
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
