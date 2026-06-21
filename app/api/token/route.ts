import { NextRequest, NextResponse } from 'next/server';
import { readDb, hashPassword } from '@/lib/db';
import { signJwt } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { detail: 'Username and password are required' },
        { status: 400 }
      );
    }

    const db = readDb();
    const user = db.users.find(u => u.username === username);

    if (!user) {
      return NextResponse.json(
        { detail: 'No active account found with the given credentials' },
        { status: 401 }
      );
    }

    const calculatedHash = hashPassword(password, user.salt);
    if (calculatedHash !== user.passwordHash) {
      return NextResponse.json(
        { detail: 'No active account found with the given credentials' },
        { status: 401 }
      );
    }

    // Access token (5 mins) & Refresh token (24 hours)
    const payload = {
      user_id: user.id,
      username: user.username,
      isStaff: user.isStaff
    };

    const access = signJwt(payload, 300); // 5 mins
    const refresh = signJwt({ user_id: user.id, token_type: 'refresh' }, 86400); // 24 hours

    return NextResponse.json({ access, refresh }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { detail: 'An error occurred during authentication' },
      { status: 500 }
    );
  }
}
