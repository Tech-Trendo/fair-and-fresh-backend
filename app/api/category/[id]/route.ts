import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { blogCategories, serviceCategories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/jwt';
import { formatCategory } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const type = request.nextUrl.searchParams.get('type') || 'service';
    const targetTable = type === 'blog' ? blogCategories : serviceCategories;

    const result = await db.select().from(targetTable).where(eq(targetTable.id, id)).limit(1);
    const category = result[0];

    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(formatCategory(category), { status: 200 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
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

    const check = await db.select().from(targetTable).where(eq(targetTable.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const finalSlug = slug || slugify(title);

    await db.update(targetTable)
      .set({
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
      })
      .where(eq(targetTable.id, id));

    const updatedCategory = {
      id,
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

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error('PUT category failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const type = request.nextUrl.searchParams.get('type') || 'service';
    const targetTable = type === 'blog' ? blogCategories : serviceCategories;

    const body = await request.json();

    const check = await db.select().from(targetTable).where(eq(targetTable.id, id)).limit(1);
    const category = check[0];
    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const updateObj: Partial<typeof targetTable.$inferSelect> = {};
    if (body.title !== undefined) {
      updateObj.title = body.title;
      if (!body.slug) {
        updateObj.slug = slugify(body.title);
      }
    }
    if (body.description !== undefined) updateObj.description = body.description;
    if (body.image !== undefined) updateObj.image = body.image;
    if (body.slug !== undefined) updateObj.slug = body.slug;
    
    // SEO fields
    if (body.meta_title !== undefined) updateObj.metaTitle = body.meta_title;
    if (body.meta_description !== undefined) updateObj.metaDescription = body.meta_description;
    if (body.meta_keywords !== undefined) updateObj.metaKeywords = body.meta_keywords;
    if (body.og_title !== undefined) updateObj.ogTitle = body.og_title;
    if (body.og_description !== undefined) updateObj.ogDescription = body.og_description;
    if (body.og_image !== undefined) updateObj.ogImage = body.og_image;
    if (body.og_type !== undefined) updateObj.ogType = body.og_type;
    if (body.twitter_title !== undefined) updateObj.twitterTitle = body.twitter_title;
    if (body.twitter_description !== undefined) updateObj.twitterDescription = body.twitter_description;
    if (body.twitter_image !== undefined) updateObj.twitterImage = body.twitter_image;
    if (body.twitter_card !== undefined) updateObj.twitterCard = body.twitter_card;
    if (body.canonical_url !== undefined) updateObj.canonicalUrl = body.canonical_url;

    if (Object.keys(updateObj).length > 0) {
      await db.update(targetTable).set(updateObj).where(eq(targetTable.id, id));
    }

    const updated = await db.select().from(targetTable).where(eq(targetTable.id, id)).limit(1);
    return NextResponse.json(formatCategory(updated[0]), { status: 200 });
  } catch (error) {
    console.error('PATCH category failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const type = request.nextUrl.searchParams.get('type') || 'service';
    const targetTable = type === 'blog' ? blogCategories : serviceCategories;

    const check = await db.select().from(targetTable).where(eq(targetTable.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(targetTable).where(eq(targetTable.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
