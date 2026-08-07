import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { beforeAfterImages } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { asc } from 'drizzle-orm';

export async function GET() {
  try {
    const images = await db
      .select()
      .from(beforeAfterImages)
      .orderBy(asc(beforeAfterImages.sortOrder), asc(beforeAfterImages.createdAt));
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('Fetch before/after images failed:', error);
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
    const { image_url, before_image_url, caption } = body;

    if (!image_url || !image_url.trim()) {
      return NextResponse.json({ image_url: ['This field is required.'] }, { status: 400 });
    }

    const maxOrder = await db
      .select({ max: beforeAfterImages.sortOrder })
      .from(beforeAfterImages)
      .orderBy(asc(beforeAfterImages.sortOrder))
      .limit(1);

    const newId = `ba-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const newRecord = {
      id: newId,
      imageUrl: image_url.trim(),
      beforeImageUrl: before_image_url && before_image_url.trim() ? before_image_url.trim() : null,
      caption: caption ? caption.trim() : null,
      sortOrder: 0,
      createdAt: new Date(),
    };

    await db.insert(beforeAfterImages).values(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Create before/after image failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
