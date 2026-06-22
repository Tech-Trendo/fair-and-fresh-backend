import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Upholstery Cleaning Brisbane | Sofa and Couch Cleaning | Fair & Fresh",
    description:
        "Revive your furniture with Fair and Fresh Cleaning's professional upholstery cleaning in Brisbane. We clean sofas, couches, armchairs, dining chairs, and all fabric furniture using safe, effective hot-water extraction. Stain removal, odour treatment, and fabric protection included.",
    keywords: [
        "upholstery cleaning Brisbane",
        "sofa cleaning Brisbane",
        "couch cleaning Brisbane",
        "lounge cleaning Brisbane",
        "fabric furniture cleaning Brisbane",
        "upholstery steam cleaning Brisbane",
        "Fair and Fresh Cleaning",
    ],
};

export default function UpholsteryCleaningPage() {
    return (
        <ServiceTemplate
            badge="Sofa, Couch and Furniture Cleaning"
            title="Professional Upholstery Cleaning in Brisbane"
            description="Your sofa and furniture see daily use from family, kids, and pets, and over time they absorb body oils, dust, allergens, food spills, and odours deep into the fabric. Our professional upholstery cleaning service restores freshness, hygiene, and appearance to all types of fabric and leather furniture, right in your own home."
            heroImage="/upholstery-cleaning-hero-image.jpg"
            heroImageAlt="Professional sofa and upholstery cleaning service Brisbane"
            stats={[
                { label: "Pieces Cleaned", value: 4000, suffix: "+" },
                { label: "Fabric Types", value: 30, suffix: "+" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Homes Trust Fair and Fresh for Upholstery"
            benefitsDescription="From budget sofas to designer couches and antique armchairs, our technicians have the knowledge, tools, and care to clean every piece of upholstered furniture safely and effectively."
            benefits={[
                {
                    iconName: "ShieldCheck",
                    title: "Safe for All Fabric Types",
                    description:
                        "We test every fabric before cleaning to determine the right method and solution. Whether your sofa is polyester, velvet, linen, microfibre, or chenille, we will choose a safe approach that cleans deeply without causing shrinkage or damage.",
                },
                {
                    iconName: "Sparkles",
                    title: "Stain Removal Specialists",
                    description:
                        "Red wine, coffee, ink, food, pet accidents, and grease stains are all treated individually with targeted pre-treatment solutions before extraction. We achieve outstanding stain removal results on most common upholstery fabrics.",
                },
                {
                    iconName: "Wind",
                    title: "Odour Elimination",
                    description:
                        "Body odour, pet smells, cigarette smoke, and food odours build up inside upholstery fibres over time. Our professional deodorising treatment neutralises these odours at the source rather than covering them with fragrance.",
                },
                {
                    iconName: "Star",
                    title: "Fabric Protection Available",
                    description:
                        "After cleaning, we can apply a premium fabric protector that creates an invisible barrier against future spills and stains. This keeps your furniture cleaner for longer and makes day-to-day maintenance much easier.",
                },
            ]}
            galleryTitle="Upholstery Cleaning Results Across Brisbane"
            galleryDescription="See real before and after results from our sofa and furniture cleaning jobs across Brisbane."
            galleryImages={[
                { url: "/upholstery-cleaning/photo1.jpg", alt: "Sofa deep cleaning Brisbane" },
                { url: "/upholstery-cleaning/photo2.jpg", alt: "Three-seater couch stain removal" },
                { url: "/upholstery-cleaning/photo3.jpg", alt: "Fabric armchair cleaning" },
                { url: "/upholstery-cleaning/photo4.jpg", alt: "Pet stain removal from lounge suite" },
            ]}
            processTitle="Our Upholstery Cleaning Process"
            processDescription="A thorough, fabric-safe process that removes deep-set grime, stains, and odours from all types of upholstered furniture."
            processSteps={[
                {
                    step: "01",
                    title: "Fabric Test and Assessment",
                    description:
                        "We check the manufacturer's cleaning code and perform a colour-fastness and absorbency test on a hidden area of the furniture. This tells us exactly which cleaning method and products are safe to use on your specific upholstery.",
                },
                {
                    step: "02",
                    title: "Pre-Vacuum and Pre-Treatment",
                    description:
                        "We vacuum all surfaces to remove loose dirt, crumbs, pet hair, and debris. Stains are then individually pre-treated with the appropriate cleaning agent to break them down before the main extraction begins.",
                },
                {
                    step: "03",
                    title: "Hot-Water Extraction",
                    description:
                        "Using upholstery-specific attachments on our extraction machines, we inject hot cleaning solution into the fabric and immediately extract it along with dissolved soil, allergens, and bacteria. This process cleans deep into the cushion fill and back panels.",
                },
                {
                    step: "04",
                    title: "Rinse, Deodorise and Dry",
                    description:
                        "A clean water rinse removes all product residue to prevent resoiling. We apply a deodoriser, groom the fabric pile, and use air movers to speed up drying. Most furniture is dry and usable within 2 to 4 hours.",
                },
            ]}
            typesTitle="Upholstery and Furniture We Clean"
            types={[
                "2, 3, and 4-Seater Sofas and Couches",
                "Modular and L-Shaped Lounges",
                "Armchairs and Recliners",
                "Dining Chairs and Bench Seats",
                "Ottoman and Footstools",
                "Leather Sofa Cleaning and Conditioning",
                "Velvet and Delicate Fabric Couches",
                "Microfibre and Suede Upholstery",
                "Office and Commercial Seating",
                "Headboards and Fabric Bed Frames",
            ]}
            faqs={[
                {
                    question: "How long does upholstery cleaning take?",
                    answer:
                        "A standard two or three-seater sofa typically takes 45 to 90 minutes to clean thoroughly. A full lounge suite with multiple pieces may take 2 to 3 hours. Drying time is usually an additional 2 to 4 hours depending on the fabric thickness and ventilation in the room.",
                },
                {
                    question: "Will upholstery cleaning shrink or damage my fabric?",
                    answer:
                        "No, not when done properly. We always test the fabric before cleaning and select the method that is safe for your specific material. We use low-moisture techniques on sensitive fabrics and avoid over-wetting, which is the primary cause of shrinkage or distortion in DIY cleaning attempts.",
                },
                {
                    question: "Can you clean a leather sofa?",
                    answer:
                        "Yes. Leather cleaning and conditioning is a specialised service we offer. We use pH-balanced leather-safe cleaners to remove grime and body oils, followed by a conditioning treatment that replenishes moisture and protects the leather from cracking and UV damage.",
                },
                {
                    question: "Can you remove old or set-in stains?",
                    answer:
                        "Many old and set-in stains can be significantly improved or fully removed with our targeted pre-treatment approach. Success depends on the stain type, the fabric, and how long the stain has been there. We will always give you an honest assessment of what to expect before we begin.",
                },
                {
                    question: "Do you offer fabric protection after cleaning?",
                    answer:
                        "Yes. We offer a professional fabric protector application after every upholstery clean. It creates an invisible barrier that causes spills to bead on the surface rather than soaking in, giving you more time to blot them up before they become stains. It is particularly popular for homes with children and pets.",
                },
            ]}
            ctaTitle="Bring Your Furniture Back to Life"
            ctaDescription="Book Brisbane's upholstery cleaning specialists today. Fresh, clean, and dry furniture the same day. Get your free quote now."
        />
    );
}