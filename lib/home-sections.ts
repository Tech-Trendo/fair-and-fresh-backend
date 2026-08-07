// Home service section (homepage tab grouping) helpers.
// Services store the slug of a home_service_categories row in `home_section`.
// The first three slugs below are the legacy hardcoded values ('steam',
// 'maintenance', 'specialized'); they are mapped onto the seeded category
// slugs so pre-existing rows keep working without a data migration.

export const DEFAULT_HOME_SECTIONS = [
  { slug: "steam-cleaning", title: "Steam Cleaning" },
  { slug: "home-maintenance", title: "Home Maintenance" },
  { slug: "specialized-cleaning-restoration", title: "Specialized Cleaning & Restoration" },
] as const;

const LEGACY_SECTION_SLUGS: Record<string, string> = {
  steam: "steam-cleaning",
  maintenance: "home-maintenance",
  specialized: "specialized-cleaning-restoration",
};

export function normalizeHomeSection(section: string | null | undefined): string {
  if (!section) return DEFAULT_HOME_SECTIONS[0].slug;
  return LEGACY_SECTION_SLUGS[section] || section;
}

// A service with home_section `value` is part of the section with `slug`.
export function serviceMatchesHomeSection(sectionValue: string | null | undefined, slug: string): boolean {
  return normalizeHomeSection(sectionValue) === slug;
}
