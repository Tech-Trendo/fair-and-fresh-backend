import Link from "next/link";

interface BlogCategoryTabsProps {
  categories: { id: string; title: string; slug: string }[];
  activeSlug?: string;
  onSelect?: (slug: string) => void;
}

function tabClass(isActive: boolean, interactive = true) {
  return `px-4 py-1.5 rounded-full text-xs font-nav transition-all ${
    isActive
      ? "bg-primary text-primary-foreground"
      : `bg-white text-muted-foreground hover:text-foreground border border-border${interactive ? " cursor-pointer hover:border-primary/50" : ""}`
  }`;
}

export function BlogCategoryTabs({ categories, activeSlug = "all", onSelect }: BlogCategoryTabsProps) {
  if (categories.length === 0) return null;

  const isFilterMode = Boolean(onSelect);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {isFilterMode ? (
        <button type="button" onClick={() => onSelect!("all")} className={tabClass(activeSlug === "all")}>
          All Topics
        </button>
      ) : activeSlug === "all" ? (
        <span className={tabClass(true, false)}>All Topics</span>
      ) : (
        <Link href="/blog" className={tabClass(false)}>All Topics</Link>
      )}

      {categories.map((cat) =>
        isFilterMode ? (
          <button key={cat.id} type="button" onClick={() => onSelect!(cat.slug)} className={tabClass(activeSlug === cat.slug)}>
            {cat.title}
          </button>
        ) : activeSlug === cat.slug ? (
          <span key={cat.id} className={tabClass(true, false)}>{cat.title}</span>
        ) : (
          <Link key={cat.id} href={`/blog/category/${cat.slug}`} className={tabClass(false)}>{cat.title}</Link>
        )
      )}
    </div>
  );
}
