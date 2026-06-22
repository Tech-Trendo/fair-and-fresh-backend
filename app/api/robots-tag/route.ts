import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { staticPages, services, blogs } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '';

    // Normalize path (remove trailing slash, except for root)
    let cleanPath = path.trim();
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
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

    return NextResponse.json({ metaRobots }, { status: 200 });
  } catch (error) {
    console.error('Fetch robots-tag failed:', error);
    return NextResponse.json({ metaRobots: '' }, { status: 200 });
  }
}
