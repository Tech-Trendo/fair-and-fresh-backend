import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Mattress Cleaning Brisbane | Dust Mite and Stain Removal | Fair & Fresh",
    description:
        "Sleep cleaner and breathe better with Fair and Fresh Cleaning's professional mattress cleaning in Brisbane. We remove dust mites, allergens, stains, and odours from all mattress types using UV sanitisation and hot-water extraction.",
    keywords: [
        "mattress cleaning Brisbane",
        "mattress steam cleaning Brisbane",
        "dust mite removal Brisbane",
        "mattress sanitisation Brisbane",
        "mattress stain removal Brisbane",
        "professional mattress cleaning",
        "Fair and Fresh Cleaning",
    ],
};

export default function MattressCleaningPage() {
    return (
        <ServiceTemplate
            badge="Allergen-Free Sleep Guaranteed"
            title="Professional Mattress Cleaning in Brisbane"
            description="You spend a third of your life on your mattress, yet most people never have it professionally cleaned. Over time, mattresses accumulate millions of dust mites, dead skin cells, sweat, body oils, and allergens. Our deep mattress cleaning service removes all of it so you can sleep healthier, breathe easier, and wake up refreshed."
            heroImage="/mattress-deep-cleaning-service.jpg"
            heroImageAlt="Professional mattress deep cleaning service Brisbane"
            stats={[
                { label: "Mattresses Cleaned", value: 2000, suffix: "+" },
                { label: "Allergen Reduction", value: 99, suffix: "%" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Families Trust Us with Their Mattresses"
            benefitsDescription="A clean mattress is not just about comfort. It is about your health. Our specialist mattress cleaning process eliminates the hidden threats living inside your bed."
            benefits={[
                {
                    iconName: "ShieldCheck",
                    title: "99% Allergen Elimination",
                    description:
                        "Our UV-C sanitisation and hot-water extraction process removes up to 99% of dust mites, their waste, mould spores, bacteria, and other allergens that trigger asthma, eczema, and hay fever symptoms.",
                },
                {
                    iconName: "Sparkles",
                    title: "Stain and Odour Removal",
                    description:
                        "We remove stubborn stains from sweat, urine, blood, food and drink using enzyme-based cleaning agents that break down organic matter completely, eliminating both the stain and the underlying odour.",
                },
                {
                    iconName: "Sun",
                    title: "UV-C Sanitisation",
                    description:
                        "Our professional UV-C light treatment kills bacteria, viruses, and mould spores at a microscopic level. This is the same technology used in hospitals and aged care facilities for surface sanitisation.",
                },
                {
                    iconName: "Wind",
                    title: "Fast Drying Time",
                    description:
                        "We use low-moisture cleaning methods combined with high-powered air movers so your mattress is ready to sleep on in as little as 2 to 3 hours after the clean is complete.",
                },
            ]}
            galleryTitle="Mattress Cleaning Results Across Brisbane"
            galleryDescription="Real results from our mattress cleaning and sanitisation jobs in homes across Brisbane."
            galleryImages={[
                { url: "/mattress-cleaning/photo1.jpg", alt: "Mattress deep cleaning and UV sanitisation" },
                { url: "/mattress-cleaning/photo2.jpg", alt: "Urine stain removal from mattress" },
                { url: "/mattress-cleaning/photo3.jpg", alt: "King size mattress hot extraction cleaning" },
                { url: "/mattress-cleaning/photo4.jpg", alt: "Mattress cleaning before and after result" },
            ]}
            processTitle="Our Mattress Deep Cleaning Process"
            processDescription="A thorough, health-focused cleaning process that goes far beyond surface-level cleaning to restore hygiene from the inside out."
            processSteps={[
                {
                    step: "01",
                    title: "Dry Vacuum and Inspection",
                    description:
                        "We begin with a powerful dry vacuum using a HEPA-filter machine to remove loose dust, dead skin cells, and surface debris from all sides of the mattress. We then inspect for stains and problem areas.",
                },
                {
                    step: "02",
                    title: "UV-C Sanitisation",
                    description:
                        "A professional UV-C light wand is passed slowly across the entire mattress surface. This kills dust mites, bacteria, viruses, and mould spores at the source without any chemicals or moisture.",
                },
                {
                    step: "03",
                    title: "Stain Pre-Treatment and Extraction",
                    description:
                        "Visible stains are treated with enzyme-based pre-treatment solutions. We then use low-moisture hot-water extraction to deep clean the mattress fabric, removing dissolved grime, body oils, and residual allergens.",
                },
                {
                    step: "04",
                    title: "Deodorise and Dry",
                    description:
                        "We apply a fabric-safe deodorising agent that neutralises odours at the source. High-powered air movers are used to accelerate drying so your mattress is ready to sleep on the same day.",
                },
            ]}
            typesTitle="Mattress Types and Issues We Treat"
            types={[
                "Single, Double, Queen, and King Mattresses",
                "Memory Foam Mattress Cleaning",
                "Innerspring Mattress Deep Cleaning",
                "Pillow Top Mattress Cleaning",
                "Urine and Sweat Stain Removal",
                "Blood Stain Treatment",
                "Food and Drink Stain Removal",
                "Dust Mite and Allergen Elimination",
                "Mould and Mildew Treatment",
                "Pet Odour Neutralisation",
            ]}
            faqs={[
                {
                    question: "How often should a mattress be professionally cleaned?",
                    answer:
                        "We recommend professional mattress cleaning every 6 to 12 months for most households. Homes with young children, pets, allergy sufferers, or asthma patients benefit from cleaning every 3 to 6 months. Regular cleaning dramatically reduces dust mite populations and improves sleep quality.",
                },
                {
                    question: "Can you remove urine stains and odours from a mattress?",
                    answer:
                        "Yes. This is one of our most common requests, particularly for families with young children or pets. We use enzyme-based pre-treatment solutions that break down the uric acid crystals responsible for both the stain and the persistent odour. Results are excellent when treatment is applied promptly.",
                },
                {
                    question: "Is the cleaning safe for children and people with allergies?",
                    answer:
                        "Absolutely. All products we use are non-toxic, eco-friendly, and free from harsh chemicals. Our UV-C sanitisation step requires no chemicals at all. The cleaning process is specifically beneficial for allergy and asthma sufferers as it removes the allergens that trigger their symptoms.",
                },
                {
                    question: "How long does a mattress take to dry after cleaning?",
                    answer:
                        "Most mattresses are dry within 2 to 4 hours after our low-moisture cleaning process. We use high-powered air movers on-site to accelerate drying. We recommend keeping the bedroom well-ventilated after the clean to help with airflow.",
                },
                {
                    question: "Do you clean mattresses on-site or take them away?",
                    answer:
                        "We clean all mattresses on-site in your home. There is no need to move or transport your mattress. Our technicians bring all equipment required and complete the full clean, including drying, at your property.",
                },
            ]}
            ctaTitle="Sleep Cleaner Starting Tonight"
            ctaDescription="Book Brisbane's trusted mattress cleaning specialists and eliminate the dust mites, allergens, and stains hiding in your bed. Same-day results, every time."
        />
    );
}