'use client';

import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/auth';

const PAGE_SIZE = 10;

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
  service_types?: { id: string; title: string; description?: string }[];
  slug: string;
  icon?: string;
  sort_order?: number;
  home_section?: string;
  categories?: { id: string; name: string; slug: string }[];
  category?: { id: string; name: string; slug: string } | null;
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
  meta_robots?: string;
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
  const [icon, setIcon] = useState('Sparkles');
  const [sortOrder, setSortOrder] = useState<number>(0);

  // Form Fields - Content lists (dynamic arrays)
  const [whatsIncludedList, setWhatsIncludedList] = useState<{ title: string; description: string }[]>([]);
  const [benefitsList, setBenefitsList] = useState<{ title: string; description: string }[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<{ author: string; content: string; rating: number }[]>([]);
  const [serviceTypesList, setServiceTypesList] = useState<{ title: string; description: string }[]>([]);

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
  const [metaRobots, setMetaRobots] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<{ id: string; title: string }[]>([]);
  const [homeSection, setHomeSection] = useState<string>('steam');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const [submitLoading, setSubmitLoading] = useState(false);
  // Ref (not state) so the async create-modal continuation reads the latest value
  const sortOrderTouchedRef = useRef(false);

  const fetchServices = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      setError('');
      const res = await apiFetch(`/api/services/?page=${currentPage}&page_size=${PAGE_SIZE}`);
      if (res.status === 200) {
        const data = await res.json();
        setServices(data.results || []);
        setTotalCount(data.count || 0);
        setHasNext(!!data.next);
        setHasPrev(!!data.previous);
        setPage(currentPage);
      } else {
        throw new Error('Failed to load services');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading services.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await apiFetch('/api/category/?type=service');
      if (res.ok) {
        const data = await res.json();
        setAllCategories(data.results || []);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const openCreateModal = async () => {
    setCurrentService(null);
    setName('');
    setShortDescription('');
    setLongDescription('');
    setWhatWeOfferText('{"supplies_included": true}');
    setWhatsIncludedList([]);
    setBenefitsList([]);
    setTestimonialsList([]);
    setServiceTypesList([]);
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
    setMetaRobots('');
    setIcon('Sparkles');
    setSelectedCategoryIds([]);
    setHomeSection('steam');
    sortOrderTouchedRef.current = false;

    setActiveTab('general');
    setModalOpen(true);

    // Auto-assign next order based on ALL services (table is paginated)
    try {
      const res = await apiFetch('/api/services/?page_size=100');
      if (res.status === 200) {
        const data = await res.json();
        const all = data.results || [];
        const maxOrder = all.length > 0
          ? Math.max(...all.map((s: Service) => s.sort_order ?? 0))
          : 0;
        if (!sortOrderTouchedRef.current) setSortOrder(maxOrder + 1);
      } else if (!sortOrderTouchedRef.current) {
        setSortOrder((services[services.length - 1]?.sort_order ?? 0) + 1);
      }
    } catch {
      if (!sortOrderTouchedRef.current) setSortOrder((services[services.length - 1]?.sort_order ?? 0) + 1);
    }
  };

  const openEditModal = (srv: Service) => {
    setCurrentService(srv);
    setName(srv.name);
    setShortDescription(srv.short_description || '');
    setLongDescription(srv.long_description || '');
    setWhatWeOfferText(JSON.stringify(srv.what_we_offer || {}));
    setSortOrder(srv.sort_order ?? 0);
    
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
    setServiceTypesList(
      (srv.service_types || []).map((item) => ({
        title: item.title,
        description: item.description || '',
      }))
    );
    
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
    setMetaRobots(srv.meta_robots || '');
    setIcon(srv.icon || 'Sparkles');
    setSelectedCategoryIds((srv.categories || []).map((cat) => cat.id));
    setHomeSection(srv.home_section || 'steam');
    sortOrderTouchedRef.current = false;
 
    setActiveTab('general');
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'service');

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

  const addServiceType = () => {
    setServiceTypesList((prev) => [...prev, { title: '', description: '' }]);
  };

  const removeServiceType = (idx: number) => {
    setServiceTypesList((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateServiceType = (idx: number, key: 'title' | 'description', val: string) => {
    setServiceTypesList((prev) =>
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
      icon,
      whats_included: whatsIncludedList.filter(item => item.title.trim()),
      benefits: benefitsList.filter(item => item.title.trim()),
      images: imagesList,
      testimonials: testimonialsList.filter(item => item.author.trim()),
      service_types: serviceTypesList.filter(item => item.title.trim()),
      slug: slug || null,
      sort_order: sortOrder,
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
      canonical_url: canonicalUrl,
      meta_robots: metaRobots,
      categoryIds: selectedCategoryIds,
      home_section: homeSection,
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
        if (currentService) {
          // Stay on the current page after editing
          fetchServices(page);
        } else {
          // Jump to the page where the new service sits (sorted by sort_order asc)
          const createdPage = Math.max(1, Math.floor((sortOrder || 0) / PAGE_SIZE) + 1);
          fetchServices(createdPage);
        }
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

  // Inline reorder: swap this service's sort_order with its neighbour
  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;

    // Clone the list of services
    const updatedServices = [...services];
    
    // Swap the two items in the array (only the pair changes position)
    const a = updatedServices[idx];
    const b = updatedServices[targetIdx];
    const aOrder = a.sort_order ?? idx;
    const bOrder = b.sort_order ?? targetIdx;
    updatedServices[idx] = { ...a, sort_order: bOrder };
    updatedServices[targetIdx] = { ...b, sort_order: aOrder };

    // Only the two swapped items changed order; the rest keep their existing sort_order
    const servicesWithNewOrder = updatedServices;

    // Update state optimistically
    setServices(servicesWithNewOrder);

    // Identify which ones actually changed their sort_order and need to be saved
    const promises = [];
    for (let i = 0; i < servicesWithNewOrder.length; i++) {
      const original = services.find(s => s.id === servicesWithNewOrder[i].id);
      if (original && original.sort_order !== servicesWithNewOrder[i].sort_order) {
        promises.push(
          apiFetch(`/api/services/${servicesWithNewOrder[i].id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sort_order: servicesWithNewOrder[i].sort_order }),
          })
        );
      }
    }

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error('Reorder failed', err);
      fetchServices(page); // rollback
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service? All related images, testimonials, benefits, and inclusions will be deleted.')) return;

    try {
      const res = await apiFetch(`/api/services/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 204) {
        // If the last item on the page was deleted, step back one page
        const nextPage = services.length === 1 && page > 1 ? page - 1 : page;
        fetchServices(nextPage);
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
                  <th className="px-3 py-3 text-center w-20">Order</th>
                  <th className="px-5 py-3">Service Name</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3 text-center">Whats Included</th>
                  <th className="px-5 py-3 text-center">Benefits</th>
                  <th className="px-5 py-3 text-center">Testimonials</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {services.map((srv, idx) => (
                  <tr key={srv.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-3 py-3 w-20">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleReorder(srv.id, 'up')}
                          disabled={idx === 0}
                          title="Move up"
                          className="text-[#9CA3AF] hover:text-[#2563EB] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                        >
                          ▲
                        </button>
                        <span className="text-[10px] font-mono font-bold text-[#6B7280] w-6 text-center">{srv.sort_order ?? idx}</span>
                        <button
                          onClick={() => handleReorder(srv.id, 'down')}
                          disabled={idx === services.length - 1}
                          title="Move down"
                          className="text-[#9CA3AF] hover:text-[#2563EB] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
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

      {/* Pagination Controls */}
      {totalCount > PAGE_SIZE && (
        <div className="flex items-center justify-between border border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 rounded-lg shadow-xs">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              type="button"
              onClick={() => fetchServices(page - 1)}
              disabled={!hasPrev || loading}
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => fetchServices(page + 1)}
              disabled={!hasNext || loading}
              className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-[#4B5563]">
                Showing <span className="font-semibold">{Math.min((page - 1) * PAGE_SIZE + 1, totalCount)}</span> to{' '}
                <span className="font-semibold">{Math.min(page * PAGE_SIZE, totalCount)}</span> of{' '}
                <span className="font-semibold">{totalCount}</span> services
              </p>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => fetchServices(page - 1)}
                disabled={!hasPrev || loading}
                className="inline-flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => fetchServices(page + 1)}
                disabled={!hasNext || loading}
                className="inline-flex h-8 items-center justify-center rounded-md bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
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

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Service Icon</label>
                    <select
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white cursor-pointer"
                    >
                      <option value="Home">Home / Residential</option>
                      <option value="Sofa">Sofa / Upholstery</option>
                      <option value="Bed">Bed / Mattress</option>
                      <option value="Car">Car Seat / Vehicle</option>
                      <option value="Shirt">Shirt / Curtain</option>
                      <option value="Sparkles">Sparkles / Deep Clean</option>
                      <option value="Droplets">Droplets / Flood Damage</option>
                      <option value="Scissors">Scissors / Lawn Mowing</option>
                      <option value="Brush">Brush / Scrubbing</option>
                      <option value="Trash2">Trash / Rubbish Removal</option>
                      <option value="Wind">Wind / Air Freshness</option>
                      <option value="ShieldCheck">Shield Check / Sanitized</option>
                      <option value="Leaf">Leaf / Eco-Friendly</option>
                      <option value="Utensils">Utensils / Kitchen Clean</option>
                      <option value="Key">Key / Bond Clean</option>
                      <option value="Sun">Sun / Window Clean</option>
                      <option value="HelpCircle">Help / General</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Homepage Section</label>
                    <select
                      value={homeSection}
                      onChange={(e) => setHomeSection(e.target.value)}
                      className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white cursor-pointer"
                    >
                      <option value="steam">Steam Cleaning</option>
                      <option value="maintenance">Home Maintenance</option>
                      <option value="specialized">Specialized Cleaning & Restoration</option>
                    </select>
                    <p className="text-[10px] text-[#9CA3AF]">Which section this service appears under on the homepage.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Display Order</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={0}
                        value={sortOrder}
                        onChange={(e) => {
                          setSortOrder(Number(e.target.value));
                          sortOrderTouchedRef.current = true;
                        }}
                        className="w-24 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                      />
                      <p className="text-[10px] text-[#9CA3AF]">Lower numbers appear first on the frontend. You can also use the ▲▼ arrows in the table.</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Service Categories</label>
                    <div className="grid grid-cols-2 gap-2 border border-[#E5E7EB] bg-[#F9FAFB] rounded-md p-3 max-h-32 overflow-y-auto">
                      {allCategories.map((cat) => {
                        const isChecked = selectedCategoryIds.includes(cat.id);
                        return (
                          <label key={cat.id} className="flex items-center gap-2 text-xs text-[#111827] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat.id));
                                } else {
                                  setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                                }
                              }}
                              className="rounded border-[#E5E7EB] text-[#2563EB] focus:ring-[#2563EB]/25"
                            />
                            {cat.title}
                          </label>
                        );
                      })}
                    </div>
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

                  {/* Service Types */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Types of {name || 'Service'} We Masterfully Clean</h4>
                      <button
                        type="button"
                        onClick={addServiceType}
                        className="text-[10px] font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        + Add Service Type
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {serviceTypesList.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]">
                          <input
                            type="text"
                            required
                            placeholder="Type Title"
                            value={item.title}
                            onChange={(e) => updateServiceType(idx, 'title', e.target.value)}
                            className="flex-1 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <input
                            type="text"
                            placeholder="Description (optional)"
                            value={item.description}
                            onChange={(e) => updateServiceType(idx, 'description', e.target.value)}
                            className="flex-2 rounded-md border border-[#E5E7EB] bg-white px-2.5 py-1 text-xs text-[#111827]"
                          />
                          <button
                            type="button"
                            onClick={() => removeServiceType(idx)}
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
                    <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Robots Tag (meta_robots)</label>
                    <input
                      type="text"
                      value={metaRobots}
                      onChange={(e) => setMetaRobots(e.target.value)}
                      placeholder="e.g. noindex, nofollow"
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
