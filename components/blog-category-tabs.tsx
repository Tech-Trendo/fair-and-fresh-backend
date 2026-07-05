import Link from "next/link";

interface BlogCategoryTabsProps {
  categories: { id: string; title: string; slug: string }[];
  activeSlug?: string;
}

function tabClass(isActive: boolean) {
  return `px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
    isActive
      ? "bg-primary text-primary-foreground shadow-md cursor-default"
      : "bg-card text-muted-foreground hover:bg-muted border border-border"
  }`;
}

export function BlogCategoryTabs({ categories, activeSlug = "all" }: BlogCategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {activeSlug === "all" ? (
        <span className={tabClass(true)}>All Topics</span>
      ) : (
        <Link href="/blog" className={tabClass(false)}>
          All Topics
        </Link>
      )}
      {categories.map((cat) =>
        activeSlug === cat.slug ? (
          <span key={cat.id} className={tabClass(true)}>
            {cat.title}
          </span>
        ) : (
          <Link key={cat.id} href={`/blog/category/${cat.slug}`} className={tabClass(false)}>
            {cat.title}
          </Link>
        )
      )}
    </div>
  );
}
