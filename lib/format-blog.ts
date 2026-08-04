export function formatBlog(blog: any) {
  const resolvedCategories = blog.blogsCategories
    ? blog.blogsCategories.map((bc: any) => bc.category)
    : (blog.category || []);
  return {
    id: blog.id,
    title: blog.title,
    featured_image: blog.featuredImage || '',
    description: blog.description || '',
    slug: blog.slug,
    meta_title: blog.metaTitle || '',
    meta_description: blog.metaDescription || '',
    meta_keywords: blog.metaKeywords || '',
    og_title: blog.ogTitle || '',
    og_description: blog.ogDescription || '',
    og_image: blog.ogImage || '',
    og_type: blog.ogType || 'article',
    twitter_title: blog.twitterTitle || '',
    twitter_description: blog.twitterDescription || '',
    twitter_image: blog.twitterImage || '',
    twitter_card: blog.twitterCard || 'summary_large_image',
    canonical_url: blog.canonicalUrl || '',
    created_at: blog.createdAt
      ? (typeof blog.createdAt === 'string' ? blog.createdAt : blog.createdAt.toISOString())
      : new Date().toISOString(),
    category: resolvedCategories
  };
}
