import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { staticPages } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';

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

export async function GET(request: NextRequest) {
  try {
    const pagesList = await db.select().from(staticPages);
    const formattedPages = pagesList.map(formatPage);
    return NextResponse.json({ count: formattedPages.length, results: formattedPages }, { status: 200 });
  } catch (error) {
    console.error('List pages failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      id,
      name,
      slug,
      meta_title,
      meta_description,
      meta_keywords,
      og_title,
      og_description,
      og_image,
      og_type,
      twitter_title,
      twitter_description,
      twitter_image,
      twitter_card,
      canonical_url,
      meta_robots
    } = body;

    if (!id || !name) {
      return NextResponse.json(
        { detail: 'ID and name are required fields.' },
        { status: 400 }
      );
    }

    const finalSlug = slug || slugify(name);

    await db.insert(staticPages).values({
      id,
      name,
      slug: finalSlug,
      metaTitle: meta_title || '',
      metaDescription: meta_description || '',
      metaKeywords: meta_keywords || '',
      ogTitle: og_title || '',
      ogDescription: og_description || '',
      ogImage: og_image || '',
      ogType: og_type || 'website',
      twitterTitle: twitter_title || '',
      twitterDescription: twitter_description || '',
      twitterImage: twitter_image || '',
      twitterCard: twitter_card || 'summary_large_image',
      canonicalUrl: canonical_url || '',
      metaRobots: meta_robots || ''
    });

    const responseObj = {
      id,
      name,
      slug: finalSlug,
      meta_title: meta_title || '',
      meta_description: meta_description || '',
      meta_keywords: meta_keywords || '',
      og_title: og_title || '',
      og_description: og_description || '',
      og_image: og_image || '',
      og_type: og_type || 'website',
      twitter_title: twitter_title || '',
      twitter_description: twitter_description || '',
      twitter_image: twitter_image || '',
      twitter_card: twitter_card || 'summary_large_image',
      canonical_url: canonical_url || '',
      meta_robots: meta_robots || ''
    };

    return NextResponse.json(responseObj, { status: 201 });
  } catch (error) {
    console.error('Create page failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
