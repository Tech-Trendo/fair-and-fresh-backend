import Link from "next/link";
import { MapPin } from "lucide-react";

// Brisbane CBD (Geoapify format: lat, lng).
const BRISBANE = {
  lat: -27.4698,
  lng: 153.0251,
};

// Bounding box covering greater Brisbane so the map shows the whole service area.
const MIN_LON = 152.9;
const MIN_LAT = -27.62;
const MAX_LON = 153.15;
const MAX_LAT = -27.32;

// Key-free OpenStreetMap embed — guaranteed to render on any deployment
// (no GEOAPIFY_API_KEY required), centered on Brisbane with a marker.
function buildOsmEmbedUrl() {
  const params = new URLSearchParams({
    // Order is minlon,minlat,maxlon,maxlat (URLSearchParams encodes the commas).
    bbox: `${MIN_LON},${MIN_LAT},${MAX_LON},${MAX_LAT}`,
    layer: "mapnik",
    marker: `${BRISBANE.lat},${BRISBANE.lng}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

export function ServiceAreaMap() {
  const src = buildOsmEmbedUrl();

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
          <div className="rounded-xl shadow-md border border-border overflow-hidden bg-white">
            <iframe
              src={src}
              title="Service area map of Brisbane and surrounding suburbs"
              loading="lazy"
              width="100%"
              height="400"
              style={{ border: 0, display: "block" }}
              allowFullScreen
            />
          </div>
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