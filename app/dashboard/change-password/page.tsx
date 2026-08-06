'use client';

import { useState } from 'react';
import { apiFetch, getRefreshToken, clearTokens } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/users/change-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          refresh_token: getRefreshToken(),
        }),
      });
      const data = await res.json();

      if (res.status === 200) {
        setSuccess(data.detail || 'Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        // Force re-login so the new password takes effect immediately.
        setTimeout(() => {
          clearTokens();
          router.push('/login');
        }, 1200);
      } else {
        setError(data.detail || 'Failed to update password.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto font-sans">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-lg font-bold text-[#111827] tracking-tight">Change Password</h1>          <p className="text-xs text-[#4B5563]">
            Update your admin login credentials. This password survives every deployment — it is no
            longer reset when you push code. You will be signed out and need to log in again after
            changing it.
          </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg border border-[#E5E7EB] shadow-xs p-6 flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-500" htmlFor="current-password">
            Current Password
          </label>
          <input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-500" htmlFor="new-password">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-medium text-zinc-500" htmlFor="confirm-password">
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50/50 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[11px] font-medium text-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-9 w-full items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
