import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Reviews } from "@/components/reviews";
import { AboutPreview } from "@/components/about-preview";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <AboutPreview />
      <Reviews />
      <CtaSection />
      <Footer />
    </main>
  );
}
