'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';

interface PageSEO {
  id: string;
  name: string;
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

export default function PagesSeoPage() {
  const [pages, setPages] = useState<PageSEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageSEO | null>(null);

  // Form Fields
  const [pageId, setPageId] = useState('');
  const [name, setName] = useState('');
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

  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/api/pages/');
      if (res.ok) {
        const data = await res.json();
        setPages(data.results || []);
      } else {
        throw new Error('Failed to load static pages');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading static pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openCreateModal = () => {
    setCurrentPage(null);
    setPageId('');
    setName('');
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
    setModalOpen(true);
  };

  const openEditModal = (page: PageSEO) => {
    setCurrentPage(page);
    setPageId(page.id);
    setName(page.name);
    setSlug(page.slug || '');
    setMetaTitle(page.meta_title || '');
    setMetaDescription(page.meta_description || '');
    setMetaKeywords(page.meta_keywords || '');
    setOgTitle(page.og_title || '');
    setOgDescription(page.og_description || '');
    setOgImage(page.og_image || '');
    setOgType(page.og_type || 'website');
    setTwitterTitle(page.twitter_title || '');
    setTwitterDescription(page.twitter_description || '');
    setTwitterImage(page.twitter_image || '');
    setTwitterCard(page.twitter_card || 'summary_large_image');
    setCanonicalUrl(page.canonical_url || '');
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this static page profile?')) return;

    try {
      const res = await apiFetch(`/api/pages/${id}/`, {
        method: 'DELETE'
      });

      if (res.ok) {
        fetchPages();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting page profile.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitLoading(true);
    const payload: any = {
      name,
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

    if (!currentPage) {
      payload.id = pageId;
    }

    try {
      const url = currentPage ? `/api/pages/${currentPage.id}/` : '/api/pages/';
      const method = currentPage ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalOpen(false);
        fetchPages();
      } else {
        const data = await res.json();
        alert(data.detail || 'Request failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Static Pages SEO</h1>
          <p className="text-xs text-[#4B5563]">Manage search engine and sharing metadata for site pages.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Add Page Profile
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-600">
          <p className="text-xs font-semibold">Error Loading Static Pages</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-5 py-3">Page Name</th>
                  <th className="px-5 py-3 w-32">Page ID</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">SEO Title</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {pages.map((p) => (
                  <tr key={p.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#111827]">{p.name}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
                        {p.id}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#4B5563]">/{p.slug}</td>
                    <td className="px-5 py-3 text-[#4B5563] truncate max-w-xs">{p.meta_title || '—'}</td>
                    <td className="px-5 py-3 text-right flex items-center justify-end gap-2.5 h-12">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                      >
                        Edit SEO
                      </button>
                      <span className="text-[#E5E7EB]">|</span>
                      <button
                        onClick={() => handleDelete(p.id)}
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

      {/* Edit/Create Page SEO Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">
                {currentPage ? `Edit SEO Metadata for ${currentPage.name}` : 'Create Static Page Profile'}
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

            {/* Form Fields container */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 py-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Page ID (Unique key)</label>
                  <input
                    type="text"
                    required
                    disabled={!!currentPage}
                    value={pageId}
                    onChange={(e) => setPageId(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="e.g. faq"
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] disabled:opacity-50 px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Page Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. FAQ Page"
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Page Slug</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. faq"
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
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
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Meta Keywords</label>
                  <input
                    type="text"
                    value={metaKeywords}
                    onChange={(e) => setMetaKeywords(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Meta Description</label>
                  <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white resize-none"
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
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Type</label>
                  <input
                    type="text"
                    value={ogType}
                    onChange={(e) => setOgType(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Description</label>
                  <textarea
                    value={ogDescription}
                    onChange={(e) => setOgDescription(e.target.value)}
                    rows={2}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">OG Image URL</label>
                  <input
                    type="text"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Canonical URL</label>
                  <input
                    type="text"
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Title</label>
                  <input
                    type="text"
                    value={twitterTitle}
                    onChange={(e) => setTwitterTitle(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Card Type</label>
                  <input
                    type="text"
                    value={twitterCard}
                    onChange={(e) => setTwitterCard(e.target.value)}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-none focus:border-zinc-400 focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] mt-4">
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
                  {submitLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
