const BASE_URL = "https://www.fairandfreshcleaning.com.au";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Sitemap index — URL volume (75+ suburb hubs + ~80 combo pages) exceeds a single
// flat sitemap, so the site is split into logical groups:
//   /sitemap-pages.xml    — static, categories, blog categories, blog posts
//   /sitemap-services.xml — services + curated service x suburb combo pages
//   /sitemap-suburbs.xml  — active suburb hub pages
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${BASE_URL}/sitemap-pages.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-services.xml</loc></sitemap>
  <sitemap><loc>${BASE_URL}/sitemap-suburbs.xml</loc></sitemap>
</sitemapindex>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
