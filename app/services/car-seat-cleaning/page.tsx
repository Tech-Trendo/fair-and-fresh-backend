import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
  title: "Car Seat & Interior Cleaning Brisbane | Fair & Fresh",
  description: "Revive your car's interior with our professional car seat and carpet deep cleaning in Brisbane. We remove tough stains, spills, and bad odors.",
  keywords: ["car seat cleaning Brisbane", "car interior detailing", "auto upholstery cleaning", "car smell removal", "Fair and Fresh"],
};

export default function CarSeatCleaningPage() {
  return (
    <ServiceTemplate
      badge="Vehicle Interior Care"
      title="Expert Car Seat & Interior Cleaning Brisbane"
      description="Revive your vehicle's interior back to a showroom feel. We provide thorough deep cleaning for car seats, carpets, and upholstery, permanently removing tough stains, sticky spills, odors, and bacteria."
      heroImage="/car-seat-interior-cleaning-service.jpg"
      heroImageAlt="Professional Car Seat Steam Cleaning"
      stats={[
        { label: "Cars Cleaned", value: 2000, suffix: "+" },
        { label: "Stains Removed", value: 98, suffix: "%" },
        { label: "Rating", value: 4.9 },
      ]}
      benefitsTitle="Why Detail Your Vehicle's Interior?"
      benefitsDescription="Your car seats absorb sweat, spilled drinks, and daily grime faster than your home furniture."
      benefits={[
        {
          iconName: "Car",
          title: "Complete Interior Care",
          description: "We clean fabric seats, leather trims, floor mats, and trunk liners, covering every inch of soft fabric in your vehicle.",
        },
        {
          iconName: "Sparkles",
          title: "Stubborn Stain Removal",
          description: "Engineered to tackle difficult automotive stains like coffee, grease, mud, and milk spills.",
        },
        {
          iconName: "Droplet",
          title: "Deep Odor Elimination",
          description: "Ozone treatments and deep extraction to permanently remove smoke odor and pet smells from your car.",
        },
        {
          iconName: "ShieldCheck",
          title: "Leather Conditioning",
          description: "We gently clean and condition leather car seats to prevent cracking, fading, and UV damage.",
        },
      ]}
      galleryTitle="Showroom Quality Results"
      galleryDescription="Check out these before-and-afters of heavily soiled car interiors."
      galleryImages={[
        { url: "/car-seat-cleaning/photo1.jpg", alt: "Car seat coffee stain removal" },
        { url: "/car-seat-cleaning/photo2.jpg", alt: "Deep cleaning car floor mats" },
        { url: "/car-seat-cleaning/photo3.jpg", alt: "Leather seat conditioning" },
        { url: "/car-seat-cleaning/photo4.jpg", alt: "Fresh auto interior" },
      ]}
      processTitle="Our Comprehensive Auto Interior Process"
      processDescription="We use specialized compact tools designed specifically to reach into tight vehicle spaces."
      processSteps={[
        {
          step: "01",
          title: "Deep Vacuuming",
          description: "We vigorously vacuum all seats, carpets, under the seats, and crevices using high-powered detailing vacuums.",
        },
        {
          step: "02",
          title: "Stain Pre-Treatment",
          description: "We apply heavy-duty, interior-safe automotive stain removers to break down grease, dirt, and sticky spills.",
        },
        {
          step: "03",
          title: "Hot Water Extraction",
          description: "Using our heated upholstery hand-tool, we inject hot water and instantly extract the deeply embedded grime.",
        },
        {
          step: "04",
          title: "Deodorizing & Finish",
          description: "We treat the interior with a neutralizing deodorizer and carefully condition any leather or vinyl trims.",
        },
      ]}
      typesTitle="Vehicle Surfaces We Clean"
      types={[
        "Fabric & Cloth Car Seats",
        "Leather & Vinyl Car Seats",
        "Automotive Carpets & Under-seats",
        "Removable Floor Mats",
        "Trunk & Boot Liners",
        "Fabric Door Panels",
        "Headliners (Gentle Dry Clean)",
        "Child Car Seats & Baby Capsules",
      ]}
      faqs={[
        {
          question: "Do you offer a mobile service to my home or office?",
          answer: "Yes, our car seat and interior cleaning services are fully mobile. We can come to your home or workplace in Brisbane, provided we have access to power and water.",
        },
        {
          question: "How long will my car seats take to dry?",
          answer: "If you leave your windows slightly cracked in a warm area, fabric car seats usually dry completely within 2 to 4 hours after our low-moisture extraction process.",
        },
        {
          question: "Can you remove the smell of spilled milk or vomit?",
          answer: "Yes, biological spills like milk and vomit require specific enzyme injections that break down the proteins causing the odor. We highly recommend calling us immediately before the spill sinks deeper into the seat foam.",
        },
        {
          question: "How long does a full interior extraction take?",
          answer: "A standard 5-seater vehicle usually takes between 1.5 to 2.5 hours, depending on the severity of stains and whether there is excessive pet hair.",
        },
      ]}
      ctaTitle="Drive in Comfort and Cleanliness"
      ctaDescription="Upgrade your daily commute with a pristine, fresh-smelling car interior. Get your free quote today."
    />
  );
}
