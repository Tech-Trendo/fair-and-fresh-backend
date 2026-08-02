// Maps a drizzle service row (+ relations) into the snake_case API shape.
// The input type is intentionally loose (all nested fields optional) because
// this legacy mapper reads a few fields the schema doesn't have (e.g. c.name,
// t.name) — keeping them optional preserves behaviour without type fights.

interface CategoryRef {
  id?: string;
  name?: string;
  slug?: string;
}

interface FormattableService {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string | null;
  longDescription?: string | null;
  whatWeOffer?: unknown;
  createdAt?: Date | null;
  icon?: string | null;
  sortOrder?: number | null;
  basePrice?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  ogType?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  twitterCard?: string | null;
  canonicalUrl?: string | null;
  metaRobots?: string | null;
  servicesCategories?: { category: CategoryRef }[];
  category?: CategoryRef[];
  whatsIncluded?: {
    id?: string;
    serviceId?: string;
    title?: string;
    description?: string | null;
  }[];
  benefits?: {
    id?: string;
    serviceId?: string;
    title?: string;
    description?: string | null;
  }[];
  serviceTypes?: {
    id?: string;
    serviceId?: string;
    title?: string;
    description?: string | null;
  }[];
  images?: { id?: string; serviceId?: string; imageUrl?: string }[];
  testimonials?: {
    id?: string;
    serviceId?: string;
    name?: string;
    rating?: number | null;
    comment?: string | null;
    image?: string | null;
    role?: string | null;
  }[];
}

export function formatService(srv: FormattableService | null | undefined) {
  if (!srv) return null;

  const resolvedCategories = srv.servicesCategories
    ? srv.servicesCategories.map((sc) => sc.category)
    : (srv.category || []);

  return {
    id: srv.id,
    name: srv.name,
    short_description: srv.shortDescription || '',
    long_description: srv.longDescription || '',
    what_we_offer: srv.whatWeOffer || {},
    created_at: srv.createdAt ? srv.createdAt.toISOString() : new Date().toISOString(),
    slug: srv.slug,
    icon: srv.icon || '',
    sort_order: srv.sortOrder ?? 0,
    base_price: srv.basePrice != null ? String(srv.basePrice) : null,
    meta_title: srv.metaTitle || '',
    meta_description: srv.metaDescription || '',
    meta_keywords: srv.metaKeywords || '',
    og_title: srv.ogTitle || '',
    og_description: srv.ogDescription || '',
    og_image: srv.ogImage || '',
    og_type: srv.ogType || 'website',
    twitter_title: srv.twitterTitle || '',
    twitter_description: srv.twitterDescription || '',
    twitter_image: srv.twitterImage || '',
    twitter_card: srv.twitterCard || 'summary_large_image',
    canonical_url: srv.canonicalUrl || '',
    meta_robots: srv.metaRobots || '',
    whats_included: (srv.whatsIncluded || []).map((item) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    benefits: (srv.benefits || []).map((item) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    service_types: (srv.serviceTypes || []).map((item) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    images: (srv.images || []).map((item) => ({
      id: item.id,
      service_id: item.serviceId,
      image_url: item.imageUrl
    })),
    testimonials: (srv.testimonials || []).map((item) => ({
      id: item.id,
      service_id: item.serviceId,
      name: item.name,
      rating: item.rating,
      comment: item.comment,
      image: item.image,
      role: item.role
    })),
    categories: resolvedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug
    })),
    category_id: resolvedCategories.length > 0 ? resolvedCategories[0].id : null,
    category: resolvedCategories.length > 0 ? {
      id: resolvedCategories[0].id,
      name: resolvedCategories[0].name,
      slug: resolvedCategories[0].slug
    } : null
  };
}
