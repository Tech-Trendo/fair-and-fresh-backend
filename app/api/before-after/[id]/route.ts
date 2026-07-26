import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beforeAfterImages } from '@/lib/schema';
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
    const { sort_order, image_url, caption } = body;

    const updates: Record<string, any> = {};
    if (sort_order !== undefined) updates.sortOrder = sort_order;
    if (image_url !== undefined) updates.imageUrl = image_url;
    if (caption !== undefined) updates.caption = caption;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ detail: 'No fields to update' }, { status: 400 });
    }

    await db.update(beforeAfterImages).set(updates).where(eq(beforeAfterImages.id, id));

    return NextResponse.json({ message: 'Updated' }, { status: 200 });
  } catch (error) {
    console.error('Update before/after image failed:', error);
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

    await db.delete(beforeAfterImages).where(eq(beforeAfterImages.id, id));

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete before/after image failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
