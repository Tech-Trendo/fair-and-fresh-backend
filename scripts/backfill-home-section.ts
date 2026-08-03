import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

async function main() {
  const { db, postgresClient } = await import('../lib/db');
  const { services } = await import('../lib/schema');
  const { eq } = await import('drizzle-orm');

  // Homepage has exactly THREE sections:
  //   - 'steam'       → Steam Cleaning (default tab) — every service NOT listed below stays here
  //   - 'maintenance' → Home Maintenance
  //   - 'specialized' → Specialized Cleaning & Restoration
  const mapping: Record<string, string> = {
    // Section 1: Specialized Cleaning & Restoration — only Flood Damage Restoration
    'flood-damage-restoration-brisbane': 'specialized',

    // Section 2: Home Maintenance
    'lawn-mowing-brisbane': 'maintenance',
    'mould-cleaning-brisbane': 'maintenance',
    'gutter-cleaning-brisbane': 'maintenance',
    'bond-cleaning-brisbane': 'maintenance',
    'tile-grout-cleaning-brisbane': 'maintenance',

    // Section 3: Remaining ALL Steam Cleaning (carpet, upholstery, rug, mattress,
    // curtains, scotch-guard, carpet-repair, ndis) — left as 'steam' (default).
  };

  const all = await db.select({ id: services.id, slug: services.slug, homeSection: services.homeSection }).from(services);

  for (const row of all) {
    // Everything NOT explicitly in 'specialized'/'maintenance' belongs to the
    // default Steam Cleaning section (explicit + idempotent).
    const section = mapping[row.slug] || 'steam';
    if (section !== row.homeSection) {
      await db.update(services).set({ homeSection: section }).where(eq(services.id, row.id));
      console.log(`→ ${row.slug}: ${row.homeSection ?? 'null'} → ${section}`);
    } else {
      console.log(`✓ ${row.slug}: already ${section}`);
    }
  }

  if (postgresClient) await postgresClient.end();
  process.exit(0);
}

main();