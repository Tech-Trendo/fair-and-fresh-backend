// Server-side helper for Geoapify Static Maps API (free tier: 3,000 req/day, CDN-cached responses).
// Reference: https://apidocs.geoapify.com/docs/static-maps/
// Returns null (renders nothing) when the API key is not configured — callers must not
// fall back to a placeholder image or a default map center.

export interface MapSuburb {
  lat: string | number | null;
  lng: string | number | null;
  name: string;
  region?: string;
}

export function buildStaticMapUrl(suburb: MapSuburb): string | null {
  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey || suburb.lat === null || suburb.lat === undefined || suburb.lng === null || suburb.lng === undefined) {
    return null;
  }

  const lat = Number(suburb.lat);
  const lng = Number(suburb.lng);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

  // Note Geoapify uses lon,lat order (opposite of Google). Hex color is URL-encoded
  // by URLSearchParams (# -> %23). Marker type defaults to "material".
  const marker = `lonlat:${lng},${lat};type:material;color:#314c9f;size:medium`;

  const params = new URLSearchParams({
    style: "osm-bright",
    width: "640",
    height: "400",
    center: `lonlat:${lng},${lat}`,
    zoom: "13",
    scaleFactor: "2",
    marker,
    apiKey,
  });

  return `https://maps.geoapify.com/v1/staticmap?${params.toString()}`;
}
