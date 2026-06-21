import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Service, slugify, DatabaseSchema } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export function resolveServiceRelations(service: Service, db: DatabaseSchema) {
  const whatsIncluded = db.whats_included.filter(item => item.service_id === service.id);
  const benefits = db.benefits.filter(item => item.service_id === service.id);
  const images = db.images.filter(item => item.service_id === service.id);
  const testimonials = db.testimonials.filter(item => item.service_id === service.id);
  
  return {
    ...service,
    whats_included: whatsIncluded,
    benefits,
    images,
    testimonials
  };
}

export async function GET(request: NextRequest) {
  try {
    const db = readDb();
    
    // Map services with their nested relations resolved
    const servicesWithRelations = db.services.map(service => 
      resolveServiceRelations(service, db)
    );

    const paginated = paginate(servicesWithRelations, request.nextUrl);
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
      name,
      short_description,
      long_description,
      what_we_offer,
      whats_included, // nested array
      benefits,       // nested array
      images,         // nested array
      testimonials,   // nested array
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

    if (!name) {
      return NextResponse.json(
        { name: ['This field is required.'] },
        { status: 400 }
      );
    }

    const db = readDb();
    const serviceId = `srv-${Date.now()}`;
    const finalSlug = slug || slugify(name);

    // 1. Create main service record
    const newService: Service = {
      id: serviceId,
      name,
      short_description: short_description || '',
      long_description: long_description || '',
      what_we_offer: what_we_offer || {},
      created_at: new Date().toISOString(),
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

    db.services.push(newService);

    // 2. Create whats_included records
    if (Array.isArray(whats_included)) {
      whats_included.forEach((item, idx) => {
        db.whats_included.push({
          id: `inc-${Date.now()}-${idx}`,
          service_id: serviceId,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    // 3. Create benefits records
    if (Array.isArray(benefits)) {
      benefits.forEach((item, idx) => {
        db.benefits.push({
          id: `ben-${Date.now()}-${idx}`,
          service_id: serviceId,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    // 4. Create image records
    if (Array.isArray(images)) {
      images.forEach((item, idx) => {
        db.images.push({
          id: `img-${Date.now()}-${idx}`,
          service_id: serviceId,
          image_url: typeof item === 'string' ? item : item.image_url
        });
      });
    }

    // 5. Create testimonial records
    if (Array.isArray(testimonials)) {
      testimonials.forEach((item, idx) => {
        db.testimonials.push({
          id: `tst-${Date.now()}-${idx}`,
          service_id: serviceId,
          author: item.author,
          content: item.content,
          rating: Number(item.rating) || 5
        });
      });
    }

    writeDb(db);

    const resolvedResponse = resolveServiceRelations(newService, db);
    return NextResponse.json(resolvedResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
