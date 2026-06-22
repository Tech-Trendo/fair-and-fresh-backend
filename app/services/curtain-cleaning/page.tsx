import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Curtain Cleaning Brisbane | On-Site & Off-Site | Fair & Fresh",
    description:
        "Restore your curtains and drapes to like-new condition with Fair and Fresh Cleaning's professional curtain cleaning in Brisbane. On-site steam cleaning or take-down and rehang service available. Eco-safe, colour-safe, and allergy-friendly.",
    keywords: [
        "curtain cleaning Brisbane",
        "drape cleaning Brisbane",
        "on-site curtain cleaning",
        "curtain steam cleaning Brisbane",
        "curtain dry cleaning Brisbane",
        "blind and curtain cleaning",
        "Fair and Fresh Cleaning",
    ],
};

export default function CurtainCleaningPage() {
    return (
        <ServiceTemplate
            badge="On-Site & Take-Down Curtain Cleaning"
            title="Professional Curtain Cleaning in Brisbane"
            description="Curtains are one of the biggest dust and allergen traps in your home. Yet one of the most overlooked. Our professional curtain cleaning service restores colour, freshness, and hygiene to all curtain and drape types, with no shrinkage and no colour fade, guaranteed."
            heroImage="/curtain-cleaning-hero-image.jpg"
            heroImageAlt="Professional curtain cleaning service Brisbane"
            stats={[
                { label: "Curtains Cleaned", value: 5000, suffix: "+" },
                { label: "Fabric Types", value: 20, suffix: "+" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Homes Trust Fair & Fresh for Curtains"
            benefitsDescription="Curtains require specialist care. The wrong method can cause irreversible shrinkage, fading, or damage. Our trained technicians match the perfect cleaning method to every fabric type."
            benefits={[
                {
                    iconName: "ShieldCheck",
                    title: "No Shrinkage Guarantee",
                    description:
                        "We assess your curtain fabric before cleaning and select the safest, most effective method ensuring zero shrinkage, colour bleeding, or damage to delicate linings.",
                },
                {
                    iconName: "Wind",
                    title: "Allergen & Dust Removal",
                    description:
                        "Curtains harbour enormous quantities of dust mites, pollen, mould spores, and pet dander. Our deep cleaning process eliminates these allergens, making your home healthier and easier to breathe in.",
                },
                {
                    iconName: "Home",
                    title: "On-Site Convenience",
                    description:
                        "Our on-site steam cleaning service means your curtains are cleaned and rehung the same day, no need to remove them, wash them, or re-iron them yourself.",
                },
                {
                    iconName: "Sparkles",
                    title: "Colour & Fabric Restoration",
                    description:
                        "Over time, curtains accumulate embedded grime that dulls their colour. Our cleaning process restores vibrancy and texture, making old curtains look and feel fresh again.",
                },
            ]}
            galleryTitle="Curtain Cleaning Results Across Brisbane"
            galleryDescription="See how we restore curtains and drapes to their original freshness in homes across Brisbane."
            galleryImages={[
                { url: "/curtain-cleaning/photo1.jpg", alt: "On-site curtain steam cleaning" },
                { url: "/curtain-cleaning/photo2.jpg", alt: "Sheer curtain cleaning" },
                { url: "/curtain-cleaning/photo3.jpg", alt: "Heavy drape cleaning" },
                { url: "/curtain-cleaning/photo4.jpg", alt: "Curtain cleaning before and after" },
            ]}
            processTitle="Our Curtain Cleaning Process"
            processDescription="A careful, fabric-first approach that delivers a deep clean without risking damage to your curtains or drapes."
            processSteps={[
                {
                    step: "01",
                    title: "Fabric Assessment",
                    description:
                        "Every curtain is different. We inspect fabric composition, lining type, and any existing stains or damage to determine the ideal cleaning method whether steam, injection-extraction, or specialist dry clean.",
                },
                {
                    step: "02",
                    title: "Pre-Treatment",
                    description:
                        "Visible stains, mould spots, and heavy soiling are pre-treated with colour-safe, eco-friendly solutions before the main clean begins to ensure the best possible result.",
                },
                {
                    step: "03",
                    title: "Deep Steam Clean",
                    description:
                        "Using our specialised curtain cleaning equipment, we inject hot cleaning solution deep into the fabric and extract it along with dissolved grime, allergens, and bacteria all without removing the curtains from their tracks.",
                },
                {
                    step: "04",
                    title: "Deodorise & Rehang",
                    description:
                        "We apply a fabric-safe deodoriser to leave your curtains smelling fresh, carry out a final quality inspection, and ensure all curtains are neatly rehanging before we leave.",
                },
            ]}
            typesTitle="Curtain & Drape Types We Clean"
            types={[
                "Sheer & Voile Curtains",
                "Blockout & Lined Curtains",
                "Eyelet & Pinch Pleat Drapes",
                "Velvet & Heavy Fabric Curtains",
                "Lace & Decorative Curtains",
                "Roman & Roller Blinds",
                "Commercial & Office Drapes",
                "Floor-to-Ceiling Statement Curtains",
                "Mould & Mildew Affected Curtains",
                "Curtains with Pet Hair & Odour",
            ]}
            faqs={[
                {
                    question: "Do you clean curtains on-site or do they need to be taken down?",
                    answer:
                        "We specialise in on-site curtain cleaning, which means your curtains stay on their tracks throughout the entire process and are ready to use the same day. For heavily soiled or delicate fabrics that require specialist off-site treatment, we also offer a take-down, clean, and rehang service.",
                },
                {
                    question: "Will my curtains shrink or lose their colour?",
                    answer:
                        "No, this is our core promise. We assess each fabric before selecting a cleaning method. Delicate sheers, lined drapes, and vintage fabrics receive a low-moisture or dry-clean approach specifically to eliminate any risk of shrinkage or colour loss.",
                },
                {
                    question: "How often should curtains be professionally cleaned?",
                    answer:
                        "We recommend having curtains professionally cleaned every 12 to 18 months for general households. Homes with pets, allergy sufferers, smokers, or high humidity (such as near bathrooms or kitchens) benefit from more frequent cleaning every 6 to 12 months.",
                },
                {
                    question: "Can you remove mould from curtains?",
                    answer:
                        "Yes. Mould is a common issue in Brisbane's humid climate, especially on curtains in bathrooms, laundries, or poorly ventilated rooms. We use anti-fungal pre-treatment agents that kill mould spores and remove staining, and we provide advice on preventing regrowth.",
                },
                {
                    question: "Do you clean curtains in commercial properties?",
                    answer:
                        "Absolutely. We regularly service office buildings, hotels, restaurants, aged care facilities, and retail spaces across Brisbane. We can schedule cleaning outside business hours to minimise disruption.",
                },
            ]}
            ctaTitle="Fresh, Clean Curtains, Without the Hassle"
            ctaDescription="Book Brisbane's curtain cleaning specialists today. On-site service, same-day results, and zero risk of damage to your curtains."
        />
    );
}