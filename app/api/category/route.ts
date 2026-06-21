import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Category } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const db = readDb();
    const paginated = paginate(db.categories, request.nextUrl);
    return NextResponse.json(paginated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, image } = body;

    if (!title) {
      return NextResponse.json(
        { title: ['This field is required.'] },
        { status: 400 }
      );
    }

    const db = readDb();
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      title,
      description: description || '',
      image: image || null
    };

    db.categories.push(newCategory);
    writeDb(db);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
