export function formatCategory(cat: any) {
  return {
    id: cat.id,
    title: cat.title,
    description: cat.description || '',
    image: cat.image || '',
    slug: cat.slug,
    sort_order: cat.sortOrder ?? 0,
    meta_title: cat.metaTitle || '',
    meta_description: cat.metaDescription || '',
    meta_keywords: cat.metaKeywords || '',
    og_title: cat.ogTitle || '',
    og_description: cat.ogDescription || '',
    og_image: cat.ogImage || '',
    og_type: cat.ogType || 'website',
    twitter_title: cat.twitterTitle || '',
    twitter_description: cat.twitterDescription || '',
    twitter_image: cat.twitterImage || '',
    twitter_card: cat.twitterCard || 'summary_large_image',
    canonical_url: cat.canonicalUrl || ''
  };
}
