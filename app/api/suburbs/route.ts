import { NextRequest, NextResponse } from 'next/server';
import { db, slugify } from '@/lib/db';
import { suburbs } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { getRegionLabel } from '@/lib/suburbs';
import { asc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const grouped = url.searchParams.get('grouped') === 'true';
    const includeInactive = url.searchParams.get('all') === 'true';

    const rows = await db
      .select()
      .from(suburbs)
      .orderBy(asc(suburbs.name));

    const visible = includeInactive ? rows : rows.filter((r) => r.isActive);

    if (grouped) {
      const groups = new Map<string, typeof visible>();
      for (const r of visible) {
        const list = groups.get(r.region) ?? [];
        list.push(r);
        groups.set(r.region, list);
      }
      return NextResponse.json({
        groups: [...groups.entries()].map(([region, items]) => ({
          region,
          label: getRegionLabel(region),
          suburbs: items.map(({ id, name, slug }) => ({ id, name, slug })),
        })),
      });
    }

    return NextResponse.json({ count: visible.length, results: visible }, { status: 200 });
  } catch (error) {
    console.error('List suburbs failed:', error);
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
    const {
      name,
      region,
      regionType,
      postcode,
      lat,
      lng,
      travelTimeMins,
      localLandmark,
      priceMultiplier,
      metaDescription,
      isActive,
    } = body;

    if (!name || !region || !regionType) {
      return NextResponse.json(
        { detail: 'name, region and regionType are required.' },
        { status: 400 }
      );
    }

    const slug = slugify(name);
    const existing = await db.select({ id: suburbs.id }).from(suburbs).where(eq(suburbs.slug, slug)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ detail: `A suburb with slug "${slug}" already exists.` }, { status: 409 });
    }

    const row = await db
      .insert(suburbs)
      .values({
        slug,
        name,
        region,
        regionType,
        postcode: postcode ?? null,
        lat: lat != null ? String(lat) : null,
        lng: lng != null ? String(lng) : null,
        travelTimeMins: travelTimeMins != null ? Number(travelTimeMins) : null,
        localLandmark: localLandmark ?? null,
        priceMultiplier: priceMultiplier != null ? String(priceMultiplier) : '1.00',
        metaDescription: metaDescription ?? null,
        isActive: isActive !== false,
      })
      .returning();

    return NextResponse.json(row[0], { status: 201 });
  } catch (error) {
    console.error('Create suburb failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
