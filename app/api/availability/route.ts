import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { availability } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq, asc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/availability - Get all availability entries (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = db.select().from(availability).orderBy(asc(availability.date), asc(availability.startTime)).$dynamic();

    if (type) {
      query = query.where(eq(availability.type, type));
    }

    const items = await query;
    return NextResponse.json({ results: items });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/availability - Create a new availability entry (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, startTime, endTime, type, reason } = body;

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 });
    }

    if (type === 'closed_date' && !date) {
      return NextResponse.json({ error: 'date is required for closed_date' }, { status: 400 });
    }

    const id = `avail-${crypto.randomBytes(12).toString('hex')}`;
    await db.insert(availability).values({
      id,
      date: date || null,
      startTime: startTime || null,
      endTime: endTime || null,
      type,
      reason: reason || null,
    });

    const created = await db.select().from(availability).where(eq(availability.id, id)).limit(1);
    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error('Error creating availability entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/availability - Delete availability entry (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const date = searchParams.get('date');

    if (id) {
      await db.delete(availability).where(eq(availability.id, id));
      return NextResponse.json({ success: true });
    }
    if (date) {
      await db.delete(availability).where(eq(availability.date, date));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'id or date is required' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting availability entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
