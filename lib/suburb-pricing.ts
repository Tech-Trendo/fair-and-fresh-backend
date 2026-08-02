// Phase 5 — suburb-specific pricing.
// Resolution order:
//   1. Explicit priceOverride in suburb_service_pricing (if present) — used as-is.
//   2. Otherwise service.basePrice * suburb.priceMultiplier.
//   3. No base price configured -> null (callers must hide pricing, not invent one).
import { db } from './db';
import { suburbServicePricing, suburbs, services } from './schema';
import { eq, and } from 'drizzle-orm';

export interface SuburbPrice {
  price: number | null;
  source: 'override' | 'multiplier' | 'none';
}

function roundToNearest5(value: number): number {
  return Math.round(value / 5) * 5;
}

export async function getSuburbPrice(serviceId: string, suburbId: number): Promise<SuburbPrice> {
  // 1. Explicit override
  const override = await db
    .select({ priceOverride: suburbServicePricing.priceOverride })
    .from(suburbServicePricing)
    .where(
      and(
        eq(suburbServicePricing.serviceId, serviceId),
        eq(suburbServicePricing.suburbId, suburbId)
      )
    )
    .limit(1);

  if (override[0]?.priceOverride != null) {
    return { price: roundToNearest5(Number(override[0].priceOverride)), source: 'override' };
  }

  // 2. basePrice * priceMultiplier
  const [svc, sub] = await Promise.all([
    db.select({ basePrice: services.basePrice }).from(services).where(eq(services.id, serviceId)).limit(1),
    db
      .select({ priceMultiplier: suburbs.priceMultiplier })
      .from(suburbs)
      .where(eq(suburbs.id, suburbId))
      .limit(1),
  ]);

  const base = svc[0]?.basePrice;
  if (base == null) return { price: null, source: 'none' };

  const multiplier = Number(sub[0]?.priceMultiplier ?? '1');
  const raw = Number(base) * multiplier;
  return { price: roundToNearest5(raw), source: 'multiplier' };
}

export function formatSuburbPrice(price: number): string {
  return `$${price.toLocaleString('en-AU')}`;
}
