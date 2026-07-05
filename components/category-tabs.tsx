import Link from "next/link";

interface CategoryTabsProps {
  categories: { id: string; title: string; slug: string }[];
  activeSlug?: string;
}

function tabClass(isActive: boolean) {
  return `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
    isActive
      ? "bg-primary text-primary-foreground shadow-md cursor-default"
      : "bg-muted text-muted-foreground hover:bg-zinc-200"
  }`;
}

export function CategoryTabs({ categories, activeSlug = "all" }: CategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-border/20 pb-6">
      {activeSlug === "all" ? (
        <span className={tabClass(true)}>All Services</span>
      ) : (
        <Link href="/#services" className={tabClass(false)}>
          All Services
        </Link>
      )}
      {categories.map((cat) =>
        activeSlug === cat.slug ? (
          <span key={cat.id} className={tabClass(true)}>
            {cat.title}
          </span>
        ) : (
          <Link key={cat.id} href={`/category/${cat.slug}`} className={tabClass(false)}>
            {cat.title}
          </Link>
        )
      )}
    </div>
  );
}
