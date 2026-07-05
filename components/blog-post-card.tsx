import Link from "next/link";
import Image from "next/image";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface BlogPostCardProps {
  slug: string;
  title: string;
  featuredImage: string;
  description: string;
  createdAt: Date | string;
  categoryTitle?: string;
  categorySlug?: string;
}

export function BlogPostCard({
  slug,
  title,
  featuredImage,
  description,
  createdAt,
  categoryTitle,
  categorySlug,
}: BlogPostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const plainDescription = description.replace(/<[^>]*>/g, "");

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={`/blog/${slug}`} className="relative block aspect-video overflow-hidden bg-muted">
        <Image
          src={featuredImage || "/uploads/blog_workspace.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
        />
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-3 mb-4 text-[10px] uppercase font-bold tracking-wider text-primary">
          {categorySlug ? (
            <Link href={`/blog/category/${categorySlug}`} className="flex items-center gap-1 hover:underline">
              <Tag className="w-3 h-3" />
              {categoryTitle || "General"}
            </Link>
          ) : (
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {categoryTitle || "General"}
            </span>
          )}
          <span className="text-border">•</span>
          <span className="flex items-center gap-1 text-muted-foreground font-semibold">
            <Calendar className="w-3 h-3" />
            {formattedDate}
          </span>
        </div>

        <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors mb-3">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
          {plainDescription}
        </p>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <Link
            href={`/blog/${slug}`}
            className="text-xs font-bold text-primary group-hover:text-accent flex items-center gap-1 transition-colors"
          >
            Read Article
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
