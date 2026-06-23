import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactMessages } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';
import { desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    const errors: Record<string, string[]> = {};

    if (!name || !name.trim()) {
      errors.name = ['This field is required.'];
    }
    if (!email || !email.trim()) {
      errors.email = ['This field is required.'];
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = ['Enter a valid email address.'];
      }
    }
    if (!message || !message.trim()) {
      errors.message = ['This field is required.'];
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(errors, { status: 400 });
    }

    const newId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    const newRecord = {
      id: newId,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      subject: subject ? subject.trim() : null,
      message: message.trim(),
      createdAt: new Date(),
      isRead: false,
    };

    await db.insert(contactMessages).values(newRecord);

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Submit contact message failed:', error);
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

    // Fetch messages from schema
    const messages = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));

    const paginated = paginate(messages, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    console.error('Fetch contact messages failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
