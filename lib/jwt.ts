import crypto from 'crypto';
import { db } from './db';
import { blacklistedTokens } from './schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'fair_and_fresh_secret_key_12345';

function base64urlEncode(obj: any): string {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}

function base64urlDecode(str: string): any {
  return JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
}

export function signJwt(payload: any, expiresInSeconds: number): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const fullPayload = {
    ...payload,
    exp,
    iat: Math.floor(Date.now() / 1000),
  };

  const encodedHeader = base64urlEncode(header);
  const encodedPayload = base64urlEncode(fullPayload);

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyJwt(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = base64urlDecode(encodedPayload);
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAdminUser(request: Request): Promise<any | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  
  // Check blacklist in Postgres
  const blacklisted = await db
    .select()
    .from(blacklistedTokens)
    .where(eq(blacklistedTokens.token, token))
    .limit(1);
    
  if (blacklisted.length > 0) {
    return null;
  }

  const payload = verifyJwt(token);
  if (!payload || !payload.isStaff) {
    return null;
  }

  return payload;
}
