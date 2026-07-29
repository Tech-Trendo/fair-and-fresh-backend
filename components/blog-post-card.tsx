import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

interface BlogPostCardProps {
  slug: string;
  title: string;
  featuredImage: string;
  description: string;
  createdAt: Date | string;
  categoryTitle?: string;
  categorySlug?: string;
  readTime?: string;
}

export function BlogPostCard({
  slug,
  title,
  featuredImage,
  description,
  createdAt,
  categoryTitle,
  categorySlug,
  readTime,
}: BlogPostCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const plainDescription = description.replace(/<[^>]*>/g, "");

  // Estimate read time if not provided
  const minsRead = readTime || `${Math.max(1, Math.ceil(plainDescription.split(/\s+/).length / 200))} min read`;

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full border border-border">
      <Link href={`/blog/${slug}`} className="relative block aspect-video overflow-hidden bg-muted">
        <Image
          src={featuredImage || "/uploads/blog_workspace.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3">
          {categorySlug ? (
            <span className="bg-accent-tint text-primary text-[10px] font-nav px-2.5 py-1 rounded-full">
              {categoryTitle || "General"}
            </span>
          ) : (
            <span className="bg-accent-tint text-primary text-[10px] font-nav px-2.5 py-1 rounded-full">
              {categoryTitle || "General"}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground font-body">
            · {minsRead}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-base font-heading-bold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground font-body leading-relaxed line-clamp-3 flex-grow">
          {plainDescription}
        </p>

        {/* Date */}
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground font-body">
          <Calendar className="w-3 h-3" />
          {formattedDate}
        </div>
      </div>
    </article>
  );
}
