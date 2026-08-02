import { buildStaticMapUrl, type MapSuburb } from "@/lib/geoapify";

export function SuburbMap({ suburb }: { suburb: MapSuburb }) {
  const src = buildStaticMapUrl(suburb);
  // No coordinates or no API key configured -> render nothing (never a broken image or
  // a default-center placeholder).
  if (!src) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- server-rendered static map image; keeps 75+ pages light (no client map lib, no image-optimization pass-through)
    <img
      src={src}
      alt={`Service area map for ${suburb.name}${suburb.region ? `, ${suburb.region.replace(/-/g, " ")}` : ""}`}
      loading="lazy"
      width={640}
      height={400}
      className="rounded-xl shadow-md w-full h-auto"
    />
  );
}
