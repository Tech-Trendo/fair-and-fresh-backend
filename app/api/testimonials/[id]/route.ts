import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq } from 'drizzle-orm';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { author, content, rating, service_id, location } = body;

    const updates: Record<string, any> = {};
    if (author !== undefined) {
      if (!author.trim()) {
        return NextResponse.json({ detail: 'Author is required.' }, { status: 400 });
      }
      updates.author = author.trim();
    }
    if (content !== undefined) {
      if (!content.trim()) {
        return NextResponse.json({ detail: 'Content is required.' }, { status: 400 });
      }
      updates.content = content.trim();
    }
    if (rating !== undefined) {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json({ detail: 'Rating must be a number between 1 and 5.' }, { status: 400 });
      }
      updates.rating = Math.floor(rating);
    }
    if (service_id !== undefined) {
      if (!service_id) {
        return NextResponse.json({ detail: 'Service is required.' }, { status: 400 });
      }
      updates.serviceId = service_id;
    }
    if (location !== undefined) {
      updates.location = location && location.trim() ? location.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ detail: 'No fields to update' }, { status: 400 });
    }

    await db.update(testimonials).set(updates).where(eq(testimonials.id, id));

    return NextResponse.json({ message: 'Updated' }, { status: 200 });
  } catch (error) {
    console.error('Update testimonial failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await db.delete(testimonials).where(eq(testimonials.id, id));

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete testimonial failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
