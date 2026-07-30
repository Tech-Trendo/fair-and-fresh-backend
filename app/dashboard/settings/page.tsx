'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/auth';
import { toast } from 'sonner';
import { Save, RefreshCw, Check, X, Eye, Edit3, Plus, Trash2, Upload, ImageIcon } from 'lucide-react';

interface SiteContentItem {
  id: string;
  key: string;
  value: string;
  label: string;
  group: string;
  type: string;
}

const tabs = [
  { id: 'site_settings', label: 'Site Settings' },
  { id: 'home', label: 'Homepage' },
  { id: 'about', label: 'About Page' },
  { id: 'contact', label: 'Contact Page' },
  { id: 'services', label: 'Services Page' },
  { id: 'footer', label: 'Footer' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('site_settings');
  const [contentMap, setContentMap] = useState<Record<string, SiteContentItem[]>>({});
  const [allItems, setAllItems] = useState<SiteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});
  const [changedKeys, setChangedKeys] = useState<Set<string>>(new Set());
  const [showNewForm, setShowNewForm] = useState(false);
  const [newItem, setNewItem] = useState({ key: '', value: '', label: '', group: '', type: 'text' });
  const [imageUploading, setImageUploading] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(key);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'cms');
    try {
      const res = await apiFetch('/api/upload/', { method: 'POST', body: formData });
      if (res.status === 201) {
        const data = await res.json();
        handleValueChange(key, data.image_url);
      } else {
        toast.error('Upload failed.');
      }
    } catch (err) {
      toast.error('Error uploading image.');
    } finally {
      setImageUploading(null);
    }
  };

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/site-content');
      const data = await res.json();
      const items = data.results || [];
      setAllItems(items);

      // Group by category
      const grouped: Record<string, SiteContentItem[]> = {};
      tabs.forEach(tab => { grouped[tab.id] = []; });
      items.forEach((item: SiteContentItem) => {
        if (!grouped[item.group]) grouped[item.group] = [];
        grouped[item.group].push(item);
      });
      setContentMap(grouped);

      // Initialize editing values
      const values: Record<string, string> = {};
      items.forEach((item: SiteContentItem) => {
        values[item.key] = item.value;
      });
      setEditingValues(values);
      setChangedKeys(new Set());
    } catch (err) {
      console.error('Failed to load site content:', err);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleValueChange = (key: string, value: string) => {
    setEditingValues(prev => {
      const oldValue = allItems.find(i => i.key === key)?.value;
      const newValues = { ...prev, [key]: value };
      const newChanged = new Set(changedKeys);
      if (oldValue !== value) {
        newChanged.add(key);
      } else {
        newChanged.delete(key);
      }
      setChangedKeys(newChanged);
      return newValues;
    });
  };

  const handleSave = async () => {
    if (changedKeys.size === 0) {
      toast.info('No changes to save');
      return;
    }

    try {
      setSaving(true);
      const updates = Array.from(changedKeys).map(key => ({
        key,
        value: editingValues[key] || '',
      }));

      const res = await apiFetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (res.ok) {
        toast.success('Content updated successfully!');
        setChangedKeys(new Set());
        fetchContent();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to save');
      }
    } catch (err) {
      toast.error('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAddNew = async () => {
    if (!newItem.key || !newItem.value || !newItem.label || !newItem.group) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await apiFetch('/api/site-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (res.ok) {
        toast.success('Content added!');
        setShowNewForm(false);
        setNewItem({ key: '', value: '', label: '', group: '', type: 'text' });
        fetchContent();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to add');
      }
    } catch (err) {
      toast.error('Failed to add content');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Delete this content entry?')) return;

    try {
      const res = await apiFetch(`/api/site-content?key=${key}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Content deleted');
        fetchContent();
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const currentItems = contentMap[activeTab] || [];

  const renderEditor = (item: SiteContentItem) => {
    const isChanged = changedKeys.has(item.key);
    return (
      <div
        key={item.key}
        className={`p-4 rounded-lg border transition-all ${
          isChanged
            ? 'border-amber-300 bg-amber-50/50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {item.label}
            </label>
            <span className="text-[10px] text-gray-400 font-mono">{item.key}</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {isChanged && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                <Edit3 className="h-2.5 w-2.5" />
                Modified
              </span>
            )}
            <button
              onClick={() => handleDelete(item.key)}
              className="p-1 text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {item.type === 'textarea' ? (
          <textarea
            value={editingValues[item.key] || ''}
            onChange={(e) => handleValueChange(item.key, e.target.value)}
            rows={4}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors resize-y"
          />
        ) : item.type === 'image' ? (
          <div className="mt-1">
            {editingValues[item.key] ? (
              /* Current image preview with hover overlay */
              <div className="relative group">
                <img
                  src={editingValues[item.key]}
                  alt={item.label}
                  className="w-full h-48 rounded-lg border border-gray-200 object-contain p-4 bg-gray-50/80"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all rounded-lg flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <label
                    htmlFor={`img-${item.key}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer transition-all shadow-md"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Replace
                  </label>
                  <button
                    onClick={() => handleValueChange(item.key, '')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-500 rounded-lg text-xs font-semibold text-white hover:bg-red-600 cursor-pointer transition-all shadow-md"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              /* Upload zone when no image */
              <label
                htmlFor={`img-${item.key}`}
                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  imageUploading === item.key
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {imageUploading === item.key ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                    <span className="text-xs text-blue-600 font-medium">Uploading to blob storage...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-600">Click to upload image</span>
                    <span className="text-[10px] text-gray-400">PNG, JPG, WebP up to 10MB</span>
                  </div>
                )}
              </label>
            )}
            {/* Hidden file input */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                handleImageUpload(e, item.key);
                e.target.value = '';
              }}
              className="hidden"
              id={`img-${item.key}`}
            />
          </div>
        ) : (
          <input
            type={item.type === 'number' ? 'number' : 'text'}
            value={editingValues[item.key] || ''}
            onChange={(e) => handleValueChange(item.key, e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900 tracking-tight">Site Content</h1>
          <p className="text-xs text-gray-500 mt-1">Manage all editable content across your site</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Field
          </button>
          <button
            onClick={handleSave}
            disabled={changedKeys.size === 0 || saving}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              changedKeys.size === 0 || saving
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
            }`}
          >
            {saving ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saving ? 'Saving...' : `Save Changes${changedKeys.size > 0 ? ` (${changedKeys.size})` : ''}`}
          </button>
        </div>
      </div>

      {/* New Item Form */}
      {showNewForm && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-xs font-semibold text-blue-700 mb-3 uppercase tracking-wider">Add New Content Field</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-blue-600 mb-1">Key *</label>
              <input
                value={newItem.key}
                onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
                placeholder="e.g. home_hero_title"
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-blue-600 mb-1">Label *</label>
              <input
                value={newItem.label}
                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                placeholder="e.g. Hero Title"
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-blue-600 mb-1">Group *</label>
              <select
                value={newItem.group}
                onChange={(e) => setNewItem({ ...newItem, group: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="">Select...</option>
                {tabs.map(tab => (
                  <option key={tab.id} value={tab.id}>{tab.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-blue-600 mb-1">Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="number">Number</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-medium text-blue-600 mb-1">Value *</label>
              <input
                value={newItem.value}
                onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                placeholder="Default value"
                className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Check className="h-3 w-3" />
              Add
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-all cursor-pointer"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => {
          const tabItems = contentMap[tab.id] || [];
          const hasChanges = tabItems.some(item => changedKeys.has(item.key));
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
              }`}
            >
              {tab.label}
              {hasChanges && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-amber-400 rounded-full" />
              )}
              <span className="ml-1.5 text-[10px] text-gray-400 font-normal">({tabItems.length})</span>
            </button>
          );
        })}
      </div>

      {/* Content Editor */}
      <div className="space-y-3">
        {currentItems.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No editable content in this section yet.</p>
            <button
              onClick={() => setShowNewForm(true)}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-all cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              Add First Field
            </button>
          </div>
        ) : (
          <div className="grid gap-3">
            {currentItems.map(renderEditor)}
          </div>
        )}
      </div>
    </div>
  );
}
