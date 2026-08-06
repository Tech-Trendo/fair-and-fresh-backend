import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fabric & Carpet Cleaning in Brisbane | Fair & Fresh Cleaning",
  description:
    "Professional fabric, carpet, mattress, rug, upholstery and curtain cleaning in Brisbane. Same-day service across Brisbane suburbs, Gold Coast and Sunshine Coast. Get a free quote today.",
};

export default function BrisbaneLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
