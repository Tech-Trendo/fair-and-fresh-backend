import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { services, whatsIncluded, benefits, serviceImages, testimonials } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { eq } from 'drizzle-orm';

export function formatService(srv: any) {
  return {
    id: srv.id,
    name: srv.name,
    short_description: srv.shortDescription || '',
    long_description: srv.longDescription || '',
    what_we_offer: srv.whatWeOffer || {},
    created_at: srv.createdAt ? srv.createdAt.toISOString() : new Date().toISOString(),
    slug: srv.slug,
    icon: srv.icon || '',
    meta_title: srv.metaTitle || '',
    meta_description: srv.metaDescription || '',
    meta_keywords: srv.metaKeywords || '',
    og_title: srv.ogTitle || '',
    og_description: srv.ogDescription || '',
    og_image: srv.ogImage || '',
    og_type: srv.ogType || 'website',
    twitter_title: srv.twitterTitle || '',
    twitter_description: srv.twitterDescription || '',
    twitter_image: srv.twitterImage || '',
    twitter_card: srv.twitterCard || 'summary_large_image',
    canonical_url: srv.canonicalUrl || '',
    meta_robots: srv.metaRobots || '',
    whats_included: (srv.whatsIncluded || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    benefits: (srv.benefits || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      title: item.title,
      description: item.description || ''
    })),
    images: (srv.images || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      image_url: item.imageUrl
    })),
    testimonials: (srv.testimonials || []).map((item: any) => ({
      id: item.id,
      service_id: item.serviceId,
      author: item.author,
      content: item.content,
      rating: item.rating
    }))
  };
}

export async function GET(request: NextRequest) {
  try {
    const servicesList = await db.query.services.findMany({
      with: {
        whatsIncluded: true,
        benefits: true,
        images: true,
        testimonials: true
      }
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
      icon
    } = body;

    if (!name) {
      return NextResponse.json(
        { name: ['This field is required.'] },
        { status: 400 }
      );
    }

    const serviceId = `srv-${Date.now()}`;
    const finalSlug = slug || slugify(name);

    // 1. Insert Service row
    await db.insert(services).values({
      id: serviceId,
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
      icon: icon || '',
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

    // Fetch newly created service with relational entries
    const savedService = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
      with: {
        whatsIncluded: true,
        benefits: true,
        images: true,
        testimonials: true
      }
    });

    const responseData = formatService(savedService);
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Create service failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
