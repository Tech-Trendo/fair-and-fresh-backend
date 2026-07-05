import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/jwt';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { detail: 'No file provided' },
        { status: 400 }
      );
    }

    const ext = file.name.split('.').pop() || '';
    const basename = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `uploads/${basename}-${Date.now()}.${ext}`;

    const { url } = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json(
      { image_url: url },
      { status: 201 }
    );
  } catch (error) {
    console.error('File upload failed:', error);
    return NextResponse.json(
      { detail: 'File upload failed' },
      { status: 500 }
    );
  }
}
