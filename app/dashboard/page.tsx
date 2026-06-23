'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/auth';
import Link from 'next/link';

interface DashboardStats {
  categories: number;
  services: number;
  blogs: number;
  messages: number;
  unreadMessages: number;
  quotes: number;
  pendingQuotes: number;
}

interface RecentActivityItem {
  id: string;
  type: 'Service' | 'Category' | 'Blog' | 'Message' | 'Quote';
  name: string;
  date: string;
  status: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStatsAndActivity() {
      try {
        setError('');
        const [catRes, srvRes, blogRes, contactRes, quoteRes] = await Promise.all([
          apiFetch('/api/category/'),
          apiFetch('/api/services/'),
          apiFetch('/api/blog/'),
          apiFetch('/api/contact'),
          apiFetch('/api/quote')
        ]);

        if (catRes.status !== 200 || srvRes.status !== 200 || blogRes.status !== 200 || contactRes.status !== 200 || quoteRes.status !== 200) {
          throw new Error('Failed to load dashboard metrics');
        }

        const [catData, srvData, blogData, contactData, quoteData] = await Promise.all([
          catRes.json(),
          srvRes.json(),
          blogRes.json(),
          contactRes.json(),
          quoteRes.json()
        ]);

        const rawContacts = contactData.results || [];
        const unreadCount = rawContacts.filter((c: any) => !c.isRead).length;

        const rawQuotes = quoteData.results || [];
        const pendingQuotesCount = rawQuotes.filter((q: any) => q.status === 'Pending').length;

        setStats({
          categories: catData.count || 0,
          services: srvData.count || 0,
          blogs: blogData.count || 0,
          messages: contactData.count || 0,
          unreadMessages: unreadCount,
          quotes: quoteData.count || 0,
          pendingQuotes: pendingQuotesCount,
        });

        // Parse combined list of recent items to render in data table
        const rawCats = catData.results || [];
        const rawSrvs = srvData.results || [];
        const rawBlogs = blogData.results || [];

        const combined: RecentActivityItem[] = [
          ...rawCats.map((c: any) => ({
            id: c.id,
            type: 'Category' as const,
            name: c.title,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Active'
          })),
          ...rawSrvs.map((s: any) => ({
            id: s.id,
            type: 'Service' as const,
            name: s.name,
            date: new Date(s.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Operational'
          })),
          ...rawBlogs.map((b: any) => ({
            id: b.id,
            type: 'Blog' as const,
            name: b.title,
            date: new Date(b.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Published'
          })),
          ...rawContacts.map((m: any) => ({
            id: m.id,
            type: 'Message' as const,
            name: `Message from ${m.name}`,
            date: new Date(m.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: m.isRead ? 'Read' : 'New'
          })),
          ...rawQuotes.map((q: any) => ({
            id: q.id,
            type: 'Quote' as const,
            name: `Quote Request from ${q.name}`,
            date: new Date(q.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: q.status
          }))
        ];

        // Slice top 5 activities
        setActivities(combined.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching dashboard statistics.');
      } finally {
        setLoading(false);
      }
    }

    fetchStatsAndActivity();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <svg className="h-6 w-6 animate-spin text-zinc-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-center text-red-650">
        <p className="text-xs font-semibold">Error Loading Overview</p>
        <p className="mt-1 text-xs text-zinc-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md text-[10px] font-semibold border border-zinc-200 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto font-sans">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-bold text-[#111827] tracking-tight">Overview</h1>
          <p className="text-xs text-[#4B5563]">Review aggregate metrics and manage database collections.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Services Count Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Total Services</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]">
                +4% MoM
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827] tracking-tight mt-3">{stats?.services || 0}</p>
          </div>
        </div>

        {/* Categories Count Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Active Categories</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]">
                Stable
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827] tracking-tight mt-3">{stats?.categories || 0}</p>
          </div>
        </div>

        {/* Blogs Count Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Published Blogs</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]">
                +12% MoM
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827] tracking-tight mt-3">{stats?.blogs || 0}</p>
          </div>
        </div>

        {/* Messages Count Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Contact Messages</span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                stats?.unreadMessages && stats.unreadMessages > 0
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {stats?.unreadMessages && stats.unreadMessages > 0 ? `${stats.unreadMessages} New` : 'All Read'}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827] tracking-tight mt-3">{stats?.messages || 0}</p>
          </div>
        </div>

        {/* Quotations Count Card */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider">Quote Requests</span>
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                stats?.pendingQuotes && stats.pendingQuotes > 0
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {stats?.pendingQuotes && stats.pendingQuotes > 0 ? `${stats.pendingQuotes} Pending` : 'All Done'}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#111827] tracking-tight mt-3">{stats?.quotes || 0}</p>
          </div>
        </div>
      </div>

      {/* Main Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Data Visualization Panel (SVG Area Chart) */}
        <div className="lg:col-span-2 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">Weekly Database Hits</h3>
            <p className="text-[10px] text-[#4B5563] mt-0.5">Mock analytics representation of user interactions.</p>
          </div>
          
          <div className="h-44 w-full mt-2 relative">
            {/* SVG Area Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Grids */}
              <line x1="0" y1="25" x2="500" y2="25" stroke="#F3F4F6" strokeWidth="1" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="#F3F4F6" strokeWidth="1" />
              <line x1="0" y1="125" x2="500" y2="125" stroke="#F3F4F6" strokeWidth="1" />
              {/* Area Path */}
              <path
                d="M0 125 C 50 100, 100 110, 150 65 C 200 20, 250 85, 300 45 C 350 5, 400 35, 450 15 L 500 15 L 500 150 L 0 150 Z"
                fill="url(#chartGradient)"
              />
              {/* Line Path */}
              <path
                d="M0 125 C 50 100, 100 110, 150 65 C 200 20, 250 85, 300 45 C 350 5, 400 35, 450 15 L 500 15"
                fill="none"
                stroke="#2563EB"
                strokeWidth="2"
              />
              {/* Points */}
              <circle cx="150" cy="65" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="300" cy="45" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
              <circle cx="450" cy="15" r="3.5" fill="#2563EB" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
          </div>
          <div className="flex justify-between items-center text-[9px] text-[#9CA3AF] px-1 font-semibold uppercase tracking-wider">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Quick Config Links */}
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">Quick Actions</h3>
            <p className="text-[10px] text-[#4B5563] mt-0.5">Common admin configuration workflows.</p>
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <Link
              href="/dashboard/categories"
              className="flex justify-between items-center p-3 rounded border border-[#E5E7EB] bg-white hover:border-[#2563EB] transition-colors group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">Add New Category</span>
                <span className="text-[9px] text-[#4B5563]">Define service organization types</span>
              </div>
              <svg className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/services"
              className="flex justify-between items-center p-3 rounded border border-[#E5E7EB] bg-white hover:border-[#2563EB] transition-colors group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">Create Service Catalog</span>
                <span className="text-[9px] text-[#4B5563]">Configure whats included & packages</span>
              </div>
              <svg className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/blogs"
              className="flex justify-between items-center p-3 rounded border border-[#E5E7EB] bg-white hover:border-[#2563EB] transition-colors group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">Publish Blog Article</span>
                <span className="text-[9px] text-[#4B5563]">Create market guidance & config SEO</span>
              </div>
              <svg className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/messages"
              className="flex justify-between items-center p-3 rounded border border-[#E5E7EB] bg-white hover:border-[#2563EB] transition-colors group"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors">Inbox Messages</span>
                <span className="text-[9px] text-[#4B5563]">View user contact form submissions</span>
              </div>
              <svg className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2563EB] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity Table Section */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-xs p-5 flex flex-col gap-4">
        <div>
          <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wider">Recently Added Collection Items</h3>
          <p className="text-[10px] text-[#4B5563] mt-0.5">Log of latest additions in your database.</p>
        </div>

        <div className="overflow-x-auto w-full mt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[9px] font-bold text-[#4B5563] uppercase tracking-wider">
                <th className="pb-3">Collection Item</th>
                <th className="pb-3">Type</th>
                <th className="pb-3 text-right">Created At</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {activities.map((act) => (
                <tr key={act.id} className="text-xs hover:bg-[#F9FAFB]/50 transition-colors">
                  <td className="py-3 font-semibold text-[#111827]">{act.name}</td>
                  <td className="py-3 text-[#4B5563]">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${
                      act.type === 'Service' ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]/50' :
                      act.type === 'Category' ? 'bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]/50' :
                      act.type === 'Blog' ? 'bg-[#EFF6FF] text-[#1E40AF] border border-[#DBEAFE]/50' :
                      act.type === 'Quote' ? 'bg-amber-50 text-amber-700 border border-amber-200/50' :
                      'bg-purple-55 text-purple-700 border border-purple-200/50'
                    }`}>
                      {act.type}
                    </span>
                  </td>
                  <td className="py-3 text-right text-[#4B5563]">{act.date}</td>
                  <td className="py-3 text-right">
                    <span className="text-[10px] font-medium text-[#111827]">{act.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
