import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotationRequests } from '@/lib/schema';
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
    const { status } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json(
        { status: ['This field is required and must be a string.'] },
        { status: 400 }
      );
    }

    // Check if quotation request exists
    const existing = await db
      .select()
      .from(quotationRequests)
      .where(eq(quotationRequests.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db
      .update(quotationRequests)
      .set({ status })
      .where(eq(quotationRequests.id, id));

    const updated = {
      ...existing[0],
      status,
    };

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Update quotation request status failed:', error);
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

    // Check if quotation request exists
    const existing = await db
      .select()
      .from(quotationRequests)
      .where(eq(quotationRequests.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    await db.delete(quotationRequests).where(eq(quotationRequests.id, id));

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Delete quotation request failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
