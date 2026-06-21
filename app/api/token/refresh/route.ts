import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { verifyJwt, signJwt } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { refresh } = await request.json();

    if (!refresh) {
      return NextResponse.json(
        { detail: 'Refresh token is required' },
        { status: 400 }
      );
    }

    const db = readDb();
    
    // Check if token is blacklisted
    if (db.blacklisted_tokens && db.blacklisted_tokens.includes(refresh)) {
      return NextResponse.json(
        { detail: 'Token is invalid or expired', code: 'token_not_valid' },
        { status: 401 }
      );
    }

    // Verify token signature and expiration
    const payload = verifyJwt(refresh);
    if (!payload || payload.token_type !== 'refresh') {
      return NextResponse.json(
        { detail: 'Token is invalid or expired', code: 'token_not_valid' },
        { status: 401 }
      );
    }

    const user = db.users.find(u => u.id === payload.user_id);
    if (!user) {
      return NextResponse.json(
        { detail: 'User not found', code: 'user_not_found' },
        { status: 401 }
      );
    }

    // Rotate tokens: blacklist the old refresh token
    if (!db.blacklisted_tokens) {
      db.blacklisted_tokens = [];
    }
    db.blacklisted_tokens.push(refresh);
    
    // Generate new access and refresh tokens
    const userPayload = {
      user_id: user.id,
      username: user.username,
      isStaff: user.isStaff
    };

    const newAccess = signJwt(userPayload, 300); // 5 mins
    const newRefresh = signJwt({ user_id: user.id, token_type: 'refresh' }, 86400); // 24 hours

    writeDb(db);

    return NextResponse.json(
      { access: newAccess, refresh: newRefresh },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: 'Token is invalid or expired', code: 'token_not_valid' },
      { status: 401 }
    );
  }
}
