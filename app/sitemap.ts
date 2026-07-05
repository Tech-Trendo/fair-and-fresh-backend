import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://www.fairandfreshcleaning.com.au");

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [dbServices, dbCategories, dbBlogs] = await Promise.all([
    db.query.services.findMany({
      columns: { slug: true, createdAt: true, canonicalUrl: true, metaRobots: true },
    }),
    db.query.serviceCategories.findMany({
      columns: { slug: true, canonicalUrl: true, metaRobots: true },
    }),
    db.query.blogs.findMany({
      columns: { slug: true, createdAt: true, canonicalUrl: true, metaRobots: true },
    }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/services`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/quote`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/brisbane`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const servicePages: MetadataRoute.Sitemap = dbServices
    .filter((s) => isIndexable(s.metaRobots))
    .map((s) => ({
      url: toAbsoluteUrl(s.canonicalUrl || `/services/${s.slug}`),
      lastModified: s.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const categoryPages: MetadataRoute.Sitemap = dbCategories
    .filter((c) => isIndexable(c.metaRobots))
    .map((c) => ({
      url: toAbsoluteUrl(c.canonicalUrl || `/category/${c.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  const blogPages: MetadataRoute.Sitemap = dbBlogs
    .filter((b) => isIndexable(b.metaRobots))
    .map((b) => ({
      url: toAbsoluteUrl(b.canonicalUrl || `/blog/${b.slug}`),
      lastModified: b.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...servicePages, ...blogPages];
}
