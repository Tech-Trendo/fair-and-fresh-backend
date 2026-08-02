"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { FadeIn } from "@/components/motion-wrapper";

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
  const [serviceAreas, setServiceAreas] = useState<
    { region: string; label: string; suburbs: { id: number; name: string; slug: string }[] }[]
  >([]);
  const [settings, setSettings] = useState({
    phone: "0430 799 567",
    email: "support@fairandfreshcleaning.com.au",
    address: "Brisbane and Surrounding Areas",
    facebook: "#",
    instagram: "#",
    twitter: "#",
    businessHours: "Monday - Sunday: 7AM - 7PM",
    aboutText: "Brisbane's trusted fabric cleaning specialists. Fair pricing, fresh results, guaranteed satisfaction.",
    copyrightText: "All rights reserved.",
    logoUrl: "/fair-fresh-logo.svg",
  });

  useEffect(() => {
    let active = true;

    fetch("/api/site-content?group=site_settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const map: Record<string, string> = {};
          data.results.forEach((item: { key: string; value: string }) => { map[item.key] = item.value; });
          setSettings((prev) => ({
            ...prev,
            phone: map.site_phone || prev.phone,
            email: map.site_email || prev.email,
            address: map.site_address || prev.address,
            facebook: map.site_facebook || prev.facebook,
            instagram: map.site_instagram || prev.instagram,
            twitter: map.site_twitter || prev.twitter,
            businessHours: map.site_business_hours || prev.businessHours,
            logoUrl: map.site_logo || prev.logoUrl,
          }));
        }
      })
      .catch(() => {});

    fetch("/api/site-content?group=footer")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const map: Record<string, string> = {};
          data.results.forEach((item: { key: string; value: string }) => { map[item.key] = item.value; });
          setSettings((prev) => ({
            ...prev,
            aboutText: map.footer_about_text || prev.aboutText,
            copyrightText: map.footer_copyright_text || prev.copyrightText,
          }));
        }
      })
      .catch(() => {});

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
      .catch(() => {});

    fetch("/api/suburbs?grouped=true")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.groups)) {
          setServiceAreas(data.groups);
        }
      })
      .catch(() => {});

    return () => { active = false; };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand + Description */}
          <FadeIn>
            <div className="flex items-center mb-4">
              <Link href="/" className="inline-block group">
                <Image
                  src={settings.logoUrl}
                  alt="Cleaning Services"
                  width={360}
                  height={78}
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-muted-foreground text-sm mb-6 text-pretty">
              {settings.aboutText}
            </p>
            <div className="flex space-x-3">
              <a href={settings.facebook} aria-label="Facebook" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <FaFacebook size={16} />
              </a>
              <a href={settings.instagram} aria-label="Instagram" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <FaInstagram size={16} />
              </a>
              <a href={settings.twitter} aria-label="Twitter" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors">
                <FaTwitter size={16} />
              </a>
            </div>
          </FadeIn>

          {/* Resources / Services */}
          <FadeIn delay={0.1}>
            <h3 className="text-sm font-heading text-foreground mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-body"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>

          {/* Quick Links */}
          <FadeIn delay={0.2}>
            <h3 className="text-sm font-heading text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/#reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  Customer Reviews
                </Link>
              </li>
              <li>
                <Link href="/quote" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link href="/brisbane" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  Service Areas
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  All Services
                </Link>
              </li>
            </ul>
          </FadeIn>

          {/* Contact / Book */}
          <FadeIn delay={0.3}>
            <h3 className="text-sm font-heading text-foreground mb-4">Contact & Booking</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <a href={`mailto:${settings.email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body break-all">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground flex-shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm text-muted-foreground font-body">
                  {settings.address}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/quote">
                <button className="w-full bg-red-600 hover:bg-red-700 text-primary-foreground text-sm font-nav rounded-full px-5 py-2.5 transition-colors">
                  Book Online
                </button>
              </Link>
            </div>
          </FadeIn>
        </div>

        {/* Service Areas (suburb hubs) */}
        {serviceAreas.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-sm font-heading text-foreground mb-4">Service Areas</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
              {serviceAreas.map((group) => (
                <div key={group.region}>
                  <h4 className="text-xs font-nav text-muted-foreground uppercase tracking-wider mb-2">
                    {group.label}
                  </h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                    {group.suburbs.slice(0, 10).map((s) => (
                      <Link
                        key={s.slug}
                        href={`/suburbs/${s.slug}`}
                        className="text-xs text-muted-foreground hover:text-primary transition-colors font-body"
                      >
                        {s.name}
                      </Link>
                    ))}
                    {group.suburbs.length > 10 && (
                      <span className="text-xs text-muted-foreground/70 font-body">+{group.suburbs.length - 10} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Copyright bar */}
        <div className="border-t border-border mt-10 pt-6 text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {currentYear} {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
