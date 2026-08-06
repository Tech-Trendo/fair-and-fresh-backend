import { loadEnvConfig } from '@next/env';

// Load environment variables from .env files FIRST before importing db module
loadEnvConfig(process.cwd());

async function main() {
  const { db, hashPassword, postgresClient } = await import('../lib/db');
  const { users } = await import('../lib/schema');
  const { eq } = await import('drizzle-orm');
  const crypto = await import('crypto');

  const username = process.argv[2] || process.env.ADMIN_USERNAME;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.error('Usage: npx tsx scripts/set-admin-password.ts <username> <password>');
    console.error('   or: set ADMIN_USERNAME / ADMIN_PASSWORD and run it without arguments');
    process.exit(1);
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);

  // Upsert the admin account (create or overwrite password) — intended to be
  // run ONCE to recover/reset admin credentials when they are out of sync with
  // the dashboard (e.g. after the seed stopped resetting passwords on deploy).
  await db
    .insert(users)
    .values({
      id: 'usr-admin',
      username,
      passwordHash,
      salt,
      isStaff: true,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: { username, passwordHash, salt },
    });

  console.log(`✅ Admin password set for user '${username}'.`);

  if (postgresClient) {
    await postgresClient.end();
  }
  process.exit(0);
}

main();
