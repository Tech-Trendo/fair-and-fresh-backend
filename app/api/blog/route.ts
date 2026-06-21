import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { blogs, blogsCategories } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    // Query all blogs with category relations resolved
    const blogsWithRelations = await db.query.blogs.findMany({
      with: {
        blogsCategories: {
          with: {
            category: true
          }
        }
      }
    });

    const resolvedBlogs = blogsWithRelations.map(blog => {
      const resolvedCategories = blog.blogsCategories.map(bc => bc.category);
      // Remove blogsCategories join property and shape like DRF
      const { blogsCategories: _, ...blogData } = blog;
      return {
        ...blogData,
        category: resolvedCategories
      };
    });

    const paginated = paginate(resolvedBlogs, request.nextUrl);
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

    const resolvedCategoryIds = categoryIds || category || [];
    const blogId = `blog-${Date.now()}`;
    const finalSlug = slug || slugify(title);

    // Insert blog post in Postgres
    await db.insert(blogs).values({
      id: blogId,
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
      canonicalUrl: canonical_url || '',
      createdAt: new Date()
    });

    // Link categories in join table
    if (resolvedCategoryIds.length > 0) {
      const joinValues = resolvedCategoryIds.map((catId: string) => ({
        blogId,
        categoryId: catId
      }));
      await db.insert(blogsCategories).values(joinValues);
    }

    // Retrieve categories to return fully populated object
    const dbCategories = await db.query.categories.findMany();
    const savedCategories = dbCategories.filter(c => resolvedCategoryIds.includes(c.id));

    const responseObj = {
      id: blogId,
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
      created_at: new Date().toISOString(),
      category: savedCategories
    };

    return NextResponse.json(responseObj, { status: 201 });
  } catch (error) {
    console.error('Create blog failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
