import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { blogCategories, serviceCategories } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export function formatCategory(cat: any) {
  return {
    id: cat.id,
    title: cat.title,
    description: cat.description || '',
    image: cat.image || '',
    slug: cat.slug,
    meta_title: cat.metaTitle || '',
    meta_description: cat.metaDescription || '',
    meta_keywords: cat.metaKeywords || '',
    og_title: cat.ogTitle || '',
    og_description: cat.ogDescription || '',
    og_image: cat.ogImage || '',
    og_type: cat.ogType || 'website',
    twitter_title: cat.twitterTitle || '',
    twitter_description: cat.twitterDescription || '',
    twitter_image: cat.twitterImage || '',
    twitter_card: cat.twitterCard || 'summary_large_image',
    canonical_url: cat.canonicalUrl || ''
  };
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'service';
    const categoriesList = type === 'blog'
      ? await db.select().from(blogCategories)
      : await db.select().from(serviceCategories);

    const formattedCategories = categoriesList.map(formatCategory);
    const paginated = paginate(formattedCategories, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
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

    const type = request.nextUrl.searchParams.get('type') || 'service';
    const targetTable = type === 'blog' ? blogCategories : serviceCategories;

    const body = await request.json();
    const {
      title,
      description,
      image,
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
      canonical_url
    } = body;

    if (!title) {
      return NextResponse.json(
        { title: ['This field is required.'] },
        { status: 400 }
      );
    }

    const newId = `cat-${Date.now()}`;
    const finalSlug = slug || slugify(title);

    await db.insert(targetTable).values({
      id: newId,
      title,
      description: description || '',
      image: image || null,
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
      canonicalUrl: canonical_url || ''
    });

    const newCategory = {
      id: newId,
      title,
      description: description || '',
      image: image || null,
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
      canonical_url: canonical_url || ''
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('Create category failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
