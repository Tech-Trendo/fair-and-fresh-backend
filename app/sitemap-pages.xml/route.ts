import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://www.fairandfreshcleaning.com.au";

function isIndexable(metaRobots: string | null | undefined): boolean {
  if (!metaRobots) return true;
  return !metaRobots.toLowerCase().includes("noindex");
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  return `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export async function GET() {
  const [dbCategories, dbBlogCategories, dbBlogs, dbHomeCategories] = await Promise.all([
    db.query.serviceCategories.findMany({
      columns: { slug: true, canonicalUrl: true, metaRobots: true },
    }),
    db.query.blogCategories.findMany({
      columns: { slug: true, canonicalUrl: true, metaRobots: true },
    }),
    db.query.blogs.findMany({
      columns: { slug: true, createdAt: true, canonicalUrl: true, metaRobots: true },
    }),
    db.query.homeServiceCategories.findMany({
      columns: { slug: true, canonicalUrl: true, metaRobots: true },
    }),
  ]);

  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/quote`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/brisbane`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const categoryPages = dbCategories
    .filter((c) => isIndexable(c.metaRobots))
    .map((c) => ({
      url: toAbsoluteUrl(c.canonicalUrl || `/category/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  const blogCategoryPages = dbBlogCategories
    .filter((c) => isIndexable(c.metaRobots))
    .map((c) => ({
      url: toAbsoluteUrl(c.canonicalUrl || `/blog/category/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));

  const blogPages = dbBlogs
    .filter((b) => isIndexable(b.metaRobots))
    .map((b) => ({
      url: toAbsoluteUrl(b.canonicalUrl || `/blog/${b.slug}`),
      lastModified: b.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const homeCategoryPages = dbHomeCategories
    .filter((c) => isIndexable(c.metaRobots))
    .map((c) => ({
      url: toAbsoluteUrl(c.canonicalUrl || `/home-services/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const entries = [...staticPages, ...categoryPages, ...homeCategoryPages, ...blogCategoryPages, ...blogPages]
    .map(
      (e) =>
        `<url><loc>${e.url}</loc><lastmod>${(e.lastModified ?? new Date()).toISOString()}</lastmod><changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
