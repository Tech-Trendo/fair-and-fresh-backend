import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { siteContent } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq, asc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/site-content - Get all site content (public, no auth needed for GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const group = searchParams.get('group');
    const key = searchParams.get('key');

    if (key) {
      const item = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);
      if (!item.length) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 });
      }
      return NextResponse.json(item[0]);
    }

    let query = db.select().from(siteContent).orderBy(asc(siteContent.group), asc(siteContent.key));

    if (group) {
      const items = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.group, group))
        .orderBy(asc(siteContent.key));
      return NextResponse.json({ results: items });
    }

    const items = await query;
    return NextResponse.json({ results: items });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/site-content - Update site content (admin only)
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { updates } = body; // Array of { key, value } objects

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'updates array is required' }, { status: 400 });
    }

    const results = [];

    for (const update of updates) {
      const { key, value } = update;
      if (!key || value === undefined) {
        continue;
      }

      // Check if exists
      const existing = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(siteContent)
          .set({ value, updatedAt: new Date() })
          .where(eq(siteContent.key, key));
      } else {
        const id = `sc-${crypto.randomBytes(12).toString('hex')}`;
        await db.insert(siteContent).values({
          id,
          key,
          value,
          label: key,
          group: 'site_settings',
          type: 'text',
        });
      }

      results.push({ key, value });
    }

    return NextResponse.json({ success: true, updated: results });
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/site-content - Create new site content entry (admin only)
export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, value, label, group, type } = body;

    if (!key || !value || !label || !group) {
      return NextResponse.json({ error: 'key, value, label, and group are required' }, { status: 400 });
    }

    // Check if key already exists
    const existing = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, key))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Key already exists' }, { status: 409 });
    }

    const id = `sc-${crypto.randomBytes(12).toString('hex')}`;
    await db.insert(siteContent).values({
      id,
      key,
      value,
      label,
      group,
      type: type || 'text',
    });

    const created = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.id, id))
      .limit(1);

    return NextResponse.json(created[0], { status: 201 });
  } catch (error) {
    console.error('Error creating site content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/site-content - Delete site content entry (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const id = searchParams.get('id');

    const protectedKeys = ['working_hours_start', 'working_hours_end'];

    if (key) {
      if (protectedKeys.includes(key)) {
        return NextResponse.json({ error: 'Cannot delete protected system key' }, { status: 403 });
      }
      await db.delete(siteContent).where(eq(siteContent.key, key));
      return NextResponse.json({ success: true });
    }

    if (id) {
      const item = await db.select().from(siteContent).where(eq(siteContent.id, id)).limit(1);
      if (item.length > 0 && protectedKeys.includes(item[0].key)) {
        return NextResponse.json({ error: 'Cannot delete protected system key' }, { status: 403 });
      }
      await db.delete(siteContent).where(eq(siteContent.id, id));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'key or id is required' }, { status: 400 });
  } catch (error) {
    console.error('Error deleting site content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
