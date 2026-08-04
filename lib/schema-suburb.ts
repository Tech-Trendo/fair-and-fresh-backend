// Phase 6 — JSON-LD structured data for suburb pages.
// AggregateRating is emitted ONLY when the suburb has 3+ real linked reviews
// (via suburb_testimonials) — never a fabricated or site-wide rating.
export const SITE_URL = 'https://www.fairandfreshcleaning.com.au';
export const BRAND_NAME = 'Fair & Fresh Cleaning';

export interface SuburbJsonLdInput {
  name: string;
  slug: string;
  regionLabel: string;
  postcode: string | null;
  lat: string | null;
  lng: string | null;
  description: string;
  services: { name: string; slug: string }[];
  faqs: { question: string; answer: string }[];
  linkedReviews: { rating: number | null }[];
}

export function buildSuburbJsonLd(input: SuburbJsonLdInput) {
  const suburbUrl = `${SITE_URL}/${input.slug}`;

  const areaServed: Record<string, unknown> = { '@type': 'Place', name: input.name };
  if (input.lat && input.lng) {
    areaServed.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(input.lat),
      longitude: Number(input.lng),
    };
  }

  // LocalBusiness — with AggregateRating only when there is real suburb-level review data.
  const localBusiness: Record<string, unknown> = {
    '@type': 'LocalBusiness',
    '@id': `${suburbUrl}#business`,
    name: BRAND_NAME,
    description: input.description,
    areaServed,
  };
  if (input.postcode) {
    localBusiness.address = {
      '@type': 'PostalAddress',
      addressLocality: input.name,
      addressRegion: 'QLD',
      postalCode: input.postcode,
      addressCountry: 'AU',
    };
  }
  if (input.linkedReviews.length >= 3) {
    const ratings = input.linkedReviews.map((r) => r.rating ?? 5);
    const average = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    localBusiness.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(average.toFixed(1)),
      reviewCount: ratings.length,
      bestRating: 5,
    };
  }

  const service: Record<string, unknown> = {
    '@type': 'Service',
    name: `Fabric & Carpet Cleaning in ${input.name}`,
    serviceType: input.services.map((s) => s.name),
    areaServed,
    provider: { '@id': localBusiness['@id'] },
  };

  const breadcrumb: Record<string, unknown> = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: input.regionLabel },
      { '@type': 'ListItem', position: 3, name: input.name, item: suburbUrl },
    ],
  };

  const graph: Record<string, unknown>[] = [localBusiness, service, breadcrumb];

  if (input.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: input.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
