"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
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
  const [menuItems, setMenuItems] = useState(servicesMenu);
  const [phone, setPhone] = useState("0430 799 567");
  const [logoUrl, setLogoUrl] = useState("/fair-fresh-logo.svg");
  const [brandName, setBrandName] = useState("Fair & Fresh Cleaning");

  useEffect(() => {
    let active = true;
    fetch("/api/site-content?group=site_settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const phoneSetting = data.results.find((s: any) => s.key === "site_phone");
          if (phoneSetting) setPhone(phoneSetting.value);
          const logoSetting = data.results.find((s: any) => s.key === "site_logo");
          if (logoSetting) setLogoUrl(logoSetting.value);
          const brandSetting = data.results.find((s: any) => s.key === "site_brand_name");
          if (brandSetting) setBrandName(brandSetting.value);
        }
      })
      .catch(() => {});

    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const mapped = data.results.map((srv: any) => ({
            name: srv.name,
            href: `/services/${srv.slug}`,
          }));
          setMenuItems(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch header services:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={logoUrl}
                alt={brandName}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <div className="hidden sm:block h-8 w-px bg-border" />
              <span className="hidden sm:inline text-lg font-heading text-foreground/90 tracking-tight">
                {brandName}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-nav text-sm">
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="text-foreground hover:text-primary transition-colors font-nav text-sm flex items-center gap-1 bg-transparent border-0 cursor-pointer">
                Services
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    className="absolute top-full left-0 w-56 pt-2"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="bg-white shadow-lg rounded-xl border border-border overflow-hidden">
                      <div className="py-1">
                        {menuItems.map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="block px-4 py-2 text-sm text-foreground hover:text-primary hover:bg-accent-tint/50 transition-colors font-body"
                          >
                            {service.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/brisbane" className="text-foreground hover:text-primary transition-colors font-nav text-sm">
              Service Areas
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors font-nav text-sm">
              About
            </Link>
            <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-nav text-sm">
              Blog
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-nav text-sm">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 font-nav text-sm">
              <Link href="/quote">Get Free Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="mr-3">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
            <button className="text-primary bg-transparent border-0 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-border overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="flex flex-col space-y-3">
                <Link href="/" className="text-foreground hover:text-primary transition-colors font-nav text-sm" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <div>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="text-foreground hover:text-primary transition-colors font-nav text-sm flex items-center justify-between w-full bg-transparent border-0 cursor-pointer"
                  >
                    Services
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        className="mt-2 ml-4 space-y-1 overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {menuItems.map((service) => (
                          <Link
                            key={service.name}
                            href={service.href}
                            className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors font-body"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {service.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link href="/brisbane" className="text-foreground hover:text-primary transition-colors font-nav text-sm" onClick={() => setIsMenuOpen(false)}>
                  Service Areas
                </Link>
                <Link href="/about" className="text-foreground hover:text-primary transition-colors font-nav text-sm" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
                <Link href="/blog" className="text-foreground hover:text-primary transition-colors font-nav text-sm" onClick={() => setIsMenuOpen(false)}>
                  Blog
                </Link>
                <Link href="/contact" className="text-foreground hover:text-primary transition-colors font-nav text-sm" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
                <div className="pt-2 space-y-2">
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-primary font-nav text-sm">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {phone}
                  </a>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-nav">
                    <Link href="/quote" onClick={() => setIsMenuOpen(false)}>Get Free Quote</Link>
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
