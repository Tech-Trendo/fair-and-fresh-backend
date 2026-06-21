import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb, Category } from '@/lib/db';
import { getAdminUser } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = readDb();
    const category = db.categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, image } = body;

    if (!title) {
      return NextResponse.json(
        { title: ['This field is required.'] },
        { status: 400 }
      );
    }

    const db = readDb();
    const categoryIdx = db.categories.findIndex(c => c.id === id);

    if (categoryIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    const updatedCategory: Category = {
      id,
      title,
      description: description || '',
      image: image || null
    };

    db.categories[categoryIdx] = updatedCategory;
    writeDb(db);

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const db = readDb();
    const category = db.categories.find(c => c.id === id);

    if (!category) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    if (body.title !== undefined) category.title = body.title;
    if (body.description !== undefined) category.description = body.description;
    if (body.image !== undefined) category.image = body.image;

    writeDb(db);

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = readDb();
    const categoryIdx = db.categories.findIndex(c => c.id === id);

    if (categoryIdx === -1) {
      return NextResponse.json({ detail: 'Not found.' }, { status: 404 });
    }

    db.categories.splice(categoryIdx, 1);
    writeDb(db);

    return new Response(null, { status: 204 }); // Django DRF usually returns 204 No Content for DELETE
  } catch (error) {
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
