import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    const category = result[0];

    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
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
    const { title, description, image } = body;

    if (!title) {
      return NextResponse.json(
        { title: ['This field is required.'] },
        { status: 400 }
      );
    }

    const check = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.update(categories)
      .set({
        title,
        description: description || '',
        image: image || null
      })
      .where(eq(categories.id, id));

    const updatedCategory = {
      id,
      title,
      description: description || '',
      image: image || null
    };

    return NextResponse.json(updatedCategory, { status: 200 });
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

    const check = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    const category = check[0];
    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const updateObj: Partial<typeof categories.$inferSelect> = {};
    if (body.title !== undefined) updateObj.title = body.title;
    if (body.description !== undefined) updateObj.description = body.description;
    if (body.image !== undefined) updateObj.image = body.image;

    await db.update(categories).set(updateObj).where(eq(categories.id, id));

    return NextResponse.json({ ...category, ...updateObj }, { status: 200 });
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
    const check = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    if (check.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(categories).where(eq(categories.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
