import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Blog, slugify } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const blog = db.blogs.find(b => b.id === id);

    if (!blog) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const resolvedCategories = db.categories.filter(c => 
      blog.categoryIds && blog.categoryIds.includes(c.id)
    );

    return NextResponse.json({
      ...blog,
      category: resolvedCategories
    }, { status: 200 });
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

    const db = readDb();
    const blogIdx = db.blogs.findIndex(b => b.id === id);

    if (blogIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const resolvedCategoryIds = categoryIds || category || [];
    const finalSlug = slug || slugify(title);

    const updatedBlog: Blog = {
      id,
      title,
      categoryIds: resolvedCategoryIds,
      featured_image: featured_image || '',
      description: description || '',
      created_at: db.blogs[blogIdx].created_at || new Date().toISOString(),
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
      canonical_url: canonical_url || ''
    };

    db.blogs[blogIdx] = updatedBlog;
    writeDb(db);

    return NextResponse.json(updatedBlog, { status: 200 });
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

    const db = readDb();
    const blog = db.blogs.find(b => b.id === id);

    if (!blog) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    // Apply partial updates
    if (body.title !== undefined) {
      blog.title = body.title;
      if (!body.slug) {
        blog.slug = slugify(body.title);
      }
    }
    
    if (body.categoryIds !== undefined) blog.categoryIds = body.categoryIds;
    if (body.category !== undefined) blog.categoryIds = body.category; // fallback
    if (body.featured_image !== undefined) blog.featured_image = body.featured_image;
    if (body.description !== undefined) blog.description = body.description;
    
    // SEO fields
    if (body.slug !== undefined) blog.slug = body.slug;
    if (body.meta_title !== undefined) blog.meta_title = body.meta_title;
    if (body.meta_description !== undefined) blog.meta_description = body.meta_description;
    if (body.meta_keywords !== undefined) blog.meta_keywords = body.meta_keywords;
    if (body.og_title !== undefined) blog.og_title = body.og_title;
    if (body.og_description !== undefined) blog.og_description = body.og_description;
    if (body.og_image !== undefined) blog.og_image = body.og_image;
    if (body.og_type !== undefined) blog.og_type = body.og_type;
    if (body.twitter_title !== undefined) blog.twitter_title = body.twitter_title;
    if (body.twitter_description !== undefined) blog.twitter_description = body.twitter_description;
    if (body.twitter_image !== undefined) blog.twitter_image = body.twitter_image;
    if (body.twitter_card !== undefined) blog.twitter_card = body.twitter_card;
    if (body.canonical_url !== undefined) blog.canonical_url = body.canonical_url;

    writeDb(db);

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
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
    const db = readDb();
    const blogIdx = db.blogs.findIndex(b => b.id === id);

    if (blogIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    db.blogs.splice(blogIdx, 1);
    writeDb(db);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
