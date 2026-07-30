/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Phone } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const services = [
  { id: "bond-cleaning", name: "Bond Cleaning" },
  { id: "carpet-and-rug", name: "Carpet and Rug Cleaning" },
  { id: "upholstery-and-car-seats", name: "Upholstery and Car Seat Cleaning" },
  { id: "mattress", name: "Mattress Cleaning" },
  { id: "curtain", name: "Curtain Cleaning" },
  { id: "car-detailing", name: "Car Detailing" },
  { id: "lawn-mowing", name: "Lawn Mowing" },
  { id: "flood-damage", name: "Flood Damage Restoration" },
];

export default function ThankYouPage() {
  const router = useRouter();
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    const dataStr = localStorage.getItem("quoteSubmission");
    if (!dataStr) { router.push("/quote"); return; }
    try {
      const data = JSON.parse(dataStr);
      async function delayedGreeting() {
        setSubmissionData(data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        localStorage.removeItem("quoteSubmission");
      }
      delayedGreeting();
    } catch (e) {
      router.push("/quote");
    }
  }, [router]);

  if (!submissionData) return null;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-xl border border-border shadow-sm p-8 md:p-10 text-center space-y-6">
            {/* Green-tint checkmark */}
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent-tint rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-heading-bold text-foreground">Quote Request Submitted!</h2>
            <p className="text-sm text-muted-foreground font-body max-w-sm mx-auto">
              Thank you for choosing us! We&apos;ve received your quote request and will get back to you within 2 hours.
            </p>

            {/* Details card */}
            <div className="bg-background rounded-xl border border-border p-5 text-left">
              <h3 className="font-heading-bold text-foreground text-sm mb-3">Your Details:</h3>
              <div className="space-y-1.5 text-xs text-muted-foreground font-body">
                <p><strong className="text-foreground">Services:</strong> {submissionData.services.map((id: string) => services.find((s) => s.id === id)?.name).join(", ")}</p>
                <p><strong className="text-foreground">Date:</strong> {submissionData.date}</p>
                <p><strong className="text-foreground">Time:</strong> {submissionData.time}</p>
                <p><strong className="text-foreground">Phone:</strong> {submissionData.phone}</p>
                <p><strong className="text-foreground">Email:</strong> {submissionData.email}</p>
                <p><strong className="text-foreground">City:</strong> {submissionData.city}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-nav text-sm px-7">
                <Link href="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground font-nav text-sm px-7 bg-transparent">
                <Link href="tel:0430799567"><Phone className="mr-2 h-4 w-4" /> Call Us Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
