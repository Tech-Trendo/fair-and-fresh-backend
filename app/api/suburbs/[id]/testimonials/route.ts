import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suburbTestimonials, suburbs } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq, and } from 'drizzle-orm';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ detail: 'Invalid suburb id.' }, { status: 400 });
    }

    const suburb = await db.select({ id: suburbs.id, name: suburbs.name }).from(suburbs).where(eq(suburbs.id, idNum)).limit(1);
    if (suburb.length === 0) {
      return NextResponse.json({ detail: 'Suburb not found.' }, { status: 404 });
    }

    const links = await db
      .select({ reviewId: suburbTestimonials.reviewId })
      .from(suburbTestimonials)
      .where(eq(suburbTestimonials.suburbId, idNum));

    const linkedIds = new Set(links.map((l) => l.reviewId));

    const allReviews = await db.query.testimonials.findMany({
      with: { service: true },
    });

    return NextResponse.json({
      suburb: suburb[0],
      linked: allReviews.filter((r) => linkedIds.has(r.id)),
      available: allReviews.filter((r) => !linkedIds.has(r.id)),
    }, { status: 200 });
  } catch (error) {
    console.error('List suburb testimonials failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ detail: 'Authentication credentials were not provided.' }, { status: 401 });
    }

    const { id } = await params;
    const idNum = Number(id);
    const body = await request.json();
    const { reviewId } = body;

    if (Number.isNaN(idNum) || !reviewId) {
      return NextResponse.json({ detail: 'suburb id and reviewId are required.' }, { status: 400 });
    }

    await db
      .insert(suburbTestimonials)
      .values({ suburbId: idNum, reviewId })
      .onConflictDoNothing();

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Link testimonial failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ detail: 'Authentication credentials were not provided.' }, { status: 401 });
    }

    const { id } = await params;
    const idNum = Number(id);
    const url = new URL(request.url);
    const reviewId = url.searchParams.get('reviewId');

    if (Number.isNaN(idNum) || !reviewId) {
      return NextResponse.json({ detail: 'suburb id and reviewId are required.' }, { status: 400 });
    }

    await db
      .delete(suburbTestimonials)
      .where(
        and(
          eq(suburbTestimonials.suburbId, idNum),
          eq(suburbTestimonials.reviewId, reviewId)
        )
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Unlink testimonial failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
