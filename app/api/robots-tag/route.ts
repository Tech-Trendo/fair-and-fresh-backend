import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staticPages, services, blogs } from '@/lib/schema';
import { eq } from 'drizzle-orm';

// Robots rules only change when an admin edits a page's SEO settings, so a short
// in-memory TTL cache is safe and avoids a Postgres round-trip per request.
const cache = new Map<string, { metaRobots: string; expiresAt: number }>();
const CACHE_TTL_MS = 60_000;

// Lets the CDN serve repeat crawler requests (identical ?path=) without hitting
// the function or Postgres at all.
const CACHE_HEADERS = { 'Cache-Control': 'public, max-age=60' };

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    // Normalize path (remove trailing slash, except for root)
    let cleanPath = path.trim();
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }

    const cached = cache.get(cleanPath);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(
        { metaRobots: cached.metaRobots },
        { status: 200, headers: CACHE_HEADERS }
      );
    }

    let metaRobots = '';

    if (cleanPath === '/' || cleanPath === '') {
      const page = await db.query.staticPages.findFirst({
        where: eq(staticPages.slug, 'home'),
      });
      metaRobots = page?.metaRobots || '';
    } else if (cleanPath === '/about' || cleanPath === '/about-us') {
      const page = await db.query.staticPages.findFirst({
        where: eq(staticPages.slug, 'about-us'),
      });
      metaRobots = page?.metaRobots || '';
    } else if (cleanPath === '/contact' || cleanPath === '/contact-us') {
      const page = await db.query.staticPages.findFirst({
        where: eq(staticPages.slug, 'contact-us'),
      });
      metaRobots = page?.metaRobots || '';
    } else if (cleanPath === '/services') {
      const page = await db.query.staticPages.findFirst({
        where: eq(staticPages.slug, 'services'),
      });
      metaRobots = page?.metaRobots || '';
    } else if (cleanPath.startsWith('/services/')) {
      const slug = cleanPath.substring('/services/'.length);
      const service = await db.query.services.findFirst({
        where: eq(services.slug, slug),
      });
      metaRobots = service?.metaRobots || '';
    } else if (cleanPath === '/blog') {
      const page = await db.query.staticPages.findFirst({
        where: eq(staticPages.slug, 'blog'),
      });
      metaRobots = page?.metaRobots || '';
    } else if (cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.substring('/blog/'.length);
      const blog = await db.query.blogs.findFirst({
        where: eq(blogs.slug, slug),
      });
      metaRobots = blog?.metaRobots || '';
    }

    cache.set(cleanPath, { metaRobots, expiresAt: Date.now() + CACHE_TTL_MS });
    return NextResponse.json({ metaRobots }, { status: 200, headers: CACHE_HEADERS });
  } catch (error) {
    console.error('Fetch robots-tag failed:', error);
    return NextResponse.json({ metaRobots: '' }, { status: 200 });
  }
}
