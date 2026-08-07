"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const servicesMenu = [
  { name: "Bond Cleaning", href: "/services/bond-cleaning-brisbane" },
  { name: "Carpet Cleaning", href: "/services/carpet-cleaning-brisbane" },
  { name: "Mattress Cleaning", href: "/services/mattress-cleaning-brisbane" },
  { name: "Rug Cleaning", href: "/services/rug-cleaning-brisbane" },
  { name: "Lawn Mowing", href: "/services/lawn-mowing-brisbane" },
  { name: "Upholstery Cleaning", href: "/services/upholstery-couch-cleaning-brisbane" },
  { name: "Curtain Cleaning", href: "/services/curtains-cleaning-brisbane" },
  { name: "Flood Damage Restoration", href: "/services/flood-damage-restoration-brisbane" },
];

const homeSectionLinks = [
  { name: "Steam Cleaning", href: "/home-services/steam-cleaning" },
  { name: "Home Maintenance", href: "/home-services/home-maintenance" },
  { name: "Specialized Cleaning & Restoration", href: "/home-services/specialized-cleaning-restoration" },
];

export function Header({ logoUrl, phone }: { logoUrl?: string; phone?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [menuItems, setMenuItems] = useState(servicesMenu);
  const [logo, setLogo] = useState(logoUrl || "/fair-fresh-logo.svg");
  const [phoneNumber, setPhoneNumber] = useState(phone || "0430 799 567");

  const hasServerProps = logoUrl !== undefined || phone !== undefined;

  const fetchAllServices = async (): Promise<any[]> => {
    const all: any[] = [];
    let url: string | null = "/api/services?page_size=100";
    while (url) {
      const res: Response = await fetch(url);
      const data: { results?: any[]; next?: string | null } = await res.json();
      if (data && Array.isArray(data.results)) all.push(...data.results);
      url = data.next || null;
    }
    return all;
  };

  useEffect(() => {
    let active = true;
    if (!hasServerProps) {
      fetch("/api/site-content?group=site_settings")
        .then((res) => res.json())
        .then((data) => {
          if (active && data && Array.isArray(data.results)) {
            const phoneSetting = data.results.find((s: any) => s.key === "site_phone");
            if (phoneSetting) setPhoneNumber(phoneSetting.value);
            const logoSetting = data.results.find((s: any) => s.key === "site_logo");
            if (logoSetting) setLogo(logoSetting.value);
          }
        })
        .catch(() => {});
    }

    fetchAllServices()
      .then((all) => {
        if (active && Array.isArray(all)) {
          const mapped = all.map((srv: any) => ({
            name: srv.name,
            href: `/services/${srv.slug}`,
          }));
          setMenuItems([...homeSectionLinks, ...mapped]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch header services:", err);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center py-2">
            <Link href="/" className="flex items-center group">
              <Image
                src={logo}
                alt="Cleaning Services"
                width={360}
                height={78}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-nav text-sm leading-none py-2">
              Home
            </Link>
            <div
              className="relative inline-flex items-center"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors font-nav text-sm leading-none bg-transparent border-0 cursor-pointer py-2">
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
                      <div className="py-1 max-h-80 overflow-y-auto pl-1 pr-2">
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
            <Link href="/brisbane" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-nav text-sm leading-none py-2">
              Service Areas
            </Link>
            <Link href="/about" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-nav text-sm leading-none py-2">
              About
            </Link>
            <Link href="/blog" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-nav text-sm leading-none py-2">
              Blog
            </Link>
            <Link href="/contact" className="inline-flex items-center text-foreground hover:text-primary transition-colors font-nav text-sm leading-none py-2">
              Contact
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center self-center">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-primary-foreground rounded-full px-5 py-2.5 font-nav text-sm leading-none">
              <Link href="/quote">Get Free Quote</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="mr-3" aria-label={`Call us on ${phoneNumber}`}>
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>
            <button
              className="text-primary bg-transparent border-0 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
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
                    aria-expanded={isServicesOpen}
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
                        <div className="max-h-64 overflow-y-auto pr-1">
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
                        </div>
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
                  <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="flex items-center gap-2 text-primary font-nav text-sm">
                    
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {phoneNumber}
                  </a>
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-primary-foreground rounded-full font-nav">
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
