import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get a Free Cleaning Quote | Fair & Fresh Cleaning",
  description:
    "Request a free, no-obligation cleaning quote from Brisbane's trusted fabric cleaning specialists. Carpet, mattress, rug, upholstery, curtain and flood damage restoration.",
};

export default function QuoteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
