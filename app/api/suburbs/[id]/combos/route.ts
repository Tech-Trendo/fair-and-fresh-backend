import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { services, comboPageTargets } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { eq, and, asc } from 'drizzle-orm';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const idNum = Number(id);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ detail: 'Invalid suburb id.' }, { status: 400 });
    }

    const [svcList, targets] = await Promise.all([
      db.select({ id: services.id, name: services.name, slug: services.slug }).from(services).orderBy(asc(services.sortOrder)),
      db
        .select({ serviceId: comboPageTargets.serviceId, isActive: comboPageTargets.isActive })
        .from(comboPageTargets)
        .where(eq(comboPageTargets.suburbId, idNum)),
    ]);

    const targetMap = new Map(targets.map((t) => [t.serviceId, t.isActive]));
    return NextResponse.json({
      services: svcList.map((s) => ({ ...s, enabled: targetMap.get(s.id) ?? false })),
    });
  } catch (error) {
    console.error('List combo targets failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json({ detail: 'Authentication credentials were not provided.' }, { status: 401 });
    }

    const { id } = await params;
    const idNum = Number(id);
    const body = await request.json();
    const { serviceId, enabled } = body;

    if (Number.isNaN(idNum) || !serviceId) {
      return NextResponse.json({ detail: 'suburb id and serviceId are required.' }, { status: 400 });
    }

    if (enabled) {
      await db
        .insert(comboPageTargets)
        .values({ serviceId, suburbId: idNum, isActive: true })
        .onConflictDoUpdate({
          target: [comboPageTargets.serviceId, comboPageTargets.suburbId],
          set: { isActive: true },
        });
    } else {
      const existing = await db
        .select({ id: comboPageTargets.id })
        .from(comboPageTargets)
        .where(
          and(
            eq(comboPageTargets.serviceId, serviceId),
            eq(comboPageTargets.suburbId, idNum)
          )
        )
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(comboPageTargets)
          .set({ isActive: false })
          .where(eq(comboPageTargets.id, existing[0].id));
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Update combo target failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
