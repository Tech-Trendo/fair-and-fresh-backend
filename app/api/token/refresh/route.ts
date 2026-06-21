import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { blacklistedTokens, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
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

    // 1. Check if token is blacklisted in Postgres
    const blacklisted = await db
      .select()
      .from(blacklistedTokens)
      .where(eq(blacklistedTokens.token, refresh))
      .limit(1);

    if (blacklisted.length > 0) {
      return NextResponse.json(
        { detail: 'Token is invalid or expired', code: 'token_not_valid' },
        { status: 401 }
      );
    }

    // 2. Verify token signature and expiration
    const payload = verifyJwt(refresh);
    if (!payload || payload.token_type !== 'refresh') {
      return NextResponse.json(
        { detail: 'Token is invalid or expired', code: 'token_not_valid' },
        { status: 401 }
      );
    }

    // 3. Verify user exists in database
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.user_id))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json(
        { detail: 'User not found', code: 'user_not_found' },
        { status: 401 }
      );
    }

    // 4. Blacklist the old refresh token
    await db.insert(blacklistedTokens).values({ token: refresh });
    
    // 5. Generate new access and refresh tokens
    const userPayload = {
      user_id: user.id,
      username: user.username,
      isStaff: user.isStaff
    };

    const newAccess = signJwt(userPayload, 300); // 5 mins
    const newRefresh = signJwt({ user_id: user.id, token_type: 'refresh' }, 86400); // 24 hours

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
