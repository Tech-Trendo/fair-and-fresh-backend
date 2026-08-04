import { db } from "@/lib/db";
import { suburbs } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://www.fairandfreshcleaning.com.au";

export async function GET() {
  // Active suburbs only — inactive rows never appear in the sitemap.
  const activeSuburbs = await db
    .select({
      slug: suburbs.slug,
      updatedAt: suburbs.updatedAt,
      createdAt: suburbs.createdAt,
    })
    .from(suburbs)
    .where(eq(suburbs.isActive, true));

  const entries = activeSuburbs
    .map((s) => ({
      url: `${BASE_URL}/${s.slug}`,
      lastModified: s.updatedAt ?? s.createdAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
    .map(
      (e) =>
        `<url><loc>${e.url}</loc><lastmod>${(e.lastModified ?? new Date()).toISOString()}</lastmod><changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
