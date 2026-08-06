import { NextRequest, NextResponse } from 'next/server';
import { db, hashPassword } from '@/lib/db';
import { users, blacklistedTokens } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAdminUser } from '@/lib/jwt';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    // Only an authenticated staff account can change a password.
    const admin = await getAdminUser(request);
    if (!admin) {
      return NextResponse.json(
        { detail: 'Authentication credentials were not provided.' },
        { status: 401 }
      );
    }

    const { current_password, new_password, refresh_token } = await request.json();

    if (typeof current_password !== 'string' || typeof new_password !== 'string' || !current_password || !new_password) {
      return NextResponse.json(
        { detail: 'Current password and new password are required.' },
        { status: 400 }
      );
    }

    if (new_password.length < 8) {
      return NextResponse.json(
        { detail: 'New password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    if (new_password === current_password) {
      return NextResponse.json(
        { detail: 'New password must be different from the current password.' },
        { status: 400 }
      );
    }

    // Load the user, then verify the current password before making any change.
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, admin.user_id))
      .limit(1);

    const user = userResult[0];
    if (!user) {
      return NextResponse.json(
        { detail: 'User not found.' },
        { status: 404 }
      );
    }

    const currentHash = hashPassword(current_password, user.salt);
    if (currentHash !== user.passwordHash) {
      return NextResponse.json(
        { detail: 'Current password is incorrect.' },
        { status: 400 }
      );
    }

    // Re-salt and re-hash the new password, then persist.
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newPasswordHash = hashPassword(new_password, newSalt);

    await db
      .update(users)
      .set({ passwordHash: newPasswordHash, salt: newSalt })
      .where(eq(users.id, user.id));

    // Invalidate the current session so the new password takes effect everywhere:
    // blacklist the refresh token used by this dashboard session.
    if (typeof refresh_token === 'string' && refresh_token) {
      await db.insert(blacklistedTokens).values({ token: refresh_token });
    }

    return NextResponse.json(
      { detail: 'Password updated successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Change password failed:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
