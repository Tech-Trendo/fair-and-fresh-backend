'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';
import { toast } from 'sonner';
import {
  FileText,
  Trash2,
  Calendar,
  Phone,
  User,
  Filter,
  RefreshCw,
  Search,
  ClipboardList,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface QuotationRequest {
  id: string;
  services: string[];
  preferredDate: string | null;
  preferredTime: string | null;
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  additionalNotes: string | null;
  createdAt: string;
  status: string;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Contacted' | 'Completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchQuotations = async (currentPage: number = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/quote?page=${currentPage}&page_size=10`);
      if (!res.ok) {
        throw new Error('Failed to load quotation requests');
      }
      const data = await res.json();
      setQuotations(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setPage(currentPage);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching quotations.');
      toast.error('Could not load quotations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/quote/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setQuotations((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );

      toast.success(`Quotation marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this quotation request? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await apiFetch(`/api/quote/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete quotation');
      }

      setQuotations((prev) => prev.filter((q) => q.id !== id));
      setTotalCount((c) => c - 1);
      toast.success('Quotation request deleted successfully.');
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      toast.error('Failed to delete quotation.');
    }
  };

  // Local filtering & searching
  const filteredQuotations = quotations.filter((q) => {
    const matchesFilter = filter === 'all' || q.status === filter;

    const matchesSearch =
      searchQuery === '' ||
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.phone.includes(searchQuery) ||
      q.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.street.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Quotation Requests
          </h1>
          <p className="text-xs text-[#4B5563]">
            Manage user quote submissions and cleaning requests.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchQuotations(page)}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search quotations by name, email, phone, city, or service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
          />
        </div>

        {/* Filter buttons */}
        <div className="md:col-span-2 flex justify-end gap-1.5 bg-white border border-[#E5E7EB] p-1 rounded-lg">
          {(['all', 'Pending', 'Contacted', 'Completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all ${
                filter === status
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-[#4B5563] hover:bg-[#F9FAFB]'
              }`}
            >
              {status === 'all' ? 'All' : status}
              {status !== 'all' && quotations.filter((q) => q.status === status).length > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] ${
                  filter === status ? 'bg-primary-foreground text-primary' : 'bg-zinc-100 text-zinc-700'
                }`}>
                  {quotations.filter((q) => q.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-64 items-center justify-center bg-white rounded-lg border border-[#E5E7EB] shadow-xs">
          <div className="flex flex-col items-center gap-3">
            <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-xs text-muted-foreground font-medium">Fetching quote requests...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-650 shadow-xs">
          <p className="text-xs font-semibold">Error Loading Quotations</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
          <Button size="sm" onClick={() => fetchQuotations(1)} className="mt-4">
            Retry
          </Button>
        </div>
      ) : filteredQuotations.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <ClipboardList className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">No quotation requests found</h3>
          <p className="text-xs text-[#4B5563] mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query or switching filters.' : 'There are currently no quotation requests.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            {filteredQuotations.map((quote) => {
              const isExpanded = expandedId === quote.id;
              const dateStr = new Date(quote.createdAt).toLocaleDateString('en-AU', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={quote.id}
                  className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-primary/50 shadow-md bg-white'
                      : quote.status === 'Pending'
                      ? 'border-[#2563EB]/40 bg-blue-50/10 hover:bg-blue-50/20'
                      : 'border-[#E5E7EB] bg-white hover:bg-zinc-50/50'
                  }`}
                >
                  {/* Header summary of quotation card */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : quote.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs md:text-sm font-semibold truncate ${quote.status === 'Pending' ? 'text-blue-950 font-bold' : 'text-[#111827]'}`}>
                            {quote.name}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${
                            quote.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                            quote.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {quote.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-primary">
                            Services: {Array.isArray(quote.services) ? quote.services.join(', ') : quote.services || 'None'}
                          </span>
                          <span className="text-[#9CA3AF]">•</span>
                          <span>{quote.city}</span>
                          <span className="text-[#9CA3AF]">•</span>
                          <span>{quote.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {dateStr}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(quote.id);
                          }}
                          className="h-7 w-7 text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
                          title="Delete request"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail section */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 border-t border-zinc-100 bg-[#F9FAFB]/50 animate-fade-in text-xs">
                      {/* Customer Details Block */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-white p-3 rounded-lg border border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[9px] uppercase tracking-wider">Customer Name</span>
                            <span className="font-semibold text-[#111827]">{quote.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[9px] uppercase tracking-wider">Phone</span>
                            <a href={`tel:${quote.phone}`} className="font-semibold text-primary hover:underline">
                              {quote.phone}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[9px] uppercase tracking-wider">Email</span>
                            <a href={`mailto:${quote.email}`} className="font-semibold text-primary hover:underline">
                              {quote.email}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Location & Preferred Time Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] flex gap-2">
                          <MapPin className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[9px] uppercase tracking-wider">Service Address</span>
                            <span className="font-semibold text-[#111827]">{quote.street}, {quote.city}</span>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] flex gap-2">
                          <Clock className="h-4 w-4 text-[#9CA3AF] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[9px] uppercase tracking-wider">Preferred Date & Time</span>
                            <span className="font-semibold text-[#111827]">
                              {quote.preferredDate ? quote.preferredDate : 'Not specified'} at{' '}
                              {quote.preferredTime ? quote.preferredTime : 'Not specified'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Notes */}
                      <div className="bg-white p-3 rounded-lg border border-[#E5E7EB] mb-4">
                        <div className="text-[9px] font-bold text-[#4B5563] uppercase tracking-wider mb-1">Additional Notes</div>
                        <p className="text-[#111827] whitespace-pre-wrap leading-relaxed">
                          {quote.additionalNotes || 'No additional notes provided.'}
                        </p>
                      </div>

                      {/* Actions/Status Updates */}
                      <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-3 rounded-lg border border-[#E5E7EB]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#4B5563] font-semibold text-[10px] uppercase tracking-wider">Update Status:</span>
                          <button
                            onClick={() => handleUpdateStatus(quote.id, 'Pending')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                              quote.status === 'Pending'
                                ? 'bg-blue-55 text-blue-700 border-blue-300'
                                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(quote.id, 'Contacted')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                              quote.status === 'Contacted'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                            }`}
                          >
                            Contacted
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(quote.id, 'Completed')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                              quote.status === 'Completed'
                                ? 'bg-green-50 text-green-700 border-green-300'
                                : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700'
                            }`}
                          >
                            Completed
                          </button>
                        </div>

                        <div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(quote.id)}
                            className="h-8 text-[11px] font-semibold"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete Request
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalCount > 10 && (
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 rounded-lg shadow-xs mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => fetchQuotations(page - 1)}
                  disabled={!hasPrev || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchQuotations(page + 1)}
                  disabled={!hasNext || loading}
                >
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-[#4B5563]">
                    Showing <span className="font-semibold">{Math.min((page - 1) * 10 + 1, totalCount)}</span> to{' '}
                    <span className="font-semibold">{Math.min(page * 10, totalCount)}</span> of{' '}
                    <span className="font-semibold">{totalCount}</span> results
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchQuotations(page - 1)}
                    disabled={!hasPrev || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchQuotations(page + 1)}
                    disabled={!hasNext || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
