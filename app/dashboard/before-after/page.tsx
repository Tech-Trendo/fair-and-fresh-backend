'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';

interface BeforeAfterImage {
  id: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
  createdAt: string;
}

export default function BeforeAfterPage() {
  const [images, setImages] = useState<BeforeAfterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/before-after/');
      if (res.status === 200) {
        const data = await res.json();
        setImages(data);
      } else {
        throw new Error('Failed to load images');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred loading images.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        setNewImageUrl(data.image_url);
      } else {
        alert('Image upload failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image.');
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setNewImageUrl('');
    setNewCaption('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;

    setSubmitLoading(true);

    try {
      const res = await apiFetch('/api/before-after/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: newImageUrl, caption: newCaption }),
      });

      if (res.status === 201) {
        setModalOpen(false);
        fetchImages();
      } else {
        alert('Failed to create image.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error occurred.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const idx = images.findIndex(i => i.id === id);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const updated = [...images];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const withOrder = updated.map((img, i) => ({ ...img, sortOrder: i }));
    setImages(withOrder);

    const promises = [];
    for (let i = 0; i < withOrder.length; i++) {
      const original = images.find(img => img.id === withOrder[i].id);
      if (original && original.sortOrder !== withOrder[i].sortOrder) {
        promises.push(
          apiFetch(`/api/before-after/${withOrder[i].id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sort_order: withOrder[i].sortOrder }),
          })
        );
      }
    }

    try {
      await Promise.all(promises);
    } catch (err) {
      console.error('Reorder failed', err);
      fetchImages();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await apiFetch(`/api/before-after/${id}/`, {
        method: 'DELETE',
      });

      if (res.status === 200) {
        fetchImages();
      } else {
        alert('Delete failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting image.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Before & After</h1>
          <p className="text-xs text-[#4B5563]">Manage before/after showcase images for the services page.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
        >
          Add Image
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
          <p className="text-xs font-semibold text-red-700">Error Loading Images</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <p className="text-sm font-semibold text-[#111827]">No images yet</p>
          <p className="text-xs text-[#4B5563] mt-1">Add before/after images to showcase your work.</p>
          <button
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2563EB] px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            Add Image
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider bg-[#F9FAFB]">
                  <th className="px-3 py-3 text-center w-20">Order</th>
                  <th className="px-5 py-3">Image</th>
                  <th className="px-5 py-3">Caption</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {images.map((img, idx) => (
                  <tr key={img.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                    <td className="px-3 py-3 w-20">
                      <div className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => handleReorder(img.id, 'up')}
                          disabled={idx === 0}
                          title="Move up"
                          className="text-[#9CA3AF] hover:text-[#2563EB] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                        >▲</button>
                        <span className="text-[10px] font-mono font-bold text-[#6B7280] w-6 text-center">{img.sortOrder ?? idx}</span>
                        <button
                          onClick={() => handleReorder(img.id, 'down')}
                          disabled={idx === images.length - 1}
                          title="Move down"
                          className="text-[#9CA3AF] hover:text-[#2563EB] disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer leading-none"
                        >▼</button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded border border-[#E5E7EB] overflow-hidden bg-[#F3F4F6] flex-shrink-0">
                          <img src={img.imageUrl} alt={img.caption || ''} className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[#4B5563]">{img.caption || '-'}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(img.id)}
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
              <h3 className="text-sm font-semibold text-[#111827]">Add Before & After Image</h3>
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
              {newImageUrl && (
                <div className="rounded-lg border border-[#E5E7EB] overflow-hidden bg-[#F3F4F6]">
                  <img src={newImageUrl} alt="Preview" className="w-full h-48 object-cover" />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="ba-image-file"
                  disabled={uploading}
                />
                <label
                  htmlFor="ba-image-file"
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[#E5E7EB] bg-white px-4 text-xs font-semibold text-[#4B5563] hover:bg-[#F9FAFB] cursor-pointer transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Choose & Upload Image'}
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  required
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="URL will appear after upload"
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">Caption (optional)</label>
                <input
                  type="text"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="e.g. Living room carpet before & after"
                  className="w-full rounded-md border border-[#E5E7EB] bg-[#F9FAFB] px-3.5 py-2 text-xs text-[#111827] outline-hidden focus:border-zinc-400 focus:bg-white"
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
                  disabled={submitLoading || !newImageUrl}
                  className="inline-flex h-8 items-center justify-center rounded-md bg-[#2563EB] px-4 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer transition-colors disabled:opacity-50"
                >
                  {submitLoading ? 'Saving...' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
