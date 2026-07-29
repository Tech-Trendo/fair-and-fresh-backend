import { db } from './db';
import { siteContent } from './schema';
import { eq } from 'drizzle-orm';

// Server-side: get all content for a group
export async function getContentGroup(group: string): Promise<Record<string, string>> {
  try {
    const items = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.group, group));

    const result: Record<string, string> = {};
    items.forEach((item) => {
      result[item.key] = item.value;
    });
    return result;
  } catch (error) {
    console.error(`Error fetching content group "${group}":`, error);
    return {};
  }
}

// Server-side: get a single content value by key
export async function getContentValue(key: string): Promise<string | null> {
  try {
    const items = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, key))
      .limit(1);

    if (items.length > 0) {
      return items[0].value;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching content key "${key}":`, error);
    return null;
  }
}

// Server-side: get multiple content groups at once
export async function getContentGroups(groups: string[]): Promise<Record<string, Record<string, string>>> {
  const result: Record<string, Record<string, string>> = {};
  const entries = await Promise.all(groups.map((g) => getContentGroup(g)));
  groups.forEach((g, i) => {
    result[g] = entries[i];
  });
  return result;
}
