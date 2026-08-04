export function formatPage(page: any) {
  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    meta_title: page.metaTitle || '',
    meta_description: page.metaDescription || '',
    meta_keywords: page.metaKeywords || '',
    og_title: page.ogTitle || '',
    og_description: page.ogDescription || '',
    og_image: page.ogImage || '',
    og_type: page.ogType || 'website',
    twitter_title: page.twitterTitle || '',
    twitter_description: page.twitterDescription || '',
    twitter_image: page.twitterImage || '',
    twitter_card: page.twitterCard || 'summary_large_image',
    canonical_url: page.canonicalUrl || '',
    meta_robots: page.metaRobots || ''
  };
}
