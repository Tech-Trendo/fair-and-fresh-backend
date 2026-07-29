'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/auth';
import { toast } from 'sonner';
import { Calendar, Clock, X, Plus, RefreshCw, Ban, CalendarX, AlertCircle } from 'lucide-react';

interface AvailabilityItem {
  id: string;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  type: 'closed_date' | 'unavailable_slot';
  reason: string | null;
}

export default function AvailabilityPage() {
  const [items, setItems] = useState<AvailabilityItem[]>([]);
  const [settings, setSettings] = useState({ workingStart: '07:00', workingEnd: '19:00' });
  const [loading, setLoading] = useState(true);
  const [newClosedDate, setNewClosedDate] = useState('');
  const [newClosedReason, setNewClosedReason] = useState('');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [newSlotReason, setNewSlotReason] = useState('');

  const formatTime12 = (time: string): string => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const period = hour < 12 ? 'AM' : 'PM';
    const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h12}:${m} ${period}`;
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [availRes, settingsRes] = await Promise.all([
        apiFetch('/api/availability'),
        fetch('/api/site-content?group=site_settings'),
      ]);

      const availData = await availRes.json();
      setItems(availData.results || []);

      const settingsData = await settingsRes.json();
      const results = settingsData.results || [];
      const start = results.find((s: any) => s.key === 'working_hours_start');
      const end = results.find((s: any) => s.key === 'working_hours_end');
      setSettings({
        workingStart: start?.value || '07:00',
        workingEnd: end?.value || '19:00',
      });
    } catch (err) {
      toast.error('Failed to load availability data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSaveWorkingHours = async () => {
    try {
      const res = await apiFetch('/api/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: [
            { key: 'working_hours_start', value: settings.workingStart },
            { key: 'working_hours_end', value: settings.workingEnd },
          ],
        }),
      });
      if (res.ok) {
        toast.success('Working hours updated!');
        fetchData();
      } else {
        toast.error('Failed to update working hours');
      }
    } catch (err) {
      toast.error('Failed to update working hours');
    }
  };

  const handleAddClosedDate = async () => {
    if (!newClosedDate) return;
    try {
      const res = await apiFetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newClosedDate,
          type: 'closed_date',
          reason: newClosedReason || null,
        }),
      });
      if (res.ok) {
        toast.success('Closed date added!');
        setNewClosedDate('');
        setNewClosedReason('');
        fetchData();
      } else {
        toast.error('Failed to add closed date');
      }
    } catch (err) {
      toast.error('Failed to add closed date');
    }
  };

  const handleAddUnavailableSlot = async () => {
    if (!newSlotDate || !newSlotStart) return;
    try {
      const res = await apiFetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newSlotDate,
          startTime: newSlotStart,
          endTime: newSlotEnd || null,
          type: 'unavailable_slot',
          reason: newSlotReason || null,
        }),
      });
      if (res.ok) {
        toast.success('Unavailable slot added!');
        setNewSlotDate('');
        setNewSlotStart('');
        setNewSlotEnd('');
        setNewSlotReason('');
        fetchData();
      } else {
        toast.error('Failed to add unavailable slot');
      }
    } catch (err) {
      toast.error('Failed to add unavailable slot');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      const res = await apiFetch(`/api/availability?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const closedDates = items.filter(i => i.type === 'closed_date');
  const unavailableSlots = items.filter(i => i.type === 'unavailable_slot');

  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto font-sans space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">Schedule & Availability</h1>
        <p className="text-xs text-gray-500 mt-1">Manage working hours, closed dates, and unavailable time slots</p>
      </div>

      {/* Working Hours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-gray-900">Working Hours</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">Set your daily operating hours. The quote page will generate 1-hour time slots within this range.</p>
        <div className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
            <input
              type="time"
              value={settings.workingStart}
              onChange={(e) => setSettings({ ...settings, workingStart: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
            <input
              type="time"
              value={settings.workingEnd}
              onChange={(e) => setSettings({ ...settings, workingEnd: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSaveWorkingHours}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-md hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap"
          >
            Save Hours
          </button>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Generated slots: <strong>{settings.workingStart}</strong> to <strong>{settings.workingEnd}</strong> → {(() => {
            const to12Hour = (hour: number): string => {
              const period = hour < 12 ? 'AM' : 'PM';
              const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              return `${h12}:00 ${period}`;
            };
            const start = parseInt(settings.workingStart.split(':')[0]);
            const end = parseInt(settings.workingEnd.split(':')[0]);
            const slots = [];
            for (let h = start; h < end; h++) {
              slots.push(`${to12Hour(h)} - ${to12Hour(h + 1)}`);
            }
            return slots.join(', ');
          })()}
        </div>
      </div>

      {/* Closed Dates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarX className="h-5 w-5 text-red-500" />
          <h2 className="text-sm font-bold text-gray-900">Closed Dates</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">Mark dates when your business is closed (e.g., public holidays). Customers won't be able to select these dates.</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="date"
            value={newClosedDate}
            min={today}
            onChange={(e) => setNewClosedDate(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="text"
            value={newClosedReason}
            onChange={(e) => setNewClosedReason(e.target.value)}
            placeholder="Reason (e.g., Public Holiday)"
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddClosedDate}
            disabled={!newClosedDate}
            className="inline-flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Closed Date
          </button>
        </div>

        {closedDates.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No closed dates set</p>
        ) : (
          <div className="space-y-2">
            {closedDates.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-red-50 border border-red-100 rounded-md px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">{item.date}</span>
                  {item.reason && (
                    <span className="text-xs text-gray-500">— {item.reason}</span>
                  )}
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unavailable Time Slots */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ban className="h-5 w-5 text-amber-500" />
          <h2 className="text-sm font-bold text-gray-900">Unavailable Time Slots</h2>
        </div>
        <p className="text-xs text-gray-500 mb-4">Block specific time slots on specific dates (e.g., already booked). These won't show in the quote page.</p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <input
            type="date"
            value={newSlotDate}
            min={today}
            onChange={(e) => setNewSlotDate(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newSlotStart}
            onChange={(e) => setNewSlotStart(e.target.value)}
            placeholder="Start"
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="time"
            value={newSlotEnd}
            onChange={(e) => setNewSlotEnd(e.target.value)}
            placeholder="End (optional)"
            className="px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddUnavailableSlot}
            disabled={!newSlotDate || !newSlotStart}
            className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 text-white text-xs font-semibold rounded-md hover:bg-amber-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Block Slot
          </button>
        </div>

        {unavailableSlots.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No unavailable slots set</p>
        ) : (
          <div className="space-y-2">
            {unavailableSlots.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-md px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {item.date} — {formatTime12(item.startTime)}{item.endTime ? ` - ${formatTime12(item.endTime)}` : ''}
                  </span>
                  {item.reason && (
                    <span className="text-xs text-gray-500">({item.reason})</span>
                  )}
                </div>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
