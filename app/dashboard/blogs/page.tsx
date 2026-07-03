'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/auth';

interface Category {
  id: string;
  title: string;
}

interface Blog {
  id: string;
  title: string;
  categoryIds?: string[];
  category?: Category[];
  featured_image?: string;
  description?: string;
  slug: string;
  created_at: string;
  
  // SEO Mixin fields
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

interface WysiwygEditorProps {
  value: string;
  onChange: (val: string) => void;
}

function WysiwygEditor({ value, onChange }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleLink = () => {
    const url = prompt('Enter the link URL:');
    if (url !== null) {
      executeCommand('createLink', url);
    }
  };

  return (
    <div className="flex flex-col rounded-md border border-[#E5E7EB] bg-white overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        .editor-content ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .editor-content ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .editor-content h1 { font-size: 1.5em; font-weight: bold; margin: 0.8rem 0 0.4rem 0; }
        .editor-content h2 { font-size: 1.25em; font-weight: bold; margin: 0.6rem 0 0.3rem 0; }
        .editor-content h3 { font-size: 1.1em; font-weight: bold; margin: 0.5rem 0 0.2rem 0; }
        .editor-content p { margin: 0.4rem 0; }
        .editor-content a { color: #2563EB; text-decoration: underline; }
      `}} />
      
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 bg-[#F9FAFB] border-b border-[#E5E7EB] p-1.5">
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Bold"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Italic"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m-4 0h4m-6 16h4" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Underline"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4v6a6 6 0 0012 0V4M4 20h16" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('strikeThrough')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Strikethrough"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-7 0a3 3 0 113.6-3M7 12a3 3 0 005.4 3m0 0a3 3 0 002.6-1.5" />
          </svg>
        </button>
        
        <span className="w-px h-4 bg-[#E5E7EB] mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h1>')}
          className="px-1.5 py-0.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] font-extrabold text-[10px] cursor-pointer transition-colors"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="px-1.5 py-0.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] font-extrabold text-[10px] cursor-pointer transition-colors"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="px-1.5 py-0.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] font-extrabold text-[10px] cursor-pointer transition-colors"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="px-1.5 py-0.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] font-bold text-[10px] cursor-pointer transition-colors"
          title="Paragraph"
        >
          P
        </button>

        <span className="w-px h-4 bg-[#E5E7EB] mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Bullet List"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Numbered List"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" />
          </svg>
        </button>

        <span className="w-px h-4 bg-[#E5E7EB] mx-1" />

        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Align Left"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Align Center"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M7 12h10M6 18h12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Align Right"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>

        <span className="w-px h-4 bg-[#E5E7EB] mx-1" />

        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Insert Link"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('unlink')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Remove Link"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="p-1.5 rounded hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] cursor-pointer transition-colors"
          title="Clear Formatting"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-48 max-h-72 overflow-y-auto px-4 py-3 text-xs text-[#111827] focus:outline-hidden editor-content"
        style={{ outline: 'none' }}
      />
    </div>
  );
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Form Fields - Content
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields - SEO Mixin
  const [slug, setSlug] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('article');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchBlogsAndCategories = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [blogRes, catRes] = await Promise.all([
        apiFetch('/api/blog/'),
        apiFetch('/api/category/?type=blog')
      ]);

      if (blogRes.status === 200 && catRes.status === 200) {
        const blogData = await blogRes.json();
        const catData = await catRes.json();
        setBlogs(blogData.results || []);
        setCategories(catData.results || []);
      } else {
        throw new Error('Failed to load blog collections');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogsAndCategories();
  }, []);

  const openCreateModal = () => {
    setCurrentBlog(null);
    setTitle('');
    setDescription('');
    setFeaturedImage('');
    setSelectedCategoryIds([]);
    
    // Reset SEO
    setSlug('');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setOgTitle('');
    setOgDescription('');
    setOgImage('');
    setOgType('article');
    setTwitterTitle('');
    setTwitterDescription('');
    setTwitterImage('');
    setTwitterCard('summary_large_image');
    setCanonicalUrl('');

    setActiveTab('content');
    setModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setCurrentBlog(blog);
    setTitle(blog.title);
    setDescription(blog.description || '');
    setFeaturedImage(blog.featured_image || '');
    
    // Resolve selected category ids
    const catIds = blog.category ? blog.category.map(c => c.id) : (blog.categoryIds || []);
    setSelectedCategoryIds(catIds);

    // SEO fields
    setSlug(blog.slug || '');
    setMetaTitle(blog.meta_title || '');
    setMetaDescription(blog.meta_description || '');
    setMetaKeywords(blog.meta_keywords || '');
    setOgTitle(blog.og_title || '');
    setOgDescription(blog.og_description || '');
    setOgImage(blog.og_image || '');
    setOgType(blog.og_type || 'article');
    setTwitterTitle(blog.twitter_title || '');
    setTwitterDescription(blog.twitter_description || '');
    setTwitterImage(blog.twitter_image || '');
    setTwitterCard(blog.twitter_card || 'summary_large_image');
    setCanonicalUrl(blog.canonical_url || '');

    setActiveTab('content');
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiFetch('/api/upload/', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 201) {
        const data = await res.json();
        setFeaturedImage(data.image_url);
      } else {
        alert('File upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCategoryToggle = (catId: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitLoading(true);

    const payload = {
      title,
      description,
      featured_image: featuredImage,
      categoryIds: selectedCategoryIds,
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
      const url = currentBlog ? `/api/blog/${currentBlog.id}/` : '/api/blog/';
      const method = currentBlog ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 200 || res.status === 201) {
        setModalOpen(false);
        fetchBlogsAndCategories();
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
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const res = await apiFetch(`/api/blog/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        fetchBlogsAndCategories();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting blog post.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Blogs</h1>
          <p className="text-xs text-[#4B5563]">Manage guides, updates, and articles.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Create Blog Post
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-650">
          <p className="text-xs font-semibold">Error Loading Blogs</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-semibold text-[#111827]">No blog posts found</p>
          <p className="text-xs text-[#4B5563] mt-1">Get started by publishing your first market guide post.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Create Blog Post
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-5 py-3 w-16">Cover</th>
                  <th className="px-5 py-3">Blog Title</th>
                  <th className="px-5 py-3">Categories</th>
                  <th className="px-5 py-3 text-right">Published</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-5 py-3">
                      {blog.featured_image ? (
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="h-8 w-8 rounded-md object-cover border border-[#E5E7EB]"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center text-[10px] text-[#9CA3AF] font-bold">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#111827]">{blog.title}</td>
                    <td className="px-5 py-3 text-[#4B5563]">
                      <div className="flex flex-wrap gap-1">
                        {(blog.category || []).map((cat) => (
                          <span
                            key={cat.id}
                            className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/50"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right text-[#4B5563]">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 text-right flex items-center justify-end gap-2.5 h-12">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-[#E5E7EB]">|</span>
                      <button
                        onClick={() => handleDelete(blog.id)}
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

      {/* Blog Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">
                {currentBlog ? 'Edit Blog Post' : 'Create Blog Post'}
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

            {/* Tab Contents */}
            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto flex flex-col gap-4 pr-1 py-1">
              {activeTab === 'content' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Blog Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. 5 Crucial Cleaning Tips"
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Categories</label>
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] max-h-28 overflow-y-auto">
                      {categories.map((cat) => {
                        const checked = selectedCategoryIds.includes(cat.id);
                        return (
                          <label key={cat.id} className="flex items-center gap-2 text-xs text-[#4B5563] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCategoryToggle(cat.id)}
                              className="rounded border-[#E5E7EB] text-[#2563EB]"
                            />
                            {cat.title}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Featured Image</label>
                    <div className="flex items-center gap-3">
                      {featuredImage ? (
                        <img
                          src={featuredImage}
                          alt="Featured preview"
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
                          onChange={handleImageUpload}
                          className="hidden"
                          id="blog-image-file"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="blog-image-file"
                          className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                        >
                          {uploadingImage ? 'Uploading...' : 'Upload Featured Image'}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Article Body</label>
                    <WysiwygEditor
                      value={description}
                      onChange={setDescription}
                    />
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
                      placeholder="e.g. spring-cleaning-guide-2026"
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

                  <div className="flex flex-col gap-1.5 col-span-2">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Description</label>
                    <textarea
                      value={twitterDescription}
                      onChange={(e) => setTwitterDescription(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Twitter Image URL</label>
                    <input
                      type="text"
                      value={twitterImage}
                      onChange={(e) => setTwitterImage(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Form Actions Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB] mt-3">
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
                  {submitLoading ? 'Saving...' : currentBlog ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
