import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq } from 'drizzle-orm';

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
    const { isRead } = body;

    if (typeof isRead !== 'boolean') {
      return NextResponse.json(
        { isRead: ['This field must be a boolean.'] },
        { status: 400 }
      );
    }

    // Check if message exists
    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db
      .update(contactMessages)
      .set({ isRead })
      .where(eq(contactMessages.id, id));

    const updated = {
      ...existing[0],
      isRead,
    };

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Update contact message status failed:', error);
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

    // Check if message exists
    const existing = await db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(contactMessages).where(eq(contactMessages.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete contact message failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
