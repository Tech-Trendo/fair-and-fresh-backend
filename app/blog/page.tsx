"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, User, ArrowRight, BookOpen, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: string;
  title: string;
  slug: string;
}

interface BlogPost {
  id: string;
  title: string;
  featured_image: string;
  description: string;
  slug: string;
  created_at: string;
  category: Category[];
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const [blogRes, catRes] = await Promise.all([
          fetch("/api/blog"),
          fetch("/api/category?type=blog"),
        ]);
        
        if (blogRes.ok && catRes.ok) {
          const blogData = await blogRes.json();
          const catData = await catRes.json();
          setPosts(blogData.results || []);
          setCategories(catData.results || []);
        }
      } catch (err) {
        console.error("Failed to load blog data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filtering logic
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      post.category.some((cat) => cat.slug === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Pagination calculation
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground font-sans">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-4"
            >
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <BookOpen className="w-3.5 h-3.5" />
                Fair & Fresh Guide
              </span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground"
            >
              Our Cleaning & Hygiene <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Insights</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Discover expert tips, maintenance checklists, and helpful articles to keep your home and workspace spotless and fresh.
            </motion.p>
          </div>
        </section>

        {/* Toolbar & Filters */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm outline-none"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                All Topics
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedCategory === cat.slug
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <svg className="h-8 w-8 animate-spin text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-muted-foreground">Loading blog articles...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-card">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-bold text-foreground">No articles match your criteria</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                Try searching for different keywords or resetting your category filter tab to find what you need.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPosts.map((post) => {
                  const formattedDate = new Date(post.created_at).toLocaleDateString("en-AU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <motion.article
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                    >
                      {/* Image container */}
                      <Link href={`/blog/${post.slug}`} className="relative block aspect-video overflow-hidden bg-muted">
                        <Image
                          src={post.featured_image || "/uploads/blog_workspace.jpg"}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-550 ease-out"
                        />
                      </Link>

                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Meta Category & Date */}
                        <div className="flex items-center gap-3 mb-4 text-[10px] uppercase font-bold tracking-wider text-primary">
                          <span className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {post.category.length > 0 ? post.category[0].title : "General"}
                          </span>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1 text-muted-foreground font-semibold">
                            <Calendar className="w-3 h-3" />
                            {formattedDate}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors mb-3">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h2>

                        {/* Description snippet */}
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3"
                           dangerouslySetInnerHTML={{ __html: post.description.replace(/<[^>]*>/g, '') }}
                        />

                        {/* Footer details */}
                        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-xs font-bold text-primary group-hover:text-accent flex items-center gap-1 transition-colors"
                          >
                            Read Article
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-16">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 border border-border rounded-xl bg-card text-muted-foreground disabled:opacity-50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-card text-muted-foreground hover:bg-muted border border-border"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-border rounded-xl bg-card text-muted-foreground disabled:opacity-50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
