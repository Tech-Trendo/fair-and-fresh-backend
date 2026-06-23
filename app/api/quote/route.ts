import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quotationRequests } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { desc } from 'drizzle-orm';

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

    const newRecord = {
      id: newId,
      services: services,
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

    const paginated = paginate(quotes, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    console.error('Fetch quotation requests failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
