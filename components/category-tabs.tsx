import Link from "next/link";

interface CategoryTabsProps {
  categories: { id: string; title: string; slug: string }[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
}

function tabClass(isActive: boolean, interactive = true) {
  return `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
    isActive
      ? "bg-primary text-primary-foreground shadow-md"
      : `bg-muted text-muted-foreground hover:bg-zinc-200${interactive ? " cursor-pointer" : ""}`
  }`;
}

export function CategoryTabs({ categories, activeSlug = "all", onSelect }: CategoryTabsProps) {
  if (categories.length === 0) return null;

  const isFilterMode = Boolean(onSelect);

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-10 border-b border-border/20 pb-6">
      {isFilterMode ? (
        <button
          type="button"
          onClick={() => onSelect!("all")}
          className={tabClass(activeSlug === "all")}
        >
          All Services
        </button>
      ) : activeSlug === "all" ? (
        <span className={tabClass(true, false)}>All Services</span>
      ) : (
        <Link href="/#services" className={tabClass(false)}>
          All Services
        </Link>
      )}

      {categories.map((cat) =>
        isFilterMode ? (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect!(cat.slug)}
            className={tabClass(activeSlug === cat.slug)}
          >
            {cat.title}
          </button>
        ) : activeSlug === cat.slug ? (
          <span key={cat.id} className={tabClass(true, false)}>
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
