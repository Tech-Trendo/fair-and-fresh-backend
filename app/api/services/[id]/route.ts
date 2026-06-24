import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { services, whatsIncluded, benefits, serviceImages, testimonials, servicesCategories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/jwt';
import { formatService } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const srv = await db.query.services.findFirst({
      where: eq(services.id, id),
      with: {
        whatsIncluded: true,
        benefits: true,
        images: true,
        testimonials: true,
        servicesCategories: {
          with: {
            category: true
          }
        }
      }
    });

    if (!srv) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const responseData = formatService(srv);
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
      name,
      short_description,
      long_description,
      what_we_offer,
      whats_included,
      benefits: benefitsInput,
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
      category
    } = body;

    if (!name) {
      return NextResponse.json(
        { name: ['This field is required.'] },
        { status: 400 }
      );
    }

    const srv = await db.query.services.findFirst({ where: eq(services.id, id) });
    if (!srv) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const finalSlug = slug || slugify(name);

    // 1. Update main service row
    await db.update(services)
      .set({
        name,
        shortDescription: short_description || '',
        longDescription: long_description || '',
        whatWeOffer: what_we_offer || {},
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
        metaRobots: meta_robots || '',
        icon: icon || ''
      })
      .where(eq(services.id, id));

    // 2. Sync whats_included (clear and recreate)
    await db.delete(whatsIncluded).where(eq(whatsIncluded.serviceId, id));
    if (Array.isArray(whats_included) && whats_included.length > 0) {
      const values = whats_included.map((item, idx) => ({
        id: `inc-${Date.now()}-${idx}`,
        serviceId: id,
        title: item.title,
        description: item.description || ''
      }));
      await db.insert(whatsIncluded).values(values);
    }

    // 3. Sync benefits (clear and recreate)
    await db.delete(benefits).where(eq(benefits.serviceId, id));
    if (Array.isArray(benefitsInput) && benefitsInput.length > 0) {
      const values = benefitsInput.map((item, idx) => ({
        id: `ben-${Date.now()}-${idx}`,
        serviceId: id,
        title: item.title,
        description: item.description || ''
      }));
      await db.insert(benefits).values(values);
    }

    // 4. Sync images (clear and recreate)
    await db.delete(serviceImages).where(eq(serviceImages.serviceId, id));
    if (Array.isArray(imagesInput) && imagesInput.length > 0) {
      const values = imagesInput.map((item, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        serviceId: id,
        imageUrl: typeof item === 'string' ? item : item.image_url
      }));
      await db.insert(serviceImages).values(values);
    }

    // 5. Sync testimonials (clear and recreate)
    await db.delete(testimonials).where(eq(testimonials.serviceId, id));
    if (Array.isArray(testimonialsInput) && testimonialsInput.length > 0) {
      const values = testimonialsInput.map((item, idx) => ({
        id: `tst-${Date.now()}-${idx}`,
        serviceId: id,
        author: item.author,
        content: item.content,
        rating: Number(item.rating) || 5
      }));
      await db.insert(testimonials).values(values);
    }

    // Sync categories (clear and recreate)
    await db.delete(servicesCategories).where(eq(servicesCategories.serviceId, id));
    const resolvedCategoryIds = categoryIds || category || [];
    if (resolvedCategoryIds.length > 0) {
      const joinValues = resolvedCategoryIds.map((catId: string) => ({
        serviceId: id,
        categoryId: catId
      }));
      await db.insert(servicesCategories).values(joinValues);
    }

    // Fetch updated service details
    const updatedSrv = await db.query.services.findFirst({
      where: eq(services.id, id),
      with: {
        whatsIncluded: true,
        benefits: true,
        images: true,
        testimonials: true,
        servicesCategories: {
          with: {
            category: true
          }
        }
      }
    });

    const responseData = formatService(updatedSrv);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('Update service failed:', error);
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

    const srv = await db.query.services.findFirst({ where: eq(services.id, id) });
    if (!srv) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const updateObj: Partial<typeof services.$inferSelect> = {};

    if (body.name !== undefined) {
      updateObj.name = body.name;
      if (!body.slug) {
        updateObj.slug = slugify(body.name);
      }
    }
    if (body.short_description !== undefined) updateObj.shortDescription = body.short_description;
    if (body.long_description !== undefined) updateObj.longDescription = body.long_description;
    if (body.what_we_offer !== undefined) updateObj.whatWeOffer = body.what_we_offer;
    if (body.icon !== undefined) updateObj.icon = body.icon;

    // SEO updates
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
      await db.update(services).set(updateObj).where(eq(services.id, id));
    }

    // Sync sub-records partially if passed in body
    if (body.whats_included !== undefined && Array.isArray(body.whats_included)) {
      await db.delete(whatsIncluded).where(eq(whatsIncluded.serviceId, id));
      if (body.whats_included.length > 0) {
        const values = body.whats_included.map((item: any, idx: number) => ({
          id: `inc-${Date.now()}-${idx}`,
          serviceId: id,
          title: item.title,
          description: item.description || ''
        }));
        await db.insert(whatsIncluded).values(values);
      }
    }

    if (body.benefits !== undefined && Array.isArray(body.benefits)) {
      await db.delete(benefits).where(eq(benefits.serviceId, id));
      if (body.benefits.length > 0) {
        const values = body.benefits.map((item: any, idx: number) => ({
          id: `ben-${Date.now()}-${idx}`,
          serviceId: id,
          title: item.title,
          description: item.description || ''
        }));
        await db.insert(benefits).values(values);
      }
    }

    if (body.images !== undefined && Array.isArray(body.images)) {
      await db.delete(serviceImages).where(eq(serviceImages.serviceId, id));
      if (body.images.length > 0) {
        const values = body.images.map((item: any, idx: number) => ({
          id: `img-${Date.now()}-${idx}`,
          serviceId: id,
          imageUrl: typeof item === 'string' ? item : item.image_url
        }));
        await db.insert(serviceImages).values(values);
      }
    }

    if (body.testimonials !== undefined && Array.isArray(body.testimonials)) {
      await db.delete(testimonials).where(eq(testimonials.serviceId, id));
      if (body.testimonials.length > 0) {
        const values = body.testimonials.map((item: any, idx: number) => ({
          id: `tst-${Date.now()}-${idx}`,
          serviceId: id,
          author: item.author,
          content: item.content,
          rating: Number(item.rating) || 5
        }));
        await db.insert(testimonials).values(values);
      }
    }

    if (body.categoryIds !== undefined || body.category !== undefined) {
      const resolvedCategoryIds = body.categoryIds || body.category || [];
      await db.delete(servicesCategories).where(eq(servicesCategories.serviceId, id));
      if (resolvedCategoryIds.length > 0) {
        const joinValues = resolvedCategoryIds.map((catId: string) => ({
          serviceId: id,
          categoryId: catId
        }));
        await db.insert(servicesCategories).values(joinValues);
      }
    }

    // Fetch updated details
    const updatedSrv = await db.query.services.findFirst({
      where: eq(services.id, id),
      with: {
        whatsIncluded: true,
        benefits: true,
        images: true,
        testimonials: true,
        servicesCategories: {
          with: {
            category: true
          }
        }
      }
    });

    const responseData = formatService(updatedSrv);
    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error('PATCH service failed:', error);
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
    const check = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(services).where(eq(services.id, id));
    // Drizzle onDelete: 'cascade' automatically cleans up whatsIncluded, benefits, serviceImages, and testimonials!

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
