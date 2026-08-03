import { buildStaticMapUrl, type MapSuburb } from "@/lib/geoapify";
import Link from "next/link";
import { MapPin } from "lucide-react";

const BRISBANE: MapSuburb = {
  lat: -27.4698,
  lng: 153.0251,
  name: "Brisbane",
  region: "queensland",
};

export function ServiceAreaMap() {
  const src = buildStaticMapUrl(BRISBANE);
  if (!src) return null;

  return (
    <section id="service-areas" className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-1.5 bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-4">
            <MapPin className="h-3.5 w-3.5" />
            Locally Owned
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading-bold text-foreground mb-3 text-balance">
            Serving Brisbane &amp; Surrounding Areas
          </h2>
          <p className="text-base text-muted-foreground font-body max-w-2xl mx-auto">
            From the city to the suburbs, our mobile cleaning team brings fair pricing and fresh results to homes and businesses across Greater Brisbane.
          </p>
        </div>

        {/* Map */}
        <div className="max-w-5xl mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element -- server-rendered static map image; keeps the page light (no client map lib) */}
          <img
            src={src}
            alt="Service area map of Brisbane and surrounding suburbs"
            loading="lazy"
            width={640}
            height={400}
            className="rounded-xl shadow-md border border-border w-full h-auto"
          />
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground font-body mb-4">
              We cover all of Brisbane&apos;s major suburbs — from the CBD to the North and South sides.
            </p>
            <Link
              href="/brisbane"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-nav text-sm"
            >
              <MapPin className="h-4 w-4" />
              View All Service Areas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}