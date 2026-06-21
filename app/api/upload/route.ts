import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/lib/jwt';
import fs from 'fs';
import path from 'path';

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

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `${basename}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json(
      { image_url: `/uploads/${filename}` },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: 'File upload failed' },
      { status: 500 }
    );
  }
}
