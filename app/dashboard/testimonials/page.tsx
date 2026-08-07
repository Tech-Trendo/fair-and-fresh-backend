'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';

interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  location?: string | null;
  service_id: string;
  service_name?: string;
}

interface ServiceOption {
  id: string;
  name: string;
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ author: '', location: '', rating: 5, service_id: '', content: '' });
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/testimonials/');
      if (res.status === 200) {
        setItems(await res.json());
      } else {
        throw new Error('Failed to load testimonials');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading testimonials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    apiFetch('/api/services/')
      .then((res) => (res.ok ? res.json() : { results: [] }))
      .then((data) => setServices((data.results || []).map((s: any) => ({ id: s.id, name: s.name }))))
      .catch(() => {});
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm({ author: '', location: '', rating: 5, service_id: services[0]?.id || '', content: '' });
    setModalOpen(true);
  };

  const openEditModal = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      author: item.author,
      location: item.location || '',
      rating: item.rating,
      service_id: item.service_id,
      content: item.content,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.content.trim() || !form.service_id) {
      alert('Please fill in author, service, and testimonial content.');
      return;
    }

    setSubmitLoading(true);
    const payload = {
      author: form.author,
      location: form.location,
      rating: Number(form.rating),
      service_id: form.service_id,
      content: form.content,
    };

    try {
      const res = editingId
        ? await apiFetch(`/api/testimonials/${editingId}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await apiFetch('/api/testimonials/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (res.status === 200 || res.status === 201) {
        setModalOpen(false);
        fetchItems();
      } else {
        alert('Failed to save testimonial.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const res = await apiFetch(`/api/testimonials/${id}/`, { method: 'DELETE' });
      if (res.status === 200) {
        fetchItems();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting testimonial.');
    }
  };

  const serviceName = (item: Testimonial) =>
    services.find((s) => s.id === item.service_id)?.name || item.service_name || '-';

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Testimonials</h1>
          <p className="text-xs text-[#4B5563]">Manage customer testimonials shown on the homepage.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <svg className="h-6 w-6 animate-spin text-zinc-400" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-xs font-semibold text-red-700">Error Loading Testimonials</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-semibold text-[#111827]">No testimonials yet</p>
          <p className="text-xs text-[#4B5563] mt-1">Add testimonials to showcase customer reviews on the homepage.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Add Testimonial
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3">Service</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Testimonial</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {items.map((item) => (
                  <tr key={item.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-[#111827]">{item.author}</td>
                    <td className="px-5 py-3 text-[#F59E0B] whitespace-nowrap">{'★'.repeat(item.rating)}</td>
                    <td className="px-5 py-3 text-[#4B5563]">{serviceName(item)}</td>
                    <td className="px-5 py-3 text-[#4B5563]">{item.location || '-'}</td>
                    <td className="px-5 py-3 text-[#4B5563] max-w-xs truncate" title={item.content}>
                      &ldquo;{item.content}&rdquo;
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] transition-colors cursor-pointer mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB]">
              <h3 className="text-sm font-semibold text-[#111827]">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Author Name</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="e.g. Jessica L."
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Location (optional)</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Brisbane, QLD"
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Service</label>
                  <select
                    value={form.service_id}
                    onChange={(e) => setForm({ ...form, service_id: e.target.value })}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                  >
                    {services.length === 0 && <option value="">Loading services...</option>}
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Rating</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{'★'.repeat(n)} ({n}/5)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Testimonial</label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="What did the customer say?"
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white resize-y"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
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
                  {submitLoading ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
