import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { suburbs } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq } from 'drizzle-orm';

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ detail: 'Authentication credentials were not provided.' }, { status: 401 });
    }

    const { id } = await params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ detail: 'Invalid suburb id.' }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    const mapField = (key: string, col: string) => {
      if (body[key] !== undefined) updates[col] = body[key];
    };

    if (body.name !== undefined && body.name) {
      const slug = slugify(body.name);
      const dup = await db.select({ id: suburbs.id }).from(suburbs).where(eq(suburbs.slug, slug)).limit(1);
      if (dup.length > 0 && dup[0].id !== idNum) {
        return NextResponse.json({ detail: `A suburb with slug "${slug}" already exists.` }, { status: 409 });
      }
      updates.slug = slug;
      updates.name = body.name;
    }

    mapField('region', 'region');
    mapField('regionType', 'regionType');
    mapField('postcode', 'postcode');
    mapField('lat', 'lat');
    mapField('lng', 'lng');
    mapField('localLandmark', 'localLandmark');
    mapField('metaDescription', 'metaDescription');
    mapField('isActive', 'isActive');
    if (body.travelTimeMins !== undefined) updates.travelTimeMins = body.travelTimeMins === null ? null : Number(body.travelTimeMins);
    if (body.priceMultiplier !== undefined) updates.priceMultiplier = String(body.priceMultiplier ?? '1.00');

    const rows = await db
      .update(suburbs)
      .set(updates)
      .where(eq(suburbs.id, idNum))
      .returning();

    if (rows.length === 0) {
      return NextResponse.json({ detail: 'Suburb not found.' }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Update suburb failed:', error);
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
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ detail: 'Invalid suburb id.' }, { status: 400 });
    }

    await db.delete(suburbs).where(eq(suburbs.id, idNum));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete suburb failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
