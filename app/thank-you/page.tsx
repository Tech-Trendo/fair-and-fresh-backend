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
  { id: "bond-cleaning", name: "Bond Cleaning", icon: "🏠" },
  { id: "carpet-and-rug", name: "Carpet and Rug Cleaning", icon: "🧹" },
  { id: "upholstery-and-car-seats", name: "Upholstery and Car Seat Cleaning", icon: "🛋️" },
  { id: "mattress", name: "Mattress Cleaning", icon: "🛏️" },
  { id: "curtain", name: "Curtain Cleaning", icon: "🪟" },
  { id: "car-detailing", name: "Car Detailing", icon: "🚗" },
  { id: "lawn-mowing", name: "Lawn Mowing", icon: "🌱" },
  { id: "flood-damage", name: "Flood Damage Restoration", icon: "💧" },
];

export default function ThankYouPage() {
  const router = useRouter();
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    const dataStr = localStorage.getItem("quoteSubmission");
    if (!dataStr) {
      router.push("/quote");
      return;
    }
    try {
      const data = JSON.parse(dataStr);

      function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      async function delayedGreeting() {
        setSubmissionData(data);
        await sleep(1000);
        localStorage.removeItem("quoteSubmission");
      }

      delayedGreeting();
      //put delay of 5 seconds
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      router.push("/quote");
    }
  }, [router]);

  if (!submissionData) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6 animate-fade-in bg-card border-2 border-border rounded-lg p-8 md:p-12">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Quote Request Submitted!</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Thank you for choosing Fair & Fresh Cleaning! We&apos;ve received your quote request and will
              get back to you within 2 hours.
            </p>
            <div className="bg-muted border-2 border-border rounded-lg p-6 max-w-md mx-auto text-left">
              <h3 className="font-bold text-foreground mb-4">Your Details:</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  <strong>Services:</strong>{" "}
                  {submissionData.services
                    .map((id: string) => services.find((s) => s.id === id)?.name)
                    .join(", ")}
                </p>
                <p>
                  <strong>Date:</strong> {submissionData.date}
                </p>
                <p>
                  <strong>Time:</strong> {submissionData.time}
                </p>
                <p>
                  <strong>Phone:</strong> {submissionData.phone}
                </p>
                <p>
                  <strong>Email:</strong> {submissionData.email}
                </p>
                <p>
                  <strong>City:</strong> {submissionData.city}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-lg font-semibold"
              >
                <Link href="/">Return to Home</Link>
              </Button>
              <Button asChild variant="outline" className="px-8 h-12 text-lg font-semibold bg-transparent">
                <Link href="tel:0430799567">
                  <Phone className="mr-2 h-5 w-5" /> Call Us Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
