'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';

interface Category {
  id: string;
  title: string;
  description?: string;
  image?: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_card?: string;
  canonical_url?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');
  
  // Form fields - Content
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form fields - SEO Mixin
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/api/category/');
      if (res.status === 200) {
        const data = await res.json();
        setCategories(data.results || []);
      } else {
        throw new Error('Failed to load categories');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setCurrentCategory(null);
    setTitle('');
    setDescription('');
    setImageUrl('');
    setSlug('');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setOgType('website');
    setTwitterTitle('');
    setTwitterDescription('');
    setTwitterImage('');
    setTwitterCard('summary_large_image');
    setCanonicalUrl('');
    setActiveTab('content');
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setCurrentCategory(cat);
    setTitle(cat.title);
    setDescription(cat.description || '');
    setImageUrl(cat.image || '');
    setSlug(cat.slug || '');
    setMetaTitle(cat.meta_title || '');
    setMetaDescription(cat.meta_description || '');
    setMetaKeywords(cat.meta_keywords || '');
    setOgTitle(cat.og_title || '');
    setOgDescription(cat.og_description || '');
    setOgImage(cat.og_image || '');
    setOgType(cat.og_type || 'website');
    setTwitterTitle(cat.twitter_title || '');
    setTwitterDescription(cat.twitter_description || '');
    setTwitterImage(cat.twitter_image || '');
    setTwitterCard(cat.twitter_card || 'summary_large_image');
    setCanonicalUrl(cat.canonical_url || '');
    setActiveTab('content');
    setModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch('/api/upload/', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 201) {
        const data = await res.json();
        setImageUrl(data.image_url);
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitLoading(true);
    const payload = {
      title,
      description,
      image: imageUrl || null,
      slug: slug || null,
      meta_title: metaTitle,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
      og_title: ogTitle,
      og_description: ogDescription,
      og_image: ogImage,
      og_type: ogType,
      twitter_title: twitterTitle,
      twitter_description: twitterDescription,
      twitter_image: twitterImage,
      twitter_card: twitterCard,
      canonical_url: canonicalUrl
    };

    try {
      const url = currentCategory ? `/api/category/${currentCategory.id}/` : '/api/category/';
      const method = currentCategory ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 200 || res.status === 201) {
        setModalOpen(false);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(data.title ? `Title error: ${data.title.join(' ')}` : 'Request failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await apiFetch(`/api/category/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        fetchCategories();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting category.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Categories</h1>
          <p className="text-xs text-[#4B5563]">Manage service collection directories.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Create Category
        </button>
      </div>

      {/* Main Table Panel */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <svg className="h-6 w-6 animate-spin text-zinc-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-205 bg-red-50 p-5 text-center text-red-650">
          <p className="text-xs font-semibold">Error Loading Categories</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-semibold text-[#111827]">No categories found</p>
          <p className="text-xs text-[#4B5563] mt-1">Get started by creating your first cleaning services category.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-5 py-3 w-16">Image</th>
                  <th className="px-5 py-3">Category Title</th>
                  <th className="px-5 py-3">Description</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {categories.map((cat) => (
                  <tr key={cat.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-5 py-3">
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="h-8 w-8 rounded-md object-cover border border-[#E5E7EB]"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[10px] text-[#9CA3AF] font-bold">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#111827]">{cat.title}</td>
                    <td className="px-5 py-3 text-[#4B5563] max-w-sm truncate">{cat.description || '—'}</td>
                    <td className="px-5 py-3 text-right flex items-center justify-end gap-2.5 h-14">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-[#E5E7EB]">|</span>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-xs font-semibold text-[#DC2626] hover:text-[#B91C1C] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slide-over or Modal Dialog Overlay */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">
                {currentCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-[#9CA3AF] hover:text-[#4B5563] transition-colors cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#E5E7EB] text-xs font-medium">
              {(['content', 'seo'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 capitalize border-b-2 -mb-px transition-colors cursor-pointer ${
                    activeTab === tab
                      ? 'border-[#2563EB] text-[#2563EB] font-bold'
                      : 'border-transparent text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {tab === 'seo' ? 'SEO Metadata' : tab}
                </button>
              ))}
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 py-1">
              {activeTab === 'content' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Residential Cleaning"
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide details about this service category..."
                      rows={4}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Category Image</label>
                    <div className="flex items-center gap-3">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Thumbnail"
                          className="h-10 w-10 rounded-md object-cover border border-[#E5E7EB]"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[10px] text-[#9CA3AF] font-bold">
                          N/A
                        </div>
                      )}
                      <div className="flex-1 flex flex-col gap-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="cat-image-file"
                        />
                        <label
                          htmlFor="cat-image-file"
                          className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                        >
                          {uploading ? 'Uploading...' : 'Upload Image'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Custom Slug (Optional)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. residential-cleaning"
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2 border-t border-[#E5E7EB] pt-3 mt-1">
                    <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Search Engine Listing</h4>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Meta Title</label>
                    <input
                      type="text"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Meta Keywords</label>
                    <input
                      type="text"
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Meta Description</label>
                    <textarea
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2 border-t border-[#E5E7EB] pt-3">
                    <h4 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">Open Graph & Twitter Sharing</h4>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Title</label>
                    <input
                      type="text"
                      value={ogTitle}
                      onChange={(e) => setOgTitle(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Type</label>
                    <input
                      type="text"
                      value={ogType}
                      onChange={(e) => setOgType(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Description</label>
                    <textarea
                      value={ogDescription}
                      onChange={(e) => setOgDescription(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Image URL</label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Canonical URL</label>
                    <input
                      type="text"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Title</label>
                    <input
                      type="text"
                      value={twitterTitle}
                      onChange={(e) => setTwitterTitle(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Card Type</label>
                    <input
                      type="text"
                      value={twitterCard}
                      onChange={(e) => setTwitterCard(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] mt-auto">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="inline-flex h-8 items-center justify-center rounded-md bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
