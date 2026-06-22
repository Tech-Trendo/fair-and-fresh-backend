import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials, services } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const serviceId = url.searchParams.get('serviceId');

    let dbTestimonials;
    if (serviceId) {
      dbTestimonials = await db.query.testimonials.findMany({
        where: eq(testimonials.serviceId, serviceId),
        with: {
          service: true,
        },
      });
    } else {
      dbTestimonials = await db.query.testimonials.findMany({
        with: {
          service: true,
        },
      });
    }

    return NextResponse.json(
      dbTestimonials.map((t) => ({
        id: t.id,
        service_id: t.serviceId,
        author: t.author,
        content: t.content,
        rating: t.rating,
        service_name: t.service?.name,
      }))
    );
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { author, content, rating, serviceId } = body;

    // Validation
    if (!author || typeof author !== 'string' || !author.trim()) {
      return NextResponse.json({ error: 'Author is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }
    if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }
    if (!serviceId || typeof serviceId !== 'string') {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    // Check if the service exists
    const serviceExists = await db.query.services.findFirst({
      where: eq(services.id, serviceId),
    });

    if (!serviceExists) {
      return NextResponse.json({ error: 'Invalid Service ID' }, { status: 400 });
    }

    const reviewId = `tst-${Date.now()}`;

    // Insert testimonial into database
    await db.insert(testimonials).values({
      id: reviewId,
      serviceId,
      author: author.trim(),
      content: content.trim(),
      rating: Math.floor(rating),
    });

    // Return the created review
    return NextResponse.json({
      success: true,
      review: {
        id: reviewId,
        serviceId,
        author,
        content,
        rating,
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error inserting testimonial:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
