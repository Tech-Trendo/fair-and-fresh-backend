import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials, services } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    const items = await db.query.testimonials.findMany({
      with: { service: true },
      orderBy: [desc(testimonials.id)],
    });

    return NextResponse.json(
      items.map((t) => ({
        id: t.id,
        service_id: t.serviceId,
        service_name: t.service?.name,
        author: t.author,
        content: t.content,
        rating: t.rating,
        location: t.location,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch testimonials failed:', error);
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
    const { author, content, rating, service_id, location } = body;

    if (!author || !author.trim()) {
      return NextResponse.json({ detail: 'Author is required.' }, { status: 400 });
    }
    if (!content || !content.trim()) {
      return NextResponse.json({ detail: 'Content is required.' }, { status: 400 });
    }
    if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ detail: 'Rating must be a number between 1 and 5.' }, { status: 400 });
    }
    if (!service_id || typeof service_id !== 'string') {
      return NextResponse.json({ detail: 'Service is required.' }, { status: 400 });
    }

    const serviceExists = await db.query.services.findFirst({
      where: eq(services.id, service_id),
    });
    if (!serviceExists) {
      return NextResponse.json({ detail: 'Invalid service.' }, { status: 400 });
    }

    const id = `tst-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    await db.insert(testimonials).values({
      id,
      serviceId: service_id,
      author: author.trim(),
      content: content.trim(),
      rating: Math.floor(rating),
      location: location && location.trim() ? location.trim() : null,
    });

    return NextResponse.json({ message: 'Created', id }, { status: 201 });
  } catch (error) {
    console.error('Create testimonial failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
