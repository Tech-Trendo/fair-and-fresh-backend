'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens, getAccessToken } from '@/lib/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (getAccessToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.status === 200) {
        setTokens(data.access, data.refresh);
        router.push('/dashboard');
      } else {
        setError(data.detail || 'Invalid username or password');
      }
    } catch (err) {
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f5] p-6 font-sans antialiased">
      <div className="w-full max-w-[380px] flex flex-col gap-7 bg-white p-8 rounded-xl border border-zinc-200 shadow-xs relative">
        
        {/* Brand */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-zinc-900">FAF</span>
            <span className="h-4.5 w-[1px] bg-zinc-200"></span>
            <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase">Console</span>
          </div>
          <h1 className="text-lg font-semibold text-zinc-900 mt-2">Log in to dashboard</h1>
          <p className="text-xs text-zinc-500">Enter your credentials to access the admin portal.</p>
        </div>

        {/* ForM */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-zinc-500">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=""
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 outline-hidden transition-all focus:border-zinc-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-zinc-500">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-xs text-zinc-800 placeholder-zinc-400 outline-hidden transition-all focus:border-zinc-400 focus:bg-white"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex h-8.5 w-full items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-zinc-100 mt-2 text-center">
          <Link href="/" className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to home page
          </Link>
        </div>
      </div>
    </div>
  );
}
