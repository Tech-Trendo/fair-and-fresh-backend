import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
  title: "Guarantee Bond Cleaning Brisbane | End of Lease Clean | Fair & Fresh",
  description: "Secure your bond refund with our professional bond cleaning services in Brisbane. We offer a 100% bond back guarantee and a comprehensive end-of-lease checklist.",
  keywords: ["bond cleaning Brisbane", "end of lease cleaning", "exit clean Brisbane", "bond back guarantee", "vacate cleaning", "Fair and Fresh"],
};

export default function BondCleaningPage() {
  return (
    <ServiceTemplate
      badge="Bond Back Guarantee"
      title="Brisbane's Best Bond Cleaning Services"
      description="Moving can be stressful. Let us handle the deep cleaning with our expert bond cleaners. We provide a comprehensive, real estate-approved checklist to ensure you get your full bond back, guaranteed."
      heroImage="/bond-cleaning-hero-image.png"
      heroImageAlt="Professional Bond Cleaning Service"
      stats={[
        { label: "Bonds Returned", value: 1200, suffix: "+" },
        { label: "Cleaners", value: 10, suffix: "+" },
        { label: "Rating", value: 4.9 },
      ]}
      benefitsTitle="Why Trust Our Bond Cleaners?"
      benefitsDescription="Real estate agents have extremely high standards. We know exactly what they look for during the final inspection."
      benefits={[
        {
          iconName: "ShieldCheck",
          title: "100% Bond Back Guarantee",
          description: "If your property manager isn't 100% satisfied with our clean, we'll return within 48 hours to fix it for free.",
        },
        {
          iconName: "Sparkles",
          title: "Full-Service Package",
          description: "We cover everything from ceilings, walls, and floors to internal cupboards, windows, and oven cleaning.",
        },
        {
          iconName: "Clock",
          title: "Reliable & Efficient",
          description: "We work fast to meet your move-out deadlines, ensuring the property is ready for the new tenants on time.",
        },
        {
          iconName: "Home",
          title: "Real Estate Approved",
          description: "Our checklist is designed and updated based on feedback from Brisbane's leading property management agencies.",
        },
      ]}
      galleryTitle="Spotless Move-Out Results"
      galleryDescription="See the high standard of cleanliness we achieve for our end-of-lease clients."
      galleryImages={[
        { url: "/bond-cleaning/photo1.jpg", alt: "Deep cleaned House" },
        { url: "/bond-cleaning/photo2.jpg", alt: "Sparkling Tables and Chairs" },
        { url: "/bond-cleaning/photo3.jpg", alt: "Clean empty living spaces" },
        { url: "/bond-cleaning/photo4.jpg", alt: "Window and track cleaning detail" },
      ]}
      processTitle="Our Bond Cleaning Protocol"
      processDescription="A methodical, top-to-bottom clean designed to pass the most rigorous inspections."
      processSteps={[
        {
          step: "01",
          title: "Detailed Inspection",
          description: "We walk through the property to identify specific areas of concern and customize our checklist to the property type.",
        },
        {
          step: "02",
          title: "Top-to-Bottom Clean",
          description: "Our team starts at the ceilings (cobwebs, fans) and works down to the floors, covering all walls, surfaces, and internal cabinetry.",
        },
        {
          step: "03",
          title: "Kitchen & Bath Focus",
          description: "We spend extra time deep cleaning the oven, rangehood, stovetop, bathroom tiles, grout, and fixtures to remove all grime.",
        },
        {
          step: "04",
          title: "Final Quality Check",
          description: "Before leaving, a supervisor reviews the entire property against our checklist to ensure every corner meets our high standards.",
        },
      ]}
      typesTitle="What's Included in Our Bond Clean"
      types={[
        "Full Oven, Rangehood & Stovetop",
        "Internal Cupboards & Drawers",
        "Window Tracks, Glass & Frames",
        "Skirting Boards & Door Frames",
        "Light Switches, Plugs & Fittings",
        "Bathroom Descaling & Sanitization",
        "Balcony & Garage Sweeping",
        "Wall Spot Cleaning (Full Wash Available)",
      ]}
      faqs={[
        {
          question: "How long does a bond clean take?",
          answer: "A standard 2-3 bedroom apartment usually takes a team of 3 cleaners between 4 to 6 hours. Larger family homes can take a full day depending on the condition.",
        },
        {
          question: "Does your bond clean include carpet steam cleaning?",
          answer: "Our standard bond clean does not include carpet steam cleaning, but we offer a heavily discounted 'Bond & Carpet Bundle' if you book both together, which is required by most lease agreements.",
        },
        {
          question: "Do I need to be present during the clean?",
          answer: "No, you don't need to be there! Most clients leave the keys in a lockbox or meet us to let us in. We'll send you a confirmation message and photos once the job is complete.",
        },
        {
          question: "What if my property manager finds an issue?",
          answer: "Our 100% Bond Back Guarantee covers you. Simply notify us within 7 days of the clean, provide the agent's report, and we will return to the property free of charge to rectify any cleaning-related issues.",
        },
      ]}
      ctaTitle="Get Your Bond Back, Guaranteed"
      ctaDescription="Don't risk your deposit. Book Brisbane's trusted bond cleaning experts today and move out with peace of mind."
    />
  );
}
