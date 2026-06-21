import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Service, slugify } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';
import { resolveServiceRelations } from '../route';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const service = db.services.find(s => s.id === id);

    if (!service) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const resolved = resolveServiceRelations(service, db);
    return NextResponse.json(resolved, { status: 200 });
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
      benefits,
      images,
      testimonials,
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
    const serviceIdx = db.services.findIndex(s => s.id === id);

    if (serviceIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const finalSlug = slug || slugify(name);

    // 1. Update main service record
    const updatedService: Service = {
      id,
      name,
      short_description: short_description || '',
      long_description: long_description || '',
      what_we_offer: what_we_offer || {},
      created_at: db.services[serviceIdx].created_at || new Date().toISOString(),
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

    db.services[serviceIdx] = updatedService;

    // 2. Clear and recreate whats_included
    db.whats_included = db.whats_included.filter(item => item.service_id !== id);
    if (Array.isArray(whats_included)) {
      whats_included.forEach((item, idx) => {
        db.whats_included.push({
          id: `inc-${Date.now()}-${idx}`,
          service_id: id,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    // 3. Clear and recreate benefits
    db.benefits = db.benefits.filter(item => item.service_id !== id);
    if (Array.isArray(benefits)) {
      benefits.forEach((item, idx) => {
        db.benefits.push({
          id: `ben-${Date.now()}-${idx}`,
          service_id: id,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    // 4. Clear and recreate images
    db.images = db.images.filter(item => item.service_id !== id);
    if (Array.isArray(images)) {
      images.forEach((item, idx) => {
        db.images.push({
          id: `img-${Date.now()}-${idx}`,
          service_id: id,
          image_url: typeof item === 'string' ? item : item.image_url
        });
      });
    }

    // 5. Clear and recreate testimonials
    db.testimonials = db.testimonials.filter(item => item.service_id !== id);
    if (Array.isArray(testimonials)) {
      testimonials.forEach((item, idx) => {
        db.testimonials.push({
          id: `tst-${Date.now()}-${idx}`,
          service_id: id,
          author: item.author,
          content: item.content,
          rating: Number(item.rating) || 5
        });
      });
    }

    writeDb(db);

    const resolved = resolveServiceRelations(updatedService, db);
    return NextResponse.json(resolved, { status: 200 });
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
    const service = db.services.find(s => s.id === id);

    if (!service) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    // Apply partial updates to main service
    if (body.name !== undefined) {
      service.name = body.name;
      if (!body.slug) {
        service.slug = slugify(body.name);
      }
    }
    if (body.short_description !== undefined) service.short_description = body.short_description;
    if (body.long_description !== undefined) service.long_description = body.long_description;
    if (body.what_we_offer !== undefined) service.what_we_offer = body.what_we_offer;

    // SEO updates
    if (body.slug !== undefined) service.slug = body.slug;
    if (body.meta_title !== undefined) service.meta_title = body.meta_title;
    if (body.meta_description !== undefined) service.meta_description = body.meta_description;
    if (body.meta_keywords !== undefined) service.meta_keywords = body.meta_keywords;
    if (body.og_title !== undefined) service.og_title = body.og_title;
    if (body.og_description !== undefined) service.og_description = body.og_description;
    if (body.og_image !== undefined) service.og_image = body.og_image;
    if (body.og_type !== undefined) service.og_type = body.og_type;
    if (body.twitter_title !== undefined) service.twitter_title = body.twitter_title;
    if (body.twitter_description !== undefined) service.twitter_description = body.twitter_description;
    if (body.twitter_image !== undefined) service.twitter_image = body.twitter_image;
    if (body.twitter_card !== undefined) service.twitter_card = body.twitter_card;
    if (body.canonical_url !== undefined) service.canonical_url = body.canonical_url;

    // Apply partial updates to nested structures if explicitly provided
    if (body.whats_included !== undefined && Array.isArray(body.whats_included)) {
      db.whats_included = db.whats_included.filter(item => item.service_id !== id);
      body.whats_included.forEach((item, idx) => {
        db.whats_included.push({
          id: `inc-${Date.now()}-${idx}`,
          service_id: id,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    if (body.benefits !== undefined && Array.isArray(body.benefits)) {
      db.benefits = db.benefits.filter(item => item.service_id !== id);
      body.benefits.forEach((item, idx) => {
        db.benefits.push({
          id: `ben-${Date.now()}-${idx}`,
          service_id: id,
          title: item.title,
          description: item.description || ''
        });
      });
    }

    if (body.images !== undefined && Array.isArray(body.images)) {
      db.images = db.images.filter(item => item.service_id !== id);
      body.images.forEach((item, idx) => {
        db.images.push({
          id: `img-${Date.now()}-${idx}`,
          service_id: id,
          image_url: typeof item === 'string' ? item : item.image_url
        });
      });
    }

    if (body.testimonials !== undefined && Array.isArray(body.testimonials)) {
      db.testimonials = db.testimonials.filter(item => item.service_id !== id);
      body.testimonials.forEach((item, idx) => {
        db.testimonials.push({
          id: `tst-${Date.now()}-${idx}`,
          service_id: id,
          author: item.author,
          content: item.content,
          rating: Number(item.rating) || 5
        });
      });
    }

    writeDb(db);

    const resolved = resolveServiceRelations(service, db);
    return NextResponse.json(resolved, { status: 200 });
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
    const serviceIdx = db.services.findIndex(s => s.id === id);

    if (serviceIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    // 1. Delete main service record
    db.services.splice(serviceIdx, 1);

    // 2. Cascade delete related resources
    db.whats_included = db.whats_included.filter(item => item.service_id !== id);
    db.benefits = db.benefits.filter(item => item.service_id !== id);
    db.images = db.images.filter(item => item.service_id !== id);
    db.testimonials = db.testimonials.filter(item => item.service_id !== id);

    writeDb(db);

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
