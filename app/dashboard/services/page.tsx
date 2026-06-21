'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';

interface Service {
  id: string;
  name: string;
  short_description?: string;
  long_description?: string;
  what_we_offer?: Record<string, any>;
  whats_included?: { id: string; title: string; description?: string }[];
  benefits?: { id: string; title: string; description?: string }[];
  images?: { id: string; image_url: string }[];
  testimonials?: { id: string; author: string; content: string; rating: number }[];
  slug: string;
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'content' | 'images' | 'seo'>('general');
  const [currentService, setCurrentService] = useState<Service | null>(null);

  // Form Fields - General
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [whatWeOfferText, setWhatWeOfferText] = useState('{"supplies_included": true}'); // JSONField

  // Form Fields - Content lists (dynamic arrays)
  const [whatsIncludedList, setWhatsIncludedList] = useState<{ title: string; description: string }[]>([]);
  const [benefitsList, setBenefitsList] = useState<{ title: string; description: string }[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<{ author: string; content: string; rating: number }[]>([]);

  // Form Fields - Images
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields - SEO Mixin
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

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch('/api/services/');
      if (res.status === 200) {
        const data = await res.json();
        setServices(data.results || []);
      } else {
        throw new Error('Failed to load services');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openCreateModal = () => {
    setCurrentService(null);
    setName('');
    setShortDescription('');
    setLongDescription('');
    setWhatWeOfferText('{"supplies_included": true}');
    setWhatsIncludedList([]);
    setBenefitsList([]);
    setTestimonialsList([]);
    setImagesList([]);
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
    
    setActiveTab('general');
    setModalOpen(true);
  };

  const openEditModal = (srv: Service) => {
    setCurrentService(srv);
    setName(srv.name);
    setShortDescription(srv.short_description || '');
    setLongDescription(srv.long_description || '');
    setWhatWeOfferText(JSON.stringify(srv.what_we_offer || {}));
    
    setWhatsIncludedList(
      (srv.whats_included || []).map((item) => ({
        title: item.title,
        description: item.description || '',
      }))
    );
    setBenefitsList(
      (srv.benefits || []).map((item) => ({
        title: item.title,
        description: item.description || '',
      }))
    );
    setTestimonialsList(
      (srv.testimonials || []).map((item) => ({
        author: item.author,
        content: item.content,
        rating: item.rating,
      }))
    );
    setImagesList((srv.images || []).map((img) => img.image_url));
    
    // SEO fields
    setSlug(srv.slug || '');
    setMetaTitle(srv.meta_title || '');
    setMetaDescription(srv.meta_description || '');
    setMetaKeywords(srv.meta_keywords || '');
    setOgTitle(srv.og_title || '');
    setOgDescription(srv.og_description || '');
    setOgImage(srv.og_image || '');
    setOgType(srv.og_type || 'website');
    setTwitterTitle(srv.twitter_title || '');
    setTwitterDescription(srv.twitter_description || '');
    setTwitterImage(srv.twitter_image || '');
    setTwitterCard(srv.twitter_card || 'summary_large_image');
    setCanonicalUrl(srv.canonical_url || '');

    setActiveTab('general');
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
        setImagesList((prev) => [...prev, data.image_url]);
      } else {
        alert('Image upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image.');
    } finally {
      setUploadingImage(false);
    }
  };

  const addWhatsIncluded = () => {
    setWhatsIncludedList((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeWhatsIncluded = (idx: number) => {
    setWhatsIncludedList((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateWhatsIncluded = (idx: number, key: 'title' | 'description', val: string) => {
    setWhatsIncludedList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: val } : item))
    );
  };

  const addBenefit = () => {
    setBenefitsList((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeBenefit = (idx: number) => {
    setBenefitsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateBenefit = (idx: number, key: 'title' | 'description', val: string) => {
    setBenefitsList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: val } : item))
    );
  };

  const addTestimonial = () => {
    setTestimonialsList((prev) => [...prev, { author: '', content: '', rating: 5 }]);
  };

  const removeTestimonial = (idx: number) => {
    setTestimonialsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateTestimonial = (idx: number, key: 'author' | 'content' | 'rating', val: any) => {
    setTestimonialsList((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [key]: val } : item))
    );
  };

  const removeImage = (idx: number) => {
    setImagesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitLoading(true);

    let parsedOffer = {};
    try {
      parsedOffer = JSON.parse(whatWeOfferText);
    } catch (err) {
      alert('Invalid JSON in "What We Offer". Please correct it.');
      setSubmitLoading(false);
      return;
    }

    const payload = {
      name,
      short_description: shortDescription,
      long_description: longDescription,
      what_we_offer: parsedOffer,
      whats_included: whatsIncludedList.filter(item => item.title.trim()),
      benefits: benefitsList.filter(item => item.title.trim()),
      images: imagesList,
      testimonials: testimonialsList.filter(item => item.author.trim()),
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
      const url = currentService ? `/api/services/${currentService.id}/` : '/api/services/';
      const method = currentService ? 'PUT' : 'POST';

      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 200 || res.status === 201) {
        setModalOpen(false);
        fetchServices();
      } else {
        const data = await res.json();
        alert(data.name ? `Name error: ${data.name.join(' ')}` : 'Request failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? All related images, testimonials, benefits, and inclusions will be deleted.')) return;

    try {
      const res = await apiFetch(`/api/services/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        fetchServices();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting service.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Services</h1>
          <p className="text-xs text-[#4B5563]">Manage service catalog items and customer details.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Create Service
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
          <p className="text-xs font-semibold">Error Loading Services</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-semibold text-[#111827]">No services found</p>
          <p className="text-xs text-[#4B5563] mt-1">Configure your first cleaning service catalog.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Create Service
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-5 py-3">Service Name</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3 text-center">Whats Included</th>
                  <th className="px-5 py-3 text-center">Benefits</th>
                  <th className="px-5 py-3 text-center">Testimonials</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {services.map((srv) => (
                  <tr key={srv.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#111827]">{srv.name}</td>
                    <td className="px-5 py-3 text-[#4B5563]">{srv.slug}</td>
                    <td className="px-5 py-3 text-center text-[#4B5563]">{(srv.whats_included || []).length}</td>
                    <td className="px-5 py-3 text-center text-[#4B5563]">{(srv.benefits || []).length}</td>
                    <td className="px-5 py-3 text-center text-[#4B5563]">{(srv.testimonials || []).length}</td>
                    <td className="px-5 py-3 text-right flex items-center justify-end gap-2.5 h-12">
                      <button
                        onClick={() => openEditModal(srv)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-[#E5E7EB]">|</span>
                      <button
                        onClick={() => handleDelete(srv.id)}
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

      {/* Creation/Editing Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">
                {currentService ? 'Edit Service Catalog' : 'Create Service Catalog'}
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
              {(['general', 'content', 'images', 'seo'] as const).map((tab) => (
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
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 py-1">
              {activeTab === 'general' && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Service Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sofa Steam Cleaning"
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Short Description</label>
                    <input
                      type="text"
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Short summary displayed on cards..."
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Long Description</label>
                    <textarea
                      value={longDescription}
                      onChange={(e) => setLongDescription(e.target.value)}
                      placeholder="Deep details about the cleaning service package..."
                      rows={4}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">What We Offer (JSON Format)</label>
                    <textarea
                      value={whatWeOfferText}
                      onChange={(e) => setWhatWeOfferText(e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={3}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden font-mono focus:border-zinc-400 focus:bg-white resize-none"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="flex flex-col gap-5">
                  {/* Whats Included */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">What's Included</h4>
                      <button
                        type="button"
                        onClick={addWhatsIncluded}
                        className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        + Add Inclusion
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {whatsIncludedList.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
                          <input
                            type="text"
                            required
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) => updateWhatsIncluded(idx, 'title', e.target.value)}
                            className="flex-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateWhatsIncluded(idx, 'description', e.target.value)}
                            className="flex-2 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <button
                            type="button"
                            onClick={() => removeWhatsIncluded(idx)}
                            className="text-[#DC2626] text-xs font-semibold px-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Service Benefits</h4>
                      <button
                        type="button"
                        onClick={addBenefit}
                        className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        + Add Benefit
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {benefitsList.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
                          <input
                            type="text"
                            required
                            placeholder="Benefit Title"
                            value={item.title}
                            onChange={(e) => updateBenefit(idx, 'title', e.target.value)}
                            className="flex-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updateBenefit(idx, 'description', e.target.value)}
                            className="flex-2 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <button
                            type="button"
                            onClick={() => removeBenefit(idx)}
                            className="text-[#DC2626] text-xs font-semibold px-2"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Customer Testimonials</h4>
                      <button
                        type="button"
                        onClick={addTestimonial}
                        className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        + Add Testimonial
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {testimonialsList.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 bg-[#F9FAFB] p-3 rounded-lg border border-[#E5E7EB]">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Author Name"
                              value={item.author}
                              onChange={(e) => updateTestimonial(idx, 'author', e.target.value)}
                              className="flex-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                            />
                            <select
                              value={item.rating}
                              onChange={(e) => updateTestimonial(idx, 'rating', Number(e.target.value))}
                              className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-xs text-[#111827]"
                            >
                              {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                            </select>
                            <button
                              type="button"
                              onClick={() => removeTestimonial(idx)}
                              className="text-[#DC2626] text-xs font-semibold px-2"
                            >
                              Remove
                            </button>
                          </div>
                          <textarea
                            required
                            placeholder="Feedback comment..."
                            value={item.content}
                            onChange={(e) => updateTestimonial(idx, 'content', e.target.value)}
                            rows={2}
                            className="w-full rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1.5 text-xs text-[#111827]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'images' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Service Gallery Images</h4>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="srv-image-file"
                        disabled={uploadingImage}
                      />
                      <label
                        htmlFor="srv-image-file"
                        className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-3 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                      >
                        {uploadingImage ? 'Uploading...' : '+ Upload Image'}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mt-2">
                    {imagesList.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg border border-[#E5E7EB] overflow-hidden group aspect-square bg-[#F3F4F6]">
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/40 flex items-center justify-center text-xs font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
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
                      placeholder="e.g. customized-sofa-clean-package"
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
                  {submitLoading ? 'Saving...' : currentService ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
