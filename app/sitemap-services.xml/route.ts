import { db } from "@/lib/db";
import { comboPageTargets } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE_URL = "https://www.fairandfreshcleaning.com.au";

export async function GET() {
  const dbServices = await db.query.services.findMany({
    columns: { slug: true, createdAt: true, canonicalUrl: true, metaRobots: true },
  });

  const serviceEntries = dbServices
    .filter((s) => !s.metaRobots || !s.metaRobots.toLowerCase().includes("noindex"))
    .map((s) => ({
      url: s.canonicalUrl?.startsWith("http")
        ? s.canonicalUrl
        : `${BASE_URL}/services/${s.slug}`,
      lastModified: s.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // Curated combo pages only (combo_page_targets is the source of truth — no full matrix).
  const comboEntries = (
    await db.query.comboPageTargets.findMany({
      where: eq(comboPageTargets.isActive, true),
      with: { service: true, suburb: true },
    })
  ).map((t) => ({
    url: `${BASE_URL}/services/${t.service.slug}/${t.suburb.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const entries = [...serviceEntries, ...comboEntries]
    .map(
      (e) =>
        `<url><loc>${e.url}</loc><lastmod>${(e.lastModified ?? new Date()).toISOString()}</lastmod><changefreq>${e.changeFrequency}</changefreq><priority>${e.priority}</priority></url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
