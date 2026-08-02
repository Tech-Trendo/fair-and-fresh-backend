// Shared helpers for the programmatic suburb page network.

export const REGION_LABELS: Record<string, string> = {
  "brisbane-city-inner": "Inner City Brisbane",
  "brisbane-north": "Brisbane North",
  "brisbane-south": "Brisbane South",
  "brisbane-east": "Brisbane East",
  "brisbane-west": "Brisbane West",
  "gold-coast": "Gold Coast",
  "sunshine-coast-moreton-bay": "Sunshine Coast & Moreton Bay",
  "ipswich-logan": "Ipswich & Logan",
};

export function getRegionLabel(region: string): string {
  return REGION_LABELS[region] ?? region.replace(/-/g, " ");
}

// FNV-1a 32-bit — stable across processes/rebuilds (used instead of Math.random so
// copy-block rotation does not change on every render or revalidation).
export function hashString(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// Deterministically pick `count` items from a pool using a stable salt (e.g. suburb id).
// Same inputs always produce the same selection.
export function pickByHash<T>(items: T[], salt: string, count: number): T[] {
  if (items.length === 0) return [];
  const n = Math.min(count, items.length);
  const chosen: T[] = [];
  const used = new Set<number>();
  let seed = hashString(salt);
  let guard = 0;
  while (chosen.length < n && guard < 5000) {
    const idx = seed % items.length;
    if (!used.has(idx)) {
      used.add(idx);
      chosen.push(items[idx]);
    }
    seed = (seed + 0x9e3779b9) >>> 0;
    guard++;
  }
  // Safety fallback: fill remaining slots with unused indices in order.
  for (let i = 0; i < items.length && chosen.length < n; i++) {
    if (!used.has(i)) chosen.push(items[i]);
  }
  return chosen;
}
