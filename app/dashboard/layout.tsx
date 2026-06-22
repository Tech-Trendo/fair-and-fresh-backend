'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAccessToken, clearTokens } from '@/lib/auth';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      setAuthenticated(true);
    }
  }, [router, pathname]);

  const handleLogout = () => {
    clearTokens();
    router.push('/login');
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="flex flex-col items-center gap-3">
          <svg className="h-6 w-6 animate-spin text-zinc-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z' },
    { name: 'Categories', href: '/dashboard/categories', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Services', href: '/dashboard/services', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z' },
    { name: 'Blogs', href: '/dashboard/blogs', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { name: 'Pages SEO', href: '/dashboard/pages', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' }
  ];

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#111827] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#E5E7EB] bg-white flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="flex h-14 items-center gap-2.5 px-6 border-b border-[#E5E7EB]">
            <span className="font-bold text-sm tracking-tight text-[#111827]">Fair & Fresh Console</span>
          </div>

          {/* Navigation Links */}
          <nav className="mt-4 px-3 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F3F4F6] text-[#111827] font-semibold border-l-2 border-[#2563EB]'
                      : 'text-[#4B5563] hover:bg-[#F9FAFB] hover:text-[#111827]'
                  }`}
                >
                  <svg
                    className={`h-4.5 w-4.5 ${isActive ? 'text-[#2563EB]' : 'text-[#9CA3AF]'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.75"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                  </svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer/Logout */}
        <div className="p-3 border-t border-[#E5E7EB]">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-[#4B5563] hover:bg-[#FEF2F2] hover:text-[#DC2626] transition-colors cursor-pointer"
          >
            <svg
              className="h-4.5 w-4.5 text-[#9CA3AF] group-hover:text-[#DC2626]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex h-14 items-center justify-between px-6 border-b border-[#E5E7EB] bg-white">
          <h2 className="text-xs font-semibold text-[#111827]">
            {navLinks.find((l) => l.href === pathname)?.name || 'Admin'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#4B5563] bg-[#F3F4F6] px-2.5 py-1 rounded border border-[#E5E7EB] font-medium">
              PostgreSQL / Drizzle
            </span>
          </div>
        </header>

        {/* Page children container */}
        <div className="flex-grow p-6 overflow-y-auto bg-[#F9FAFB]">
          {children}
        </div>
      </main>
    </div>
  );
}
