"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as UIDateCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon, Phone, ArrowRight, ArrowLeft, Check, Sparkles, Tag } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const fetchAllServices = async (): Promise<any[]> => {
  const all: any[] = [];
  let url: string | null = "/api/services?page_size=100";
  while (url) {
    const res: Response = await fetch(url);
    const data: { results?: any[]; next?: string | null } = await res.json();
    if (data && Array.isArray(data.results)) all.push(...data.results);
    url = data.next || null;
  }
  return all;
};

const getIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes("bond")) return "🏠";
  if (s.includes("carpet") || s.includes("rug")) return "🧹";
  if (s.includes("upholstery") || s.includes("seat") || s.includes("sofa")) return "🛋️";
  if (s.includes("mattress")) return "🛏️";
  if (s.includes("curtain")) return "🪟";
  if (s.includes("detail") || s.includes("car")) return "🚗";
  if (s.includes("lawn") || s.includes("mow") || s.includes("garden")) return "🌱";
  if (s.includes("flood") || s.includes("water") || s.includes("restoration")) return "💧";
  return "✨";
};

const initialServices = [
  { id: "bond-cleaning", name: "Bond Cleaning", icon: "🏠" },
  { id: "carpet-and-rug", name: "Carpet and Rug Cleaning", icon: "🧹" },
  { id: "upholstery-and-car-seats", name: "Upholstery and Car Seat Cleaning", icon: "🛋️" },
  { id: "mattress", name: "Mattress Cleaning", icon: "🛏️" },
  { id: "curtain", name: "Curtain Cleaning", icon: "🪟" },
  { id: "car-detailing", name: "Car Detailing", icon: "🚗" },
  { id: "lawn-mowing", name: "Lawn Mowing", icon: "🌱" },
  { id: "flood-damage", name: "Flood Damage Restoration", icon: "💧" },
];

const to12Hour = (hour: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:00 ${period}`;
};

function generateTimeSlots(start: string, end: string): string[] {
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${to12Hour(h)} - ${to12Hour(h + 1)}`);
  }
  return slots;
}

function DateTimePicker({
  date, time, onDateChange, onTimeChange, closedDates = [], unavailableSlots = [], workingStart = '07:00', workingEnd = '19:00',
}: {
  date?: string | null; time?: string | null; onDateChange: (d: Date | undefined) => void; onTimeChange: (t: string) => void;
  closedDates?: string[]; unavailableSlots?: { date: string; startTime: string | null }[]; workingStart?: string; workingEnd?: string;
}) {
  const [open, setOpen] = useState(false);
  const allSlots = generateTimeSlots(workingStart, workingEnd);

  const parsedDate: Date | undefined = date
    ? (() => { const parts = date.split("-"); if (parts.length !== 3) return undefined; return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); })()
    : undefined;

  const isDateClosed = (dateStr: string): boolean => closedDates.includes(dateStr);

  const handleSelect = (d?: Date) => {
    if (!d) { onDateChange(undefined); return; }
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const selected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    onDateChange(selected >= today ? selected : today);
    setOpen(false);
  };

  const parseSlotStartHour = (slot: string): number => {
    const startPart = slot.split(' - ')[0];
    const match = startPart.match(/(\d+):00\s*(AM|PM)/i);
    if (!match) return 0;
    let hour = parseInt(match[1]);
    if (match[2].toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (match[2].toUpperCase() === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  const getBrisbaneTime = () => {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Brisbane', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const hour = parseInt(new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', hour: 'numeric', hour12: false }).format(now));
    return { dateStr, hour };
  };

  const getAvailableSlots = (): string[] => {
    if (!date) return allSlots;
    const blockedSlots = unavailableSlots.filter((s) => s.date === date && s.startTime).map((s) => { const h = parseInt(s.startTime!.split(':')[0]); return `${to12Hour(h)} - ${to12Hour(h + 1)}`; });
    const brisbane = getBrisbaneTime();
    const isToday = date === brisbane.dateStr;
    return allSlots.filter((slot) => {
      if (blockedSlots.includes(slot)) return false;
      if (isToday && parseSlotStartHour(slot) < brisbane.hour) return false;
      return true;
    });
  };

  const availableSlots = getAvailableSlots();
  const dateStr = date || '';
  const isSelectedDateClosed = isDateClosed(dateStr);

