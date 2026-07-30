export function formatService(srv: any) {
  const resolvedCategories = srv.servicesCategories
    ? srv.servicesCategories.map((sc: any) => sc.category)
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
    whats_included: (srv.whatsIncluded || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    benefits: (srv.benefits || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    service_types: (srv.serviceTypes || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    images: (srv.images || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      image_url: item.imageUrl
    })),
    testimonials: (srv.testimonials || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      name: item.name,
      rating: item.rating,
      comment: item.comment,
      image: item.image,
      role: item.role
    })),
    categories: resolvedCategories.map((c: any) => ({
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
