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
import { motion } from "framer-motion";

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

// Convert 24-hour number to 12-hour AM/PM string
const to12Hour = (hour: number): string => {
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:00 ${period}`;
};

// Generate 1-hour time slots from working hours (12-hour format)
function generateTimeSlots(start: string, end: string): string[] {
  const startHour = parseInt(start.split(':')[0]);
  const endHour = parseInt(end.split(':')[0]);
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push(`${to12Hour(h)} - ${to12Hour(h + 1)}`);
  }
  return slots;
}

// Controlled Date + Time picker (restored original logic + availability features)
function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  closedDates = [],
  unavailableSlots = [],
  workingStart = '07:00',
  workingEnd = '19:00',
}: {
  date?: string | null;
  time?: string | null;
  onDateChange: (d: Date | undefined) => void;
  onTimeChange: (t: string) => void;
  closedDates?: string[];
  unavailableSlots?: { date: string; startTime: string | null }[];
  workingStart?: string;
  workingEnd?: string;
}) {
  const [open, setOpen] = useState(false);

  // Generate time slots from working hours
  const allSlots = generateTimeSlots(workingStart, workingEnd);

  // Build a local Date object from YYYY-MM-DD to avoid timezone/UTC shifts.
  const parsedDate: Date | undefined = date
    ? (() => {
      const parts = date.split("-");
      if (parts.length !== 3) return undefined;
      const y = Number(parts[0]);
      const m = Number(parts[1]) - 1;
      const d = Number(parts[2]);
      return new Date(y, m, d); // local midnight for that date
    })()
    : undefined;

  // Check if a date is closed
  const isDateClosed = (dateStr: string): boolean => {
    return closedDates.includes(dateStr);
  };

  // RESTORED original handleSelect logic — this is what works in production
  const handleSelect = (d?: Date) => {
    if (!d) {
      onDateChange(undefined);
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    onDateChange(selected >= today ? selected : today);
    setOpen(false);
  };

  // Parse a 12-hour slot string like "7:00 AM - 8:00 AM" back to start hour (0-23)
  const parseSlotStartHour = (slot: string): number => {
    const startPart = slot.split(' - ')[0];
    const match = startPart.match(/(\d+):00\s*(AM|PM)/i);
    if (!match) return 0;
    let hour = parseInt(match[1]);
    const period = match[2].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour;
  };

  // Get Brisbane time info for filtering past slots
  const getBrisbaneTime = () => {
    const now = new Date();
    const dateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Australia/Brisbane',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now); // Returns "2026-07-29"
    const hour = parseInt(
      new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Brisbane',
        hour: 'numeric',
        hour12: false,
      }).format(now)
    );
    return { dateStr, hour };
  };

  // Filter available slots for the selected date
  const getAvailableSlots = (): string[] => {
    if (!date) return allSlots;
    
    // Build list of admin-blocked slots
    const blockedSlots = unavailableSlots
      .filter((s) => s.date === date && s.startTime)
      .map((s) => {
        const hour = parseInt(s.startTime!.split(':')[0]);
        return `${to12Hour(hour)} - ${to12Hour(hour + 1)}`;
      });
    
    // Filter out both blocked slots AND past slots when it's today
    const brisbane = getBrisbaneTime();
    const isToday = date === brisbane.dateStr;
    
    return allSlots.filter((slot) => {
      // Remove admin-blocked slots
      if (blockedSlots.includes(slot)) return false;
      // For today, remove slots that have already passed (Brisbane time)
      if (isToday && parseSlotStartHour(slot) < brisbane.hour) return false;
      return true;
    });
  };

  const availableSlots = getAvailableSlots();
  const dateStr = date || '';
  const isSelectedDateClosed = isDateClosed(dateStr);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1 min-w-0">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className={`w-full mt-2 justify-between font-normal h-12 ${isSelectedDateClosed ? 'border-red-300 text-red-500' : ''}`}
            >
              {isSelectedDateClosed ? 'Company Closed' : parsedDate ? parsedDate.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <UIDateCalendar
              mode="single"
              selected={parsedDate}
              captionLayout="dropdown"
              endMonth={new Date(2029, 0)}
              startMonth={new Date(2025, 0)}
              disabled={(date) => {
                const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const dateStr = `${y}-${m}-${day}`;
                return d < today || isDateClosed(dateStr);
              }}
              onSelect={(d: Date | undefined) => handleSelect(d)}
            />
          </PopoverContent>
        </Popover>
        {isSelectedDateClosed && (
          <p className="text-xs text-red-500 mt-1">This date is not available — the company is closed.</p>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        {date && !isSelectedDateClosed ? (
          <div className="relative">
            <select
              id="time-picker"
              value={time || ''}
              onChange={(e) => onTimeChange(e.target.value)}
              className="w-full mt-2 px-3 py-3 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 appearance-none"
            >
              <option value="">Select a time slot</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none mt-1" />
            {availableSlots.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">No available time slots for this date.</p>
            )}
          </div>
        ) : (
          <div className="w-full mt-2 px-3 py-3 text-sm border border-border rounded-lg bg-muted/30 h-12 flex items-center text-muted-foreground">
            {!date ? 'Select a date first' : 'Company closed this day'}
          </div>
        )}
      </div>
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

    // Fetch services
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const mapped = data.results.map((srv: any) => ({
            id: srv.id,
            name: srv.name,
            icon: getIcon(srv.slug),
          }));
          setActiveServices(mapped);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch quote services:", err);
      });

    // Fetch closed dates & unavailable slots
    fetch("/api/availability")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const closed = data.results
            .filter((item: any) => item.type === 'closed_date' && item.date)
            .map((item: any) => item.date);
          const unavail = data.results
            .filter((item: any) => item.type === 'unavailable_slot' && item.date)
            .map((item: any) => ({ date: item.date, startTime: item.startTime }));
          setClosedDates(closed);
          setUnavailableSlots(unavail);
        }
      })
      .catch(() => {});

    // Fetch working hours from site content
    fetch("/api/site-content?group=site_settings")
      .then((res) => res.json())
      .then((data) => {
        if (active && data && Array.isArray(data.results)) {
          const start = data.results.find((s: any) => s.key === 'working_hours_start');
          const end = data.results.find((s: any) => s.key === 'working_hours_end');
          if (start) setWorkingStart(start.value);
          if (end) setWorkingEnd(end.value);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);
  const [formData, setFormData] = useState({
    services: [] as string[],
    date: "",
    time: "10:30:00",
    name: "",
    phone: "",
    email: "",
    street: "",
    city: "",
    additional_notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (formData.services.length === 0) newErrors.services = "Please select at least one service";
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time";
    }

    if (step === 2) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.street) {
        newErrors.street = "Street address is required";
      }
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    try {
      const payload = {
        services: formData.services,
        preferred_date: formData.date || null,
        preferred_time: formData.time || null,
        name: formData.name || null,
        phone: formData.phone,
        email: formData.email || null,
        street: formData.street || null,
        city: formData.city || null,
        additional_notes: formData.additional_notes || "No additional notes",
      };

      const res = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Form submitted:", formData);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const firstErrKey = Object.keys(errorData)[0];
        const errorMsg = firstErrKey && Array.isArray(errorData[firstErrKey])
          ? errorData[firstErrKey][0]
          : "Submit failed";
        
        console.error("Insert error:", errorData);
        setErrors((prev) => ({ ...prev, submit: errorMsg }));
        toast.error(`Error submitting quote request: ${errorMsg}`);
        return;
      }

      const data = await res.json();
      console.log("Inserted:", data);

      toast.success("Your quote request has been submitted! Our team will contact you soon.");
      localStorage.setItem("quoteSubmission", JSON.stringify(formData));
      router.push("/thank-you");
    } catch (err) {
      console.error("Unexpected error:", err);
      setErrors((prev) => ({ ...prev, submit: "Unexpected error. Try again." }));
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const toggleService = (serviceId: string) => {
    const newServices = formData.services.includes(serviceId)
      ? formData.services.filter((id) => id !== serviceId)
      : [...formData.services, serviceId];

    setFormData({ ...formData, services: newServices });
    if (errors.services) {
      setErrors({ ...errors, services: "" });
    }
  };

  // Helper to create YYYY-MM-DD from a Date in local time (avoid toISOString timezone shift)
  const dateToLocalIso = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            {/* Animated Promo Banner */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex justify-center mb-8 px-2"
            >
              <div className="relative group w-full max-w-fit mx-auto">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-md group-hover:opacity-50 transition-opacity duration-500"></div>
                <motion.div
                  className="relative flex items-center justify-center gap-2 sm:gap-3 bg-card px-4 sm:px-6 py-3 rounded-full border-2 border-primary/20 shadow-lg"
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-primary fill-primary/20 shrink-0" />
                  </motion.div>
                  <p className="text-xs sm:text-base md:text-lg font-medium text-foreground">
                    Get <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent text-sm sm:text-lg md:text-xl">20% OFF</span> on same day booking!
                  </p>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent shrink-0" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get Your Free Quote with Fair and Fresh Cleaning
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you with a customized quote
            </p>
          </div>

          <div className="flex items-center justify-center mb-12">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-lg transition-all duration-300 ${currentStep >= step
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-background border-border text-muted-foreground"
                    }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 transition-all duration-300 ${currentStep > step ? "bg-primary" : "bg-border"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Form Container */}
          <div className="bg-card border-2 border-border rounded-lg p-8 md:p-12 shadow-lg">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-slide-in">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">
                      1
                    </span>
                    Select Your Services
                  </h2>
                  <p className="text-muted-foreground mb-6">Choose one or more cleaning services you need</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:scale-105 relative ${formData.services.includes(service.id)
                          ? "border-accent bg-accent/10"
                          : "border-border hover:border-accent/50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{service.icon}</span>
                          <span className="font-semibold text-foreground">{service.name}</span>
                        </div>
                        {formData.services.includes(service.id) && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {errors.services && <p className="text-destructive text-sm mt-2">{errors.services}</p>}

                  {formData.services.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      {formData.services.length} service{formData.services.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-foreground font-semibold mb-2 block">
                      {/* Preferred Date & Time */}
                    </Label>
                    <DateTimePicker
                      date={formData.date || undefined}
                      time={formData.time || undefined}
                      onDateChange={(d) => {
                        // RESTORED original parent callback — works in production
                        if (!d) return updateFormData("date", "");
                        updateFormData("date", dateToLocalIso(d));
                      }}
                      onTimeChange={(t) => updateFormData("time", t)}
                      closedDates={closedDates}
                      unavailableSlots={unavailableSlots}
                      workingStart={workingStart}
                      workingEnd={workingEnd}
                    />
                    {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
                    {errors.time && <p className="text-destructive text-sm mt-1">{errors.time}</p>}
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <Label htmlFor="notes" className="text-foreground font-semibold mb-2 block">
                        Additional Notes (optional)
                      </Label>
                      <Input
                        id="notes"
                        placeholder="E.g. parking instructions or access info"
                        className="h-12"
                        value={formData.additional_notes}
                        onChange={(e) => updateFormData("additional_notes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button
                    asChild
                    variant="outline"
                    className="px-6 h-12 text-lg font-semibold bg-transparent"
                  >
                    <Link href="tel:0430799567">
                      <Phone className="mr-2 h-5 w-5" /> Quick Call Quote
                    </Link>
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-lg font-semibold"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-slide-in">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm">
                      2
                    </span>
                    Your Contact Details
                  </h2>
                  <p className="text-muted-foreground mb-6">Help us reach you with your quote</p>

                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-foreground font-semibold mb-2 block">
                        Your Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="John Doe"
                        className="h-12"
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="phone" className="text-foreground font-semibold mb-2 block">
                          Phone Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          placeholder="0430 799 567"
                          className="h-12"
                        />
                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          placeholder="john@example.com"
                          className="h-12"
                        />
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="street" className="text-foreground font-semibold mb-2 block">
                        Street Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="street"
                        type="text"
                        value={formData.street}
                        onChange={(e) => updateFormData("street", e.target.value)}
                        placeholder="123 Main Street"
                        className="h-12"
                      />
                      {errors.street && <p className="text-destructive text-sm mt-1">{errors.street}</p>}
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-foreground font-semibold mb-2 block">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Brisbane"
                        className="h-12"
                      />
                      {errors.city && <p className="text-destructive text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <Button
                    onClick={handleBack}
                    variant="outline"
                    className="px-8 h-12 text-lg font-semibold bg-transparent"
                  >
                    <ArrowLeft className="mr-2 h-5 w-5" /> Back
                  </Button>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="px-6 h-12 text-lg font-semibold bg-transparent"
                    >
                      <Link href="tel:0430799567">
                        <Phone className="mr-2 h-5 w-5" /> Quick Call Quote
                      </Link>
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-lg font-semibold"
                    >
                      Submit Quote Request
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Need Help Section */}
          <div className="mt-8 text-center text-muted-foreground">
            <p>
              Need immediate assistance?{" "}
              <Link href="tel:0430799567" className="text-accent font-semibold hover:underline">
                Call us at 0430 799 567
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