return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <Label htmlFor="date-picker" className="text-xs font-heading text-foreground">Date</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" id="date-picker" className={`w-full mt-1.5 justify-between font-body text-sm h-11 rounded-lg border-border bg-white shadow-sm hover:shadow-md hover:!bg-white hover:!text-foreground transition-shadow ${isSelectedDateClosed ? 'text-destructive' : ''}`}>
                {isSelectedDateClosed ? 'Company Closed' : parsedDate ? parsedDate.toLocaleDateString() : "Select date"}
                <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <UIDateCalendar mode="single" selected={parsedDate} captionLayout="dropdown" endMonth={new Date(2029, 0)} startMonth={new Date(2025, 0)}
                disabled={(date) => { const d = new Date(date.getFullYear(), date.getMonth(), date.getDate()); const today = new Date(); today.setHours(0, 0, 0, 0); const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); return d < today || isDateClosed(`${y}-${m}-${day}`); }}
                onSelect={(d: Date | undefined) => handleSelect(d)}
              />
            </PopoverContent>
          </Popover>
          {isSelectedDateClosed && <p className="text-xs text-destructive font-body mt-1">This date is not available.</p>}
        </div>
      </div>
      {date && !isSelectedDateClosed && (
        <div>
          <Label className="text-xs font-heading text-foreground">Time</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-1.5">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onTimeChange(slot)}
                className={`px-3 py-2 text-xs font-body rounded-lg border transition-all ${time === slot ? "bg-primary text-primary-foreground border-primary shadow-sm" : "border-border bg-white hover:border-primary/50 hover:bg-primary/[0.03]"}`}
              >
                {slot}
              </button>
            ))}
          </div>
          {availableSlots.length === 0 && <p className="text-xs text-amber-500 font-body mt-2">No available time slots for this date.</p>}
        </div>
      )}
      {!date && (
        <div>
          <Label className="text-xs font-heading text-foreground">Time</Label>
          <div className="w-full mt-1.5 px-3 py-2.5 text-sm border border-border rounded-lg bg-white shadow-sm h-11 flex items-center text-muted-foreground font-body">
            Select a date first
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuotePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeServices, setActiveServices] = useState(initialServices);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [unavailableSlots, setUnavailableSlots] = useState<{ date: string; startTime: string | null }[]>([]);
  const [workingStart, setWorkingStart] = useState('07:00');
  const [workingEnd, setWorkingEnd] = useState('19:00');

  useEffect(() => {
    let active = true;
    fetchAllServices().then((list) => { if (active && list.length > 0) setActiveServices(list.map((srv: any) => ({ id: srv.id, name: srv.name, icon: getIcon(srv.slug) }))); }).catch(() => {});
    fetch("/api/availability").then((res) => res.json()).then((data) => { if (active && data && Array.isArray(data.results)) { setClosedDates(data.results.filter((i: any) => i.type === 'closed_date' && i.date).map((i: any) => i.date)); setUnavailableSlots(data.results.filter((i: any) => i.type === 'unavailable_slot' && i.date).map((i: any) => ({ date: i.date, startTime: i.startTime }))); } }).catch(() => {});
    fetch("/api/site-content?group=site_settings").then((res) => res.json()).then((data) => { if (active && data && Array.isArray(data.results)) { const start = data.results.find((s: any) => s.key === 'working_hours_start'); const end = data.results.find((s: any) => s.key === 'working_hours_end'); if (start) setWorkingStart(start.value); if (end) setWorkingEnd(end.value); } }).catch(() => {});
    return () => { active = false; };
  }, []);

  const [formData, setFormData] = useState({ services: [] as string[], date: "", time: "10:30:00", name: "", phone: "", email: "", street: "", city: "", additional_notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) { if (formData.services.length === 0) newErrors.services = "Please select at least one service"; if (!formData.date) newErrors.date = "Please select a date"; if (!formData.time) newErrors.time = "Please select a time"; }
    if (step === 2) { if (!formData.name) newErrors.name = "Name is required"; if (!formData.phone) newErrors.phone = "Phone number is required"; if (!formData.email) newErrors.email = "Email is required"; if (!formData.city) newErrors.city = "City is required"; if (!formData.street) newErrors.street = "Street address is required"; if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email"; }
    setErrors(newErrors); return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(currentStep + 1); };
  const handleBack = () => { setCurrentStep(currentStep - 1); setErrors({}); };

  const dateToLocalIso = (d: Date) => { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, "0"); const day = String(d.getDate()).padStart(2, "0"); return `${y}-${m}-${day}`; };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    try {
      const payload = { services: formData.services, preferred_date: formData.date || null, preferred_time: formData.time || null, name: formData.name || null, phone: formData.phone, email: formData.email || null, street: formData.street || null, city: formData.city || null, additional_notes: formData.additional_notes || "No additional notes" };
      const res = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const errorData = await res.json().catch(() => ({})); const firstErrKey = Object.keys(errorData)[0]; const errorMsg = firstErrKey && Array.isArray(errorData[firstErrKey]) ? errorData[firstErrKey][0] : "Submit failed"; setErrors((prev) => ({ ...prev, submit: errorMsg })); toast.error(`Error: ${errorMsg}`); return; }
      toast.success("Your quote request has been submitted!");
      localStorage.setItem("quoteSubmission", JSON.stringify(formData));
      router.push("/thank-you");
    } catch (err) { setErrors((prev) => ({ ...prev, submit: "Unexpected error. Try again." })); }
  };

  const updateFormData = (field: string, value: string) => { setFormData({ ...formData, [field]: value }); if (errors[field]) setErrors({ ...errors, [field]: "" }); };
  const toggleService = (serviceId: string) => { const newServices = formData.services.includes(serviceId) ? formData.services.filter((id) => id !== serviceId) : [...formData.services, serviceId]; setFormData({ ...formData, services: newServices }); if (errors.services) setErrors({ ...errors, services: "" }); };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block bg-accent-tint text-primary text-xs font-nav px-4 py-1.5 rounded-full mb-4 shadow-sm">
              <Tag className="w-3 h-3 inline mr-1" /> Get 20% OFF on same day booking!
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading-bold text-foreground mb-3">Get Your Free Quote</h1>
            <p className="text-base text-muted-foreground font-body">Fill out the form below and we&apos;ll get back to you with a customized quote</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-10">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-2">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-heading-bold text-sm transition-all ${currentStep >= step ? "bg-red-600 border-red-600 text-primary-foreground shadow-sm shadow-red-600/20" : "bg-white border-border text-muted-foreground"}`}>{step}</div>
                  <span className="text-[10px] font-nav text-muted-foreground hidden sm:block">{step === 1 ? "Services" : "Contact Details"}</span>
                </div>
                {step < 2 && <div className={`w-12 md:w-20 h-0.5 mx-2 mt-[-1.5rem] transition-all ${currentStep > step ? "bg-red-600" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-border shadow-md p-8 md:p-10">
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-heading-bold text-foreground mb-5">Select Your Services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeServices.map((service) => (
                      <button key={service.id} onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all relative hover:shadow-md hover:-translate-y-0.5 ${formData.services.includes(service.id) ? "border-red-600 bg-red-600/5 shadow-sm shadow-red-600/10" : "border-border hover:border-red-600/50 bg-white hover:bg-red-600/[0.02]"}`}>
                        <div className="flex items-center gap-4"><span className="text-2xl">{service.icon}</span><span className="text-sm font-heading text-foreground">{service.name}</span></div>
                        {formData.services.includes(service.id) && <div className="absolute top-2 right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center shadow-sm"><Check className="w-3 h-3 text-white" /></div>}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-destructive text-sm font-body mt-2">{errors.services}</p>}
                  {formData.services.length > 0 && <p className="text-sm text-muted-foreground font-body mt-3">{formData.services.length} service{formData.services.length > 1 ? "s" : ""} selected</p>}
                </div>

                <DateTimePicker date={formData.date || undefined} time={formData.time || undefined}
                  onDateChange={(d) => { if (!d) return updateFormData("date", ""); updateFormData("date", dateToLocalIso(d)); }}
                  onTimeChange={(t) => updateFormData("time", t)} closedDates={closedDates} unavailableSlots={unavailableSlots} workingStart={workingStart} workingEnd={workingEnd} />
                {errors.date && <p className="text-destructive text-sm font-body">{errors.date}</p>}
                {errors.time && <p className="text-destructive text-sm font-body">{errors.time}</p>}

                <div>
                  <Label htmlFor="notes" className="text-xs font-heading text-foreground">Additional Notes (optional)</Label>
                  <Input id="notes" placeholder="E.g. parking instructions or access info" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" value={formData.additional_notes} onChange={(e) => updateFormData("additional_notes", e.target.value)} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <Button asChild variant="outline" className="rounded-full border-border font-nav text-sm"><Link href="tel:0430799567"><Phone className="mr-2 h-4 w-4" /> Quick Call Quote</Link></Button>
                  <Button onClick={handleNext} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-sm px-7 shadow-md hover:shadow-lg transition-shadow">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <h2 className="text-xl font-heading-bold text-foreground mb-5">Your Contact Details</h2>
                <div className="space-y-5">
                  <div><Label htmlFor="name" className="text-xs font-heading text-foreground">Your Name <span className="text-destructive">*</span></Label><Input id="name" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} placeholder="John Doe" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" />{errors.name && <p className="text-destructive text-sm font-body mt-1">{errors.name}</p>}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><Label htmlFor="phone" className="text-xs font-heading text-foreground">Phone Number <span className="text-destructive">*</span></Label><Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateFormData("phone", e.target.value)} placeholder="0430 799 567" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" />{errors.phone && <p className="text-destructive text-sm font-body mt-1">{errors.phone}</p>}</div>
                    <div><Label htmlFor="email" className="text-xs font-heading text-foreground">Email Address <span className="text-destructive">*</span></Label><Input id="email" type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} placeholder="john@example.com" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" />{errors.email && <p className="text-destructive text-sm font-body mt-1">{errors.email}</p>}</div>
                  </div>
                  <div><Label htmlFor="street" className="text-xs font-heading text-foreground">Street Address <span className="text-destructive">*</span></Label><Input id="street" value={formData.street} onChange={(e) => updateFormData("street", e.target.value)} placeholder="123 Main Street" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" />{errors.street && <p className="text-destructive text-sm font-body mt-1">{errors.street}</p>}</div>
                  <div><Label htmlFor="city" className="text-xs font-heading text-foreground">City <span className="text-destructive">*</span></Label><Input id="city" value={formData.city} onChange={(e) => updateFormData("city", e.target.value)} placeholder="Brisbane" className="mt-1.5 h-11 rounded-lg border-border font-body text-sm" />{errors.city && <p className="text-destructive text-sm font-body mt-1">{errors.city}</p>}</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
<Button onClick={handleBack} variant="outline" className="rounded-full border-border font-nav text-sm text-muted-foreground hover:text-foreground hover:bg-white/50 shadow-none"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                      <div className="flex flex-col sm:flex-row gap-3">
<Button asChild className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground font-nav text-sm px-5 shadow-md"><Link href="tel:0430799567"><Phone className="mr-2 h-4 w-4" /> Quick Call Quote</Link></Button>
                        <Button onClick={handleSubmit} className="rounded-full bg-red-600 hover:bg-red-700 text-primary-foreground font-nav text-sm px-7 shadow-md hover:shadow-lg transition-shadow">Submit Quote Request</Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Need Help */}
          <div className="mt-6 text-center text-sm text-muted-foreground font-body">
            Need immediate assistance? <Link href="tel:0430799567" className="text-red-600 font-heading hover:underline">Call us at 0430 799 567</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
