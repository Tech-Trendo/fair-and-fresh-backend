import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Professional Cleaning Services",
  description: "Professional cleaning services for your home and office",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-CDD5ZL527E" />
        <GoogleTagManager gtmId="GTM-NXLBM7W4" />
      </body>
    </html>
  );
}
