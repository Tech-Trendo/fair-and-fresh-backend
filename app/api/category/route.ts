import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { blogCategories, serviceCategories, homeServiceCategories } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { formatCategory } from '@/lib/format-category';
import { sql } from 'drizzle-orm';

type CategoryTable = typeof serviceCategories | typeof blogCategories | typeof homeServiceCategories;

function categoryTable(type: string): CategoryTable {
  if (type === 'blog') return blogCategories;
  if (type === 'home') return homeServiceCategories;
  return serviceCategories;
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get('type') || 'service';
    const targetTable = categoryTable(type);

    const categoriesList = type === 'home'
      ? await db.select().from(targetTable).orderBy(sql`sort_order asc, title asc`)
      : await db.select().from(targetTable);

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
    const targetTable = categoryTable(type);

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

    const baseValues = {
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
    };

    let sortOrder = 0;
    if (type === 'home') {
      const maxResult = await db
        .select({ maxOrder: sql<number>`coalesce(max(sort_order), 0)` })
        .from(homeServiceCategories);
      sortOrder = (maxResult[0]?.maxOrder ?? 0) + 1;
      await db.insert(homeServiceCategories).values({ ...baseValues, sortOrder });
    } else {
      await db.insert(targetTable as typeof serviceCategories).values(baseValues);
    }

    const newCategory = {
      id: newId,
      title,
      description: description || '',
      image: image || null,
      slug: finalSlug,
      sort_order: sortOrder,
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
