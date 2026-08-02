// Phase 2 seed runner — suburb page network.
// - Geocodes every suburb via the Geoapify Geocoding API (REAL coordinates + postcodes;
//   nothing is fabricated). Requires GEOAPIFY_API_KEY in the environment.
// - Idempotent: existing suburbs are skipped, copy blocks are only added when a
//   (regionType, blockType) pool is empty, combo targets use onConflictDoNothing.
//
// Run: npx tsx scripts/seed-suburbs.ts
import { db, postgresClient, slugify } from '../lib/db';
import { suburbs, suburbCopyBlocks, services, comboPageTargets } from '../lib/schema';
import { SUBURBS_SEED, COPY_BLOCKS_SEED } from './data/suburbs-data';
import { eq, and, asc } from 'drizzle-orm';

const API_KEY = process.env.GEOAPIFY_API_KEY;
if (!API_KEY) {
  console.error('❌ GEOAPIFY_API_KEY is not set. Add it to .env and re-run.');
  process.exit(1);
}

interface GeocodeResult {
  lat: number;
  lng: number;
  postcode: string | null;
  formatted: string;
  state: string | null;
}

async function geocode(name: string): Promise<GeocodeResult | null> {
  const url =
    'https://api.geoapify.com/v1/geocode/search' +
    `?text=${encodeURIComponent(`${name}, Queensland, Australia`)}` +
    '&filter=countrycode:au&limit=1' +
    `&apiKey=${API_KEY}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) {
      console.warn(`  ⚠ geocode HTTP ${res.status} for ${name}`);
      return null;
    }
    const data = (await res.json()) as {
      features?: { properties?: { lat?: number; lon?: number; postcode?: string | null; formatted?: string; state?: string | null } }[];
    };
    const props = data.features?.[0]?.properties;
    if (!props || props.lat == null || props.lon == null) return null;
    return {
      lat: props.lat,
      lng: props.lon,
      postcode: props.postcode ?? null,
      formatted: props.formatted ?? '',
      state: props.state ?? null,
    };
  }
  return null;
}

async function main() {
  console.log('🌱 Seeding suburb network...');

  // Existing suburbs (skip on re-run)
  const existing = await db.select({ slug: suburbs.slug }).from(suburbs);
  const existingSlugs = new Set(existing.map((s) => s.slug));

  let inserted = 0;
  let skipped = 0;
  const warnings: string[] = [];

  for (let i = 0; i < SUBURBS_SEED.length; i++) {
    const seed = SUBURBS_SEED[i];
    const slug = slugify(seed.name);

    if (existingSlugs.has(slug)) {
      skipped++;
      continue;
    }

    const geo = await geocode(seed.name);
    // Polite rate limiting for the free tier
    await new Promise((r) => setTimeout(r, 220));

    if (!geo) {
      warnings.push(`${seed.name} — no geocode result (SKIPPED)`);
      console.warn(`  ⚠ skipped: ${seed.name} (no geocode result)`);
      continue;
    }
    if (geo.state && !geo.state.includes('Queensland')) {
      warnings.push(`${seed.name} — geocoded to ${geo.formatted} (state=${geo.state}); please verify`);
      console.warn(`  ⚠ ${seed.name} -> ${geo.formatted}`);
    }

    await db.insert(suburbs).values({
      slug,
      name: seed.name,
      region: seed.region,
      regionType: seed.regionType,
      postcode: geo.postcode,
      lat: String(geo.lat.toFixed(6)),
      lng: String(geo.lng.toFixed(6)),
      priceMultiplier: '1.00',
      isActive: true,
      // localLandmark / metaDescription intentionally blank — fill via dashboard
    });

    existingSlugs.add(slug);
    inserted++;
    if (inserted % 20 === 0) console.log(`  ...${inserted} suburbs seeded so far`);
  }

  console.log(`✅ Suburbs: ${inserted} inserted, ${skipped} skipped (already present).`);

  // ── Copy blocks (only seed a pool if it is empty, to preserve admin edits) ──
  const poolTypes = [...new Set(COPY_BLOCKS_SEED.map((b) => `${b.regionType}:${b.blockType}`))];
  let blockInserted = 0;
  for (const key of poolTypes) {
    const [regionType, blockType] = key.split(':');
    const existingCount = await db
      .select({ id: suburbCopyBlocks.id })
      .from(suburbCopyBlocks)
      .where(
        and(
          eq(suburbCopyBlocks.regionType, regionType),
          eq(suburbCopyBlocks.blockType, blockType)
        )
      );
    if (existingCount.length > 0) continue; // pool already has content — preserve admin edits
    const toInsert = COPY_BLOCKS_SEED.filter(
      (b) => b.regionType === regionType && b.blockType === blockType
    );
    if (toInsert.length === 0) continue;
    await db.insert(suburbCopyBlocks).values(toInsert);
    blockInserted += toInsert.length;
  }

  console.log(`✅ Copy blocks: ${blockInserted} rows ensured (idempotent upsert).`);

  // ── Combo page targets: top-4 services (by sort order) x balanced ~20 suburbs ──
  const topServices = await db
    .select({ id: services.id, slug: services.slug, name: services.name })
    .from(services)
    .orderBy(asc(services.sortOrder))
    .limit(4);

  const seededSuburbs = await db
    .select({ id: suburbs.id, slug: suburbs.slug, name: suburbs.name, region: suburbs.region })
    .from(suburbs)
    .where(eq(suburbs.isActive, true));

  // Balanced regional spread: up to 2 suburbs per region, name-ordered, cap 20.
  const byRegion = new Map<string, typeof seededSuburbs>();
  for (const s of seededSuburbs) {
    const list = byRegion.get(s.region) ?? [];
    list.push(s);
    byRegion.set(s.region, list);
  }
  const regionOrder = [
    'brisbane-city-inner', 'brisbane-north', 'brisbane-south', 'brisbane-east', 'brisbane-west',
    'gold-coast', 'sunshine-coast-moreton-bay', 'ipswich-logan',
  ];
  const comboSuburbs: typeof seededSuburbs = [];
  for (const region of regionOrder) {
    const list = (byRegion.get(region) ?? []).sort((a, b) => a.name.localeCompare(b.name));
    for (const s of list.slice(0, 2)) {
      comboSuburbs.push(s);
      if (comboSuburbs.length >= 20) break;
    }
    if (comboSuburbs.length >= 20) break;
  }

  let comboInserted = 0;
  for (const service of topServices) {
    for (const suburb of comboSuburbs) {
      await db
        .insert(comboPageTargets)
        .values({ serviceId: service.id, suburbId: suburb.id, isActive: true })
        .onConflictDoNothing();
      comboInserted++;
    }
  }
  console.log(
    `✅ Combo targets: ${topServices.length} services x ${comboSuburbs.length} suburbs = ${comboInserted} (unique) — ` +
      comboSuburbs.map((s) => s.name).join(', ')
  );

  if (warnings.length > 0) {
    console.warn('\n⚠ FLAGGED (verify these in the dashboard):');
    warnings.forEach((w) => console.warn('  - ' + w));
  }

  console.log('\n🌱 Done.');
  await postgresClient.end();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
