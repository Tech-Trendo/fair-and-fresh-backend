import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Blog, slugify } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const db = readDb();
    
    // Resolve many-to-many relationship: categoryIds -> category objects
    const blogsWithCategories = db.blogs.map(blog => {
      const resolvedCategories = db.categories.filter(c => 
        blog.categoryIds && blog.categoryIds.includes(c.id)
      );
      return {
        ...blog,
        category: resolvedCategories // DRF representation
      };
    });

    const paginated = paginate(blogsWithCategories, request.nextUrl);
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

    const body = await request.json();
    const {
      title,
      categoryIds,
      category, // fallback for DRF style posting
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

    const resolvedCategoryIds = categoryIds || category || [];

    const db = readDb();
    const finalSlug = slug || slugify(title);

    const newBlog: Blog = {
      id: `blog-${Date.now()}`,
      title,
      categoryIds: resolvedCategoryIds,
      featured_image: featured_image || '',
      description: description || '',
      created_at: new Date().toISOString(),
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

    db.blogs.push(newBlog);
    writeDb(db);

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
