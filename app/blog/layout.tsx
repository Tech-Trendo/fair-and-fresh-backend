import type { Metadata } from "next";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq, or } from "drizzle-orm";

// Revalidated on a schedule so dashboard SEO edits appear without a full rebuild.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: or(eq(staticPages.slug, "blog"), eq(staticPages.id, "blog")),
  });

  return {
    title: page?.metaTitle || "Cleaning Guides, Tips & Professional Advice",
    description:
      page?.metaDescription ||
      "Explore our blog for professional cleaning tips, maintenance guides, and helpful advice from Brisbane's fabric cleaning specialists.",
  };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
