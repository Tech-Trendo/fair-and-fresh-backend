import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Car Seat & Interior Cleaning Brisbane | Fair & Fresh",
    description:
        "Revive your car's interior with Fair and Fresh Cleaning's professional car seat and upholstery cleaning in Brisbane. Stain removal, odour elimination, and fabric protection, guaranteed results.",
    keywords: [
        "car seat cleaning Brisbane",
        "car interior cleaning Brisbane",
        "car upholstery cleaning",
        "car detailing Brisbane",
        "auto upholstery cleaning",
        "car seat stain removal Brisbane",
        "Fair and Fresh Cleaning",
    ],
};

export default function CarSeatCleaningPage() {
    return (
        <ServiceTemplate
            badge="Professional Car Interior Cleaning"
            title="Brisbane's #1 Car Seat & Interior Cleaning Specialists"
            description="Your car's interior deserves the same care as your home. Our certified technicians use industrial hot-water extraction and eco-safe solutions to remove deep-set stains, allergens, and odours from car seats, carpets, and all interior surfaces, leaving your vehicle looking and smelling brand new."
            heroImage="/car-detailing-hero-image.jpg"
            heroImageAlt="Professional car seat and interior cleaning service Brisbane"
            stats={[
                { label: "Cars Cleaned", value: 800, suffix: "+" },
                { label: "Stains Removed", value: 99, suffix: "%" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Drivers Choose Fair & Fresh"
            benefitsDescription="From daily commuters to luxury car owners, we restore every vehicle interior to its finest with the products, equipment, and expertise to prove it."
            benefits={[
                {
                    iconName: "ShieldCheck",
                    title: "Satisfaction Guaranteed",
                    description:
                        "Not happy with the result? We'll return and re-clean the affected areas at absolutely no extra cost. Your satisfaction is our promise.",
                },
                {
                    iconName: "Droplets",
                    title: "Hot-Water Extraction",
                    description:
                        "Our professional-grade steam and hot-water extraction machines penetrate deep into fabric fibres to lift grime, bacteria, and allergens that surface cleaning simply cannot reach.",
                },
                {
                    iconName: "Wind",
                    title: "Odour Elimination",
                    description:
                        "We don't just mask odours, we neutralise them at the source using professional deodorising agents that eliminate pet smells, cigarette smoke, food odours, and mildew.",
                },
                {
                    iconName: "Sparkles",
                    title: "Fabric Protection Treatment",
                    description:
                        "After cleaning, we apply a premium fabric protector that repels future spills and stains, keeping your car seats cleaner for longer between services.",
                },
            ]}
            galleryTitle="Interior Transformations That Speak for Themselves"
            galleryDescription="Browse real before-and-after results from our Brisbane car interior cleaning jobs."
            galleryImages={[
                { url: "/car-seat-cleaning/photo1.jpg", alt: "Car seat deep cleaning result" },
                { url: "/car-seat-cleaning/photo2.jpg", alt: "Stain removal from fabric car seats" },
                { url: "/car-seat-cleaning/photo3.jpg", alt: "Car carpet steam cleaning" },
                { url: "/car-seat-cleaning/photo4.jpg", alt: "Leather seat conditioning and cleaning" },
            ]}
            processTitle="Our Car Interior Cleaning Process"
            processDescription="A thorough, systematic approach that covers every surface of your vehicle's interior, no shortcuts, no missed spots."
            processSteps={[
                {
                    step: "01",
                    title: "Pre-Inspection & Vacuum",
                    description:
                        "We begin with a full interior inspection to identify stains, problem areas, and material types. A powerful dry vacuum removes all loose dirt, crumbs, and debris before wet cleaning begins.",
                },
                {
                    step: "02",
                    title: "Stain Pre-Treatment",
                    description:
                        "Stubborn stains from food, drink, pet accidents, or grime are individually pre-treated with targeted cleaning solutions to break down the stain before extraction.",
                },
                {
                    step: "03",
                    title: "Hot-Water Extraction",
                    description:
                        "Our truck-mounted or portable hot-water extraction machines deep clean all fabric and carpet surfaces at high temperature, flushing out embedded dirt and leaving fibres fresh and residue-free.",
                },
                {
                    step: "04",
                    title: "Dry, Protect & Inspect",
                    description:
                        "We accelerate drying with high-powered air movers, apply a fabric protector, clean all hard surfaces (dash, console, door panels), and do a final walkthrough to ensure a flawless result.",
                },
            ]}
            typesTitle="What's Included in Our Car Interior Clean"
            types={[
                "Fabric & Cloth Car Seat Cleaning",
                "Leather Seat Cleaning & Conditioning",
                "Car Carpet Steam Cleaning",
                "Boot / Trunk Deep Cleaning",
                "Headliner & Roof Lining Spot Clean",
                "Door Card & Panel Wipe-Down",
                "Dashboard & Console Detailing",
                "Odour Neutralisation Treatment",
                "Pet Hair Removal",
                "Fabric Protection Application",
            ]}
            faqs={[
                {
                    question: "How long does a car seat and interior clean take?",
                    answer:
                        "A standard interior clean for a small-to-medium car typically takes between 1.5 to 2.5 hours. Larger vehicles such as SUVs, 4WDs, and vans may take 3 to 4 hours depending on the level of soiling and the number of seats.",
                },
                {
                    question: "How long does it take for the seats and carpet to dry?",
                    answer:
                        "Most fabric interiors are dry within 2 to 4 hours after cleaning. We use powerful air movers on-site to significantly reduce drying time. We recommend leaving windows slightly open while the car dries to promote airflow.",
                },
                {
                    question: "Can you remove pet hair and pet odours from car seats?",
                    answer:
                        "Yes, absolutely. Pet hair and odour removal is one of our most requested services. We use specialised pet-hair removal tools before extraction, and our professional-grade deodorising treatment neutralises pet odours at the source rather than simply masking them.",
                },
                {
                    question: "Do you clean leather car seats?",
                    answer:
                        "Yes, we clean and condition leather and faux-leather seats using pH-balanced leather-safe products. Our conditioning treatment restores suppleness and protects against cracking and UV damage, ideal for Brisbane's harsh sun.",
                },
                {
                    question: "Do you come to my location, or do I bring my car to you?",
                    answer:
                        "We offer a convenient mobile service and come directly to your home, workplace, or any location across Brisbane. All we need is access to your vehicle and a nearby power outlet.",
                },
            ]}
            ctaTitle="Transform Your Car Interior Today"
            ctaDescription="Book Brisbane's most trusted car seat and interior cleaning service. Fast, thorough, and guaranteed to impress."
        />
    );
}