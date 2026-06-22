import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Rug Cleaning Brisbane | All Rug Types | Fair & Fresh",
    description:
        "Expert rug cleaning in Brisbane for all rug types including Persian, wool, synthetic, sheepskin, and shaggy rugs. On-site or take-away service available. Colour-safe, fabric-safe, and guaranteed results.",
    keywords: [
        "rug cleaning Brisbane",
        "Persian rug cleaning Brisbane",
        "wool rug cleaning Brisbane",
        "rug steam cleaning Brisbane",
        "area rug cleaning Brisbane",
        "professional rug cleaning",
        "Fair and Fresh Cleaning",
    ],
};

export default function RugCleaningPage() {
    return (
        <ServiceTemplate
            badge="Specialist Rug Cleaning Service"
            title="Professional Rug Cleaning in Brisbane"
            description="Rugs are expensive investments that deserve expert care. Whether you have a hand-knotted Persian, a delicate wool rug, or a modern synthetic area rug, our specialist cleaning process restores colour vibrancy, removes deep-set dirt, and extends the life of your rug without causing any damage."
            heroImage="/professional-rug-cleaning-service.jpg"
            heroImageAlt="Professional rug cleaning service Brisbane"
            stats={[
                { label: "Rugs Cleaned", value: 3000, suffix: "+" },
                { label: "Rug Types", value: 25, suffix: "+" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Homes Choose Us for Rug Cleaning"
            benefitsDescription="Rugs require a more delicate approach than carpets. Our technicians are trained in rug-specific cleaning methods that protect fibres, colours, and backing while delivering a truly deep clean."
            benefits={[
                {
                    iconName: "ShieldCheck",
                    title: "No Colour Bleed Guarantee",
                    description:
                        "Before cleaning any rug, we conduct a colour-fastness test. This ensures we select a cleaning method that is completely safe for the dyes used in your rug, eliminating any risk of colour bleeding or fading.",
                },
                {
                    iconName: "Sparkles",
                    title: "Deep Fibre Cleaning",
                    description:
                        "Rugs trap enormous amounts of dirt, grit, pet hair, and allergens deep in their pile. Our extraction process removes up to three times more embedded soil than regular vacuuming, restoring the rug's texture and appearance.",
                },
                {
                    iconName: "Star",
                    title: "Specialist Fabric Knowledge",
                    description:
                        "From delicate Persian and Turkish hand-knots to modern machine-made rugs, sheepskin, and shaggy styles, we know exactly which cleaning method suits each fabric type to get the best result safely.",
                },
                {
                    iconName: "Wind",
                    title: "Odour and Allergen Removal",
                    description:
                        "Rugs on the floor accumulate pet odours, dust mites, and mould at an accelerated rate. Our deep cleaning and deodorising treatment leaves rugs smelling fresh and eliminates the allergens trapped within the fibres.",
                },
            ]}
            galleryTitle="Rug Cleaning Transformations in Brisbane"
            galleryDescription="Before and after results from our rug cleaning jobs across Brisbane homes and businesses."
            galleryImages={[
                { url: "/rug-cleaning/photo1.jpg", alt: "Rug deep cleaning result" },
                { url: "/rug-cleaning/photo2.jpg", alt: "Rug colour restoration" },
                { url: "/rug-cleaning/photo3.jpg", alt: "Large area rug hot extraction cleaning" },
                { url: "/rug-cleaning/photo4.jpg", alt: "Shaggy rug cleaning Brisbane" },
            ]}
            processTitle="Our Rug Cleaning Process"
            processDescription="A careful and tailored process that matches the cleaning method to the specific rug type for safe, effective, and long-lasting results."
            processSteps={[
                {
                    step: "01",
                    title: "Rug Assessment and Testing",
                    description:
                        "We inspect the rug's fibre type, backing, dye quality, and construction. A colour-fastness test is carried out on a hidden area to confirm the cleaning solution is safe before any work begins.",
                },
                {
                    step: "02",
                    title: "Pre-Vacuum and Soil Removal",
                    description:
                        "A heavy-duty dry vacuum removes loose dirt, grit, pet hair, and surface debris from both sides of the rug. This step prevents dirt from turning into mud during wet cleaning and improves the final result significantly.",
                },
                {
                    step: "03",
                    title: "Deep Cleaning and Stain Treatment",
                    description:
                        "We apply a pH-balanced cleaning solution suited to the rug's fibre type, work it gently into the pile, and use hot-water extraction to flush out embedded grime, allergens, and stains from deep within the fibres.",
                },
                {
                    step: "04",
                    title: "Rinse, Deodorise and Dry",
                    description:
                        "A thorough clean water rinse removes all cleaning solution residue. We then apply a deodoriser and groom the pile back into its natural direction. High-powered air movers are used to dry the rug quickly and evenly.",
                },
            ]}
            typesTitle="Rug Types We Clean in Brisbane"
            types={[
                "Persian and Oriental Hand-Knotted Rugs",
                "Turkish and Afghan Tribal Rugs",
                "Wool Rugs and Kilims",
                "Synthetic and Polypropylene Area Rugs",
                "Shaggy and High-Pile Rugs",
                "Sheepskin and Natural Fibre Rugs",
                "Silk and Blend Rugs",
                "Flatweave and Dhurrie Rugs",
                "Antique and Heirloom Rugs",
                "Commercial and Office Rugs",
            ]}
            faqs={[
                {
                    question: "Can you clean antique or very expensive Persian rugs?",
                    answer:
                        "Yes. We regularly clean antique, hand-knotted, and high-value Persian and Oriental rugs. We apply a colour-fastness test before any cleaning begins, use pH-neutral solutions appropriate for natural wool and silk dyes, and handle the rug with the care it deserves throughout the entire process.",
                },
                {
                    question: "Do you clean rugs on-site or take them away?",
                    answer:
                        "We offer both options. For most rugs we provide a convenient on-site cleaning service at your home or business. For very large rugs, heavily soiled pieces, or delicate antique rugs that require specialist handling, we offer a pick-up, clean, and return service from our professional cleaning facility.",
                },
                {
                    question: "How long does a rug take to dry?",
                    answer:
                        "Drying time depends on the rug's thickness, fibre type, and pile height. Most rugs are ready to use within 3 to 6 hours after cleaning. Thick wool and shaggy rugs may take longer. We always use high-powered air movers to speed up the drying process on-site.",
                },
                {
                    question: "Can you remove pet stains and odours from rugs?",
                    answer:
                        "Yes. Pet urine and odour treatment is one of our most requested rug services. We use enzyme-based solutions specifically designed for organic stains that break down uric acid crystals to remove both the stain and the odour permanently rather than just masking the smell.",
                },
                {
                    question: "How often should rugs be professionally cleaned?",
                    answer:
                        "For most homes, we recommend professional rug cleaning every 12 to 18 months. High-traffic rugs, rugs in homes with pets or children, and rugs in allergy-prone households benefit from cleaning every 6 to 12 months. Regular professional cleaning also extends the life of the rug considerably.",
                },
            ]}
            ctaTitle="Restore Your Rug to Its Former Glory"
            ctaDescription="Book Brisbane's rug cleaning specialists today. Safe, thorough, and tailored to every rug type. Get your free quote now."
        />
    );
}