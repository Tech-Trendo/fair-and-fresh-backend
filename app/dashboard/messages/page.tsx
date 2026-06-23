'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';
import { toast } from 'sonner';
import {
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  Phone,
  User,
  Filter,
  RefreshCw,
  Search,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchMessages = async (currentPage: number = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`/api/contact?page=${currentPage}&page_size=10`);
      if (!res.ok) {
        throw new Error('Failed to load contact messages');
      }
      const data = await res.json();
      setMessages(data.results || []);
      setTotalCount(data.count || 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setPage(currentPage);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching messages.');
      toast.error('Could not load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    try {
      const res = await apiFetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead: !currentReadStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, isRead: !currentReadStatus } : msg))
      );

      toast.success(currentReadStatus ? 'Message marked as unread' : 'Message marked as read');
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await apiFetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      setTotalCount((c) => c - 1);
      toast.success('Message deleted successfully.');
      if (expandedId === id) setExpandedId(null);
    } catch (err) {
      toast.error('Failed to delete message.');
    }
  };

  // Local filtering & searching based on page-loaded messages
  const filteredMessages = messages.filter((msg) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && !msg.isRead) ||
      (filter === 'read' && msg.isRead);

    const matchesSearch =
      searchQuery === '' ||
      msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Messages
          </h1>
          <p className="text-xs text-[#4B5563]">
            Manage user submissions and inquiries from the contact form.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMessages(page)}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Summary & Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search messages by name, email, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#E5E7EB] rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
          />
        </div>

        {/* Filter buttons */}
        <div className="md:col-span-2 flex justify-end gap-1.5 bg-white border border-[#E5E7EB] p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F9FAFB]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F9FAFB]'
            }`}
          >
            Unread
            {messages.filter((m) => !m.isRead).length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${filter === 'unread' ? 'bg-primary-foreground text-primary' : 'bg-red-100 text-red-700'}`}>
                {messages.filter((m) => !m.isRead).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`flex-1 py-1.5 px-3 rounded-md text-[11px] font-semibold transition-all ${
              filter === 'read'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-[#4B5563] hover:bg-[#F9FAFB]'
            }`}
          >
            Read
          </button>
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
            <span className="text-xs text-muted-foreground font-medium">Fetching messages...</span>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-650 shadow-xs">
          <p className="text-xs font-semibold">Error Loading Messages</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
          <Button size="sm" onClick={() => fetchMessages(1)} className="mt-4">
            Retry
          </Button>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center shadow-xs">
          <div className="mx-auto w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <MailOpen className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="text-sm font-bold text-[#111827]">No messages found</h3>
          <p className="text-xs text-[#4B5563] mt-1 max-w-sm mx-auto">
            {searchQuery ? 'Try clearing your search query or switching filters.' : 'Congratulations! Your inbox is completely clean.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            {filteredMessages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              const dateStr = new Date(msg.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={msg.id}
                  className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-primary/50 shadow-md bg-white'
                      : !msg.isRead
                      ? 'border-[#2563EB]/40 bg-blue-50/20 hover:bg-blue-50/30'
                      : 'border-[#E5E7EB] bg-white hover:bg-zinc-50/50'
                  }`}
                >
                  {/* Header summary of message card */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Read status icon */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(msg.id, msg.isRead);
                        }}
                        title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        className={`flex-shrink-0 mt-0.5 p-1 rounded hover:bg-zinc-150 transition-colors ${
                          msg.isRead ? 'text-[#9CA3AF]' : 'text-primary'
                        }`}
                      >
                        {msg.isRead ? <MailOpen className="h-4.5 w-4.5" /> : <Mail className="h-4.5 w-4.5" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs md:text-sm font-semibold truncate ${!msg.isRead ? 'text-blue-950 font-bold' : 'text-[#111827]'}`}>
                            {msg.name}
                          </span>
                          {!msg.isRead && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 text-[8px] font-extrabold uppercase tracking-wider">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {msg.subject ? (
                            <span className="font-medium text-[#4B5563]">Subject: {msg.subject}</span>
                          ) : (
                            <span className="italic">No subject</span>
                          )}
                          <span className="mx-2">•</span>
                          <span>{msg.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-center">
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {dateStr}
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRead(msg.id, msg.isRead);
                          }}
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          {msg.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(msg.id);
                          }}
                          className="h-7 w-7 text-[#EF4444] hover:text-[#DC2626] hover:bg-red-50"
                          title="Delete message"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail section */}
                  {isExpanded && (
                    <div className="px-4 pb-5 pt-1 border-t border-zinc-100 bg-[#F9FAFB]/50 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs bg-white p-3 rounded-lg border border-[#E5E7EB]">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[10px] uppercase tracking-wider">Sender</span>
                            <span className="font-semibold text-[#111827]">{msg.name}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-[#9CA3AF]" />
                          <div>
                            <span className="text-[#4B5563] font-medium block text-[10px] uppercase tracking-wider">Email</span>
                            <a href={`mailto:${msg.email}`} className="font-semibold text-primary hover:underline">
                              {msg.email}
                            </a>
                          </div>
                        </div>

                        {msg.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" />
                            <div>
                              <span className="text-[#4B5563] font-medium block text-[10px] uppercase tracking-wider">Phone</span>
                              <a href={`tel:${msg.phone}`} className="font-semibold text-[#111827] hover:underline">
                                {msg.phone}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-[#E5E7EB] shadow-xs">
                        <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Message Inquiry</div>
                        <p className="text-xs text-[#111827] leading-relaxed whitespace-pre-wrap selection:bg-primary/20">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalCount > 10 && (
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-4 py-3 sm:px-6 rounded-lg shadow-xs mt-4">
              <div className="flex flex-1 justify-between sm:hidden">
                <Button
                  variant="outline"
                  onClick={() => fetchMessages(page - 1)}
                  disabled={!hasPrev || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => fetchMessages(page + 1)}
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
                    onClick={() => fetchMessages(page - 1)}
                    disabled={!hasPrev || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchMessages(page + 1)}
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
