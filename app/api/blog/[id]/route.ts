import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { blogs, blogsCategories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/jwt';
import { formatBlog } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
      with: {
        blogsCategories: {
          with: {
            category: true
          }
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const responseData = formatBlog(blog);
    return NextResponse.json(responseData, { status: 200 });
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
    const body = await request.json();
    const {
      title,
      categoryIds,
      category,
      featured_image,
      description,
      meta_title,
      meta_description,
      meta_keywords,
      slug,
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

    const dbBlog = await db.query.blogs.findFirst({ where: eq(blogs.id, id) });
    if (!dbBlog) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const resolvedCategoryIds = categoryIds || category || [];
    const finalSlug = slug || slugify(title);

    // 1. Update main blog post
    await db.update(blogs)
      .set({
        title,
        featuredImage: featured_image || '',
        description: description || '',
        slug: finalSlug,
        metaTitle: meta_title || '',
        metaDescription: meta_description || '',
        metaKeywords: meta_keywords || '',
        ogTitle: og_title || '',
        ogDescription: og_description || '',
        ogImage: og_image || '',
        ogType: og_type || 'article',
        twitterTitle: twitter_title || '',
        twitterDescription: twitter_description || '',
        twitterImage: twitter_image || '',
        twitterCard: twitter_card || 'summary_large_image',
        canonicalUrl: canonical_url || ''
      })
      .where(eq(blogs.id, id));

    // 2. Sync category mappings (clear and recreate)
    await db.delete(blogsCategories).where(eq(blogsCategories.blogId, id));
    if (resolvedCategoryIds.length > 0) {
      const joinValues = resolvedCategoryIds.map((catId: string) => ({
        blogId: id,
        categoryId: catId
      }));
      await db.insert(blogsCategories).values(joinValues);
    }

    const allCategories = await db.query.blogCategories.findMany();
    const savedCategories = allCategories.filter(c => resolvedCategoryIds.includes(c.id));

    const responseObj = {
      id,
      title,
      featured_image: featured_image || '',
      description: description || '',
      slug: finalSlug,
      meta_title: meta_title || '',
      meta_description: meta_description || '',
      meta_keywords: meta_keywords || '',
      og_title: og_title || '',
      og_description: og_description || '',
      og_image: og_image || '',
      og_type: og_type || 'article',
      twitter_title: twitter_title || '',
      twitter_description: twitter_description || '',
      twitter_image: twitter_image || '',
      twitter_card: twitter_card || 'summary_large_image',
      canonical_url: canonical_url || '',
      created_at: dbBlog.createdAt.toISOString(),
      category: savedCategories
    };

    return NextResponse.json(responseObj, { status: 200 });
  } catch (error) {
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
    const body = await request.json();

    const dbBlog = await db.query.blogs.findFirst({ where: eq(blogs.id, id) });
    if (!dbBlog) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const updateObj: Partial<typeof blogs.$inferSelect> = {};

    if (body.title !== undefined) {
      updateObj.title = body.title;
      if (!body.slug) {
        updateObj.slug = slugify(body.title);
      }
    }
    if (body.featured_image !== undefined) updateObj.featuredImage = body.featured_image;
    if (body.description !== undefined) updateObj.description = body.description;
    
    // SEO fields
    if (body.slug !== undefined) updateObj.slug = body.slug;
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
      await db.update(blogs).set(updateObj).where(eq(blogs.id, id));
    }

    // Sync categories if passed
    const passedCategories = body.categoryIds || body.category;
    if (passedCategories !== undefined && Array.isArray(passedCategories)) {
      await db.delete(blogsCategories).where(eq(blogsCategories.blogId, id));
      if (passedCategories.length > 0) {
        const joinValues = passedCategories.map((catId: string) => ({
          blogId: id,
          categoryId: catId
        }));
        await db.insert(blogsCategories).values(joinValues);
      }
    }

    // Fetch updated relation mappings
    const updatedBlog = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
      with: {
        blogsCategories: {
          with: {
            category: true
          }
        }
      }
    });

    const responseData = formatBlog(updatedBlog);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('PATCH blog failed:', error);
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
    const check = await db.select().from(blogs).where(eq(blogs.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(blogs).where(eq(blogs.id, id));
    // Drizzle onDelete: 'cascade' takes care of blogsCategories records!

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
