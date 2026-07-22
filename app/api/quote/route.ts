import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotationRequests, services as servicesTable } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { desc } from 'drizzle-orm';

const STATIC_SERVICE_MAP: Record<string, string> = {
  'bond-cleaning': 'Bond Cleaning',
  'carpet-and-rug': 'Carpet and Rug Cleaning',
  'upholstery-and-car-seats': 'Upholstery and Car Seat Cleaning',
  'mattress': 'Mattress Cleaning',
  'curtain': 'Curtain Cleaning',
  'car-detailing': 'Car Detailing',
  'lawn-mowing': 'Lawn Mowing',
  'flood-damage': 'Flood Damage Restoration',
};

async function getServiceMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const [key, value] of Object.entries(STATIC_SERVICE_MAP)) {
    map.set(key.toLowerCase(), value);
  }

  try {
    const dbServices = await db
      .select({ id: servicesTable.id, name: servicesTable.name, slug: servicesTable.slug })
      .from(servicesTable);

    for (const srv of dbServices) {
      if (srv.id) map.set(srv.id.toLowerCase(), srv.name);
      if (srv.slug) map.set(srv.slug.toLowerCase(), srv.name);
      if (srv.name) map.set(srv.name.toLowerCase(), srv.name);
    }
  } catch (err) {
    console.error('Error fetching services for name mapping:', err);
  }

  return map;
}

async function resolveServiceNames(serviceIdentifiers: string[]): Promise<string[]> {
  if (!serviceIdentifiers || !Array.isArray(serviceIdentifiers) || serviceIdentifiers.length === 0) {
    return [];
  }

  const map = await getServiceMap();
  return serviceIdentifiers.map((item) => {
    if (!item) return item;
    const lower = item.toLowerCase();
    return map.get(lower) || item;
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { services, preferred_date, preferred_time, name, phone, email, street, city, additional_notes } = body;

    const errors: Record<string, string[]> = {};

    if (!services || !Array.isArray(services) || services.length === 0) {
      errors.services = ['Select at least one service.'];
    }
    if (!name || !name.trim()) {
      errors.name = ['This field is required.'];
    }
    if (!phone || !phone.trim()) {
      errors.phone = ['This field is required.'];
    }
    if (!email || !email.trim()) {
      errors.email = ['This field is required.'];
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = ['Enter a valid email address.'];
      }
    }
    if (!street || !street.trim()) {
      errors.street = ['This field is required.'];
    }
    if (!city || !city.trim()) {
      errors.city = ['This field is required.'];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(errors, { status: 400 });
    }

    const newId = `qte-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const resolvedServices = await resolveServiceNames(services);

    const newRecord = {
      id: newId,
      services: resolvedServices,
      preferredDate: preferred_date ? preferred_date.trim() : null,
      preferredTime: preferred_time ? preferred_time.trim() : null,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      street: street.trim(),
      city: city.trim(),
      additionalNotes: additional_notes ? additional_notes.trim() : null,
      createdAt: new Date(),
      status: 'Pending',
    };

    await db.insert(quotationRequests).values(newRecord);

    // Trigger WhatsApp notification asynchronously (fire-and-forget)
    try {
      const newbody = {
        id: newRecord.id,
        services: newRecord.services,
        preferred_date: newRecord.preferredDate,
        preferred_time: newRecord.preferredTime,
        name: newRecord.name,
        phone: newRecord.phone,
        email: newRecord.email,
        street: newRecord.street,
        city: newRecord.city,
        additional_notes: newRecord.additionalNotes,
        status: newRecord.status,
        created_at: newRecord.createdAt.toISOString(),
      };
      
      fetch("https://notify-booking-4603.twil.io/sender1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newbody),
      }).catch(err => {
        console.error("WhatsApp notification request failed:", err);
      });
    } catch (e) {
      console.error("Twilio send error:", e);
    }

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Submit quotation request failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const quotes = await db
      .select()
      .from(quotationRequests)
      .orderBy(desc(quotationRequests.createdAt));

    const map = await getServiceMap();

    const resolvedQuotes = quotes.map((q) => {
      const resolvedServices = (q.services || []).map((s: string) => {
        if (!s) return s;
        return map.get(s.toLowerCase()) || s;
      });
      return {
        ...q,
        services: resolvedServices,
      };
    });

    const paginated = paginate(resolvedQuotes, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    console.error('Fetch quotation requests failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

