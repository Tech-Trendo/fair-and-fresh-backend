import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/schema';
import { getAdminUser } from '@/lib/jwt';
import { paginate } from '@/lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const categoriesList = await db.select().from(categories);
    const paginated = paginate(categoriesList, request.nextUrl);
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

    const newId = `cat-${Date.now()}`;
    await db.insert(categories).values({
      id: newId,
      title,
      description: description || '',
      image: image || null
    });

    const newCategory = {
      id: newId,
      title,
      description: description || '',
      image: image || null
    };

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
