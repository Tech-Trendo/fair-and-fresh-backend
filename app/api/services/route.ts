import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { services, whatsIncluded, benefits, serviceTypes, serviceImages, testimonials, servicesCategories } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { eq, sql } from 'drizzle-orm';
import { formatService } from '@/lib/format-service';

export async function GET(request: NextRequest) {
  try {
    const servicesList = await db.query.services.findMany({
      with: {
        whatsIncluded: true,
        benefits: true,
        serviceTypes: true,
        images: true,
        testimonials: true,
        servicesCategories: {
          with: {
            category: true
          }
        }
      },
      orderBy: (services, { asc }) => [asc(services.sortOrder), asc(services.name)],
    });

    const formattedServices = servicesList.map(formatService);
    const paginated = paginate(formattedServices, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    console.error('List services failed:', error);
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
      name,
      short_description,
      long_description,
      what_we_offer,
      whats_included,
      benefits: benefitsInput,
      service_types: serviceTypesInput,
      images: imagesInput,
      testimonials: testimonialsInput,
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
      canonical_url,
      meta_robots,
      icon,
      categoryIds,
      category,
      sort_order,
    } = body;

    if (!name) {
      return NextResponse.json(
        { name: ['This field is required.'] },
        { status: 400 }
      );
    }

    const serviceId = `srv-${Date.now()}`;
    const finalSlug = slug || slugify(name);

    // Auto-assign sort order: find current max and increment
    let resolvedSortOrder: number;
    if (sort_order !== undefined && sort_order !== null && !isNaN(Number(sort_order))) {
      resolvedSortOrder = Number(sort_order);
    } else {
      const maxResult = await db.select({ maxOrder: sql<number>`coalesce(max(sort_order), 0)` }).from(services);
      resolvedSortOrder = (maxResult[0]?.maxOrder ?? 0) + 1;
    }

    // 1. Insert Service row
    await db.insert(services).values({
      id: serviceId,
      name,
      shortDescription: short_description || '',
      longDescription: long_description || '',
      whatWeOffer: what_we_offer || {},
      slug: finalSlug,
      homeSection: body.home_section || 'steam',
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
      metaRobots: meta_robots || '',
      icon: icon || '',
      sortOrder: resolvedSortOrder,
      createdAt: new Date()
    });

    // 2. Insert whats_included
    if (Array.isArray(whats_included) && whats_included.length > 0) {
      const values = whats_included.map((item, idx) => ({
        id: `inc-${Date.now()}-${idx}`,
        serviceId,
        title: item.title,
        description: item.description || ''
      }));
      await db.insert(whatsIncluded).values(values);
    }

    // 3. Insert benefits
    if (Array.isArray(benefitsInput) && benefitsInput.length > 0) {
      const values = benefitsInput.map((item, idx) => ({
        id: `ben-${Date.now()}-${idx}`,
        serviceId,
        title: item.title,
        description: item.description || ''
      }));
      await db.insert(benefits).values(values);
    }

    // 3b. Insert service_types
    if (Array.isArray(serviceTypesInput) && serviceTypesInput.length > 0) {
      const values = serviceTypesInput.map((item, idx) => ({
        id: `typ-${Date.now()}-${idx}`,
        serviceId,
        title: typeof item === 'string' ? item : item.title,
        description: typeof item === 'string' ? '' : (item.description || '')
      }));
      await db.insert(serviceTypes).values(values);
    }

    // 4. Insert serviceImages
    if (Array.isArray(imagesInput) && imagesInput.length > 0) {
      const values = imagesInput.map((item, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        serviceId,
        imageUrl: typeof item === 'string' ? item : item.image_url
      }));
      await db.insert(serviceImages).values(values);
    }

    // 5. Insert testimonials
    if (Array.isArray(testimonialsInput) && testimonialsInput.length > 0) {
      const values = testimonialsInput.map((item, idx) => ({
        id: `tst-${Date.now()}-${idx}`,
        serviceId,
        author: item.author,
        content: item.content,
        rating: Number(item.rating) || 5
      }));
      await db.insert(testimonials).values(values);
    }

    // 6. Insert join table categories
    const resolvedCategoryIds = categoryIds || category || [];
    if (resolvedCategoryIds.length > 0) {
      const joinValues = resolvedCategoryIds.map((catId: string) => ({
        serviceId,
        categoryId: catId
      }));
      await db.insert(servicesCategories).values(joinValues);
    }

    // Fetch newly created service with relational entries
    const savedService = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
      with: {
        whatsIncluded: true,
        benefits: true,
        serviceTypes: true,
        images: true,
        testimonials: true,
        servicesCategories: {
          with: {
            category: true
          }
        }
      }
    });

    const responseData = formatService(savedService);
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Create service failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

