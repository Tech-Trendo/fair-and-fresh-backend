import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { suburbCopyBlocks } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const regionType = url.searchParams.get('regionType');
    const blockType = url.searchParams.get('blockType');

    const rows = await db
      .select()
      .from(suburbCopyBlocks)
      .orderBy(asc(suburbCopyBlocks.regionType), asc(suburbCopyBlocks.blockType));

    const filtered = rows.filter(
      (r) =>
        (!regionType || r.regionType === regionType) &&
        (!blockType || r.blockType === blockType)
    );

    return NextResponse.json({ count: filtered.length, results: filtered }, { status: 200 });
  } catch (error) {
    console.error('List copy blocks failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ detail: 'Authentication credentials were not provided.' }, { status: 401 });
    }

    const body = await request.json();
    const { regionType, blockType, content } = body;

    if (!regionType || !blockType || !content) {
      return NextResponse.json(
        { detail: 'regionType, blockType and content are required.' },
        { status: 400 }
      );
    }

    const row = await db
      .insert(suburbCopyBlocks)
      .values({ regionType, blockType, content })
      .returning();

    return NextResponse.json(row[0], { status: 201 });
  } catch (error) {
    console.error('Create copy block failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
