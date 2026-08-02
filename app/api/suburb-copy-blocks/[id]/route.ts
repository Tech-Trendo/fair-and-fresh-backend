import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suburbCopyBlocks } from '@/lib/schema';
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
      return NextResponse.json({ detail: 'Invalid block id.' }, { status: 400 });
    }

    const body = await request.json();
    const updates: Record<string, unknown> = {};
    if (body.regionType !== undefined) updates.regionType = body.regionType;
    if (body.blockType !== undefined) updates.blockType = body.blockType;
    if (body.content !== undefined) updates.content = body.content;

    const rows = await db
      .update(suburbCopyBlocks)
      .set(updates)
      .where(eq(suburbCopyBlocks.id, idNum))
      .returning();

    if (rows.length === 0) {
      return NextResponse.json({ detail: 'Copy block not found.' }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Update copy block failed:', error);
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
      return NextResponse.json({ detail: 'Invalid block id.' }, { status: 400 });
    }

    await db.delete(suburbCopyBlocks).where(eq(suburbCopyBlocks.id, idNum));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Delete copy block failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
