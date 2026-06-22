import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
  title: "Professional Carpet Cleaning Brisbane | Fair & Fresh",
  description: "Brisbane's top-rated carpet cleaning service. We provide deep steam cleaning, stain removal, and odor elimination using eco-friendly solutions. Get a free quote today!",
  keywords: ["carpet cleaning Brisbane", "steam cleaning", "stain removal", "professional carpet care", "Fair and Fresh"],
};

export default function CarpetCleaningPage() {
  return (
    <ServiceTemplate
      badge="Professional Carpet Care"
      title="Brisbane's Best Carpet Cleaning Services"
      description="Revitalize your home with our deep steam cleaning technology. We eliminate stubborn dirt, deep-set stains, and allergens from all carpet types, delivering a fresh, healthy environment for your family."
      heroImage="/professional-carpet-cleaning-service-in-modern-hom.jpg"
      heroImageAlt="Professional Carpet Steam Cleaning in Brisbane"
      stats={[
        { label: "Happy Clients", value: 2500, suffix: "+" },
        { label: "Years Experience", value: 15, suffix: "+" },
        { label: "Rating", value: 4.9 },
      ]}
      benefitsTitle="Why Choose Our Carpet Cleaning?"
      benefitsDescription="Professional results that extend the life of your carpets and improve your indoor air quality."
      benefits={[
        {
          iconName: "Sparkles",
          title: "Deep Steam Extraction",
          description: "Our commercial-grade equipment penetrates deep into carpet fibers to extract hidden dirt and grime.",
        },
        {
          iconName: "Shield",
          title: "Advanced Stain Removal",
          description: "Targeted spot treatments using eco-friendly solutions to eliminate tough stains safely.",
        },
        {
          iconName: "Clock",
          title: "Fast-Drying Technology",
          description: "Our efficient extraction process means you can walk on your carpets much sooner.",
        },
        {
          iconName: "Award",
          title: "Allergen & Odor Control",
          description: "Removes dust mites, pet dander, and neutralizes odors at their source for a fresher home.",
        },
      ]}
      galleryTitle="Our Cleaning Results"
      galleryDescription="See the remarkable difference our professional carpet cleaning makes."
      galleryImages={[
        { url: "/carpet-cleaning/photo1.jpg", alt: "Modern living room carpet clean" },
        { url: "/carpet-cleaning/photo2.jpg", alt: "Deep steam cleaning process" },
        { url: "/carpet-cleaning/photo3.jpg", alt: "Freshly cleaned bedroom carpet" },
        { url: "/carpet-cleaning/photo4.jpg", alt: "Carpet stain removal result" },
      ]}
      processTitle="Our 4-Step Cleaning Process"
      processDescription="A proven, systematic approach to ensure spotless, revitalized carpets every time."
      processSteps={[
        {
          step: "01",
          title: "Thorough Pre-Inspection",
          description: "We carefully assess your carpet's fabric type, condition, and identify high-traffic areas or specific stains.",
        },
        {
          step: "02",
          title: "Pre-Treatment",
          description: "We apply specialized, eco-friendly conditioning solutions to loosen deep-down dirt and break down spots.",
        },
        {
          step: "03",
          title: "Hot Water Extraction",
          description: "Our powerful steam cleaning process flushes out dirt, allergens, and cleaning residue, leaving carpets clean.",
        },
        {
          step: "04",
          title: "Final Grooming & Inspection",
          description: "We set the carpet pile for rapid drying and walk through with you to ensure 100% satisfaction.",
        },
      ]}
      typesTitle="Types of Carpets We Masterfully Clean"
      types={[
        "Wool Blends & Pure Wool Carpets",
        "Synthetic & Nylon Carpets",
        "Berber & Loop Pile Carpets",
        "Frieze (Shag) Carpets",
        "Plush & Cut Pile Carpets",
        "Commercial & Office Broadlooms",
        "High-Traffic Hallways & Stairs",
        "Area Rugs positioned on Carpets",
      ]}
      faqs={[
        {
          question: "How long does the carpet cleaning process take?",
          answer: "Most residential carpet cleaning jobs take between 2 to 4 hours, depending on the number of rooms, the size of the area, and the level of soiling. We always provide a clear time estimate when you book.",
        },
        {
          question: "How long until we can walk on the carpets?",
          answer: "Thanks to our strong extraction process, carpets are typically dry within 4-6 hours. You can walk on them immediately with clean socks or bare feet, but it's best to minimize traffic until fully dry.",
        },
        {
          question: "Are your cleaning solutions safe for pets and children?",
          answer: "Absolutely. We pride ourselves on using eco-friendly, biodegradable, and non-toxic cleaning products that are 100% safe for your entire family, including pets and babies.",
        },
        {
          question: "Can you guarantee the removal of all stains?",
          answer: "While we use advanced techniques and have a very high success rate with tough stains (like wine, coffee, and pet accidents), some substances permanently alter the carpet dye. We will set honest expectations during our pre-inspection.",
        },
      ]}
      ctaTitle="Experience Brisbane's Best Carpet Care"
      ctaDescription="Don't wait—restore the beauty and hygiene of your carpets today. Contact us for a free, no-obligation quote."
    />
  );
}
