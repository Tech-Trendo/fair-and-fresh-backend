import type { Metadata } from "next";
import { db } from "@/lib/db";
import { staticPages } from "@/lib/schema";
import { eq, or } from "drizzle-orm";

// Revalidated on a schedule so dashboard SEO edits appear without a full rebuild.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const page = await db.query.staticPages.findFirst({
    where: or(eq(staticPages.slug, "brisbane"), eq(staticPages.id, "brisbane")),
  });

  return {
    title: page?.metaTitle || "Fabric & Carpet Cleaning in Brisbane | Fair & Fresh Cleaning",
    description:
      page?.metaDescription ||
      "Professional fabric, carpet, mattress, rug, upholstery and curtain cleaning in Brisbane. Same-day service across Brisbane suburbs, Gold Coast and Sunshine Coast. Get a free quote today.",
    keywords: page?.metaKeywords ? page.metaKeywords.split(",").map((k) => k.trim()) : undefined,
    alternates: { canonical: page?.canonicalUrl || undefined },
    robots: page?.metaRobots || undefined,
    other: page?.metaRobots ? { "x-robots-tag": page.metaRobots } : undefined,
    openGraph: {
      title: page?.ogTitle || undefined,
      description: page?.ogDescription || undefined,
      type: "website",
    },
  };
}

export default function BrisbaneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
