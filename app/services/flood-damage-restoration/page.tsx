import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Emergency Flood Damage Restoration Brisbane | 24/7 | Fair & Fresh",
    description:
        "Flood damage in Brisbane? Fair and Fresh Cleaning provides 24/7 emergency water damage restoration including water extraction, drying, mould prevention, and full carpet and furniture restoration. Fast response, fair pricing.",
    keywords: [
        "flood damage restoration Brisbane",
        "water damage restoration Brisbane",
        "emergency flood cleanup Brisbane",
        "wet carpet drying Brisbane",
        "water extraction Brisbane",
        "mould prevention after flood",
        "Fair and Fresh Cleaning",
    ],
};

export default function FloodDamageRestorationPage() {
    return (
        <ServiceTemplate
            badge="24/7 Emergency Response"
            title="Fast Flood Damage Restoration in Brisbane"
            description="When water strikes, every minute counts. Our emergency flood restoration team arrives fast, extracts standing water with industrial equipment, and begins the drying and restoration process immediately to save your carpets, furniture, and property from permanent damage."
            heroImage="/flood-damage-restoration-water-extraction-emergenc.jpg"
            heroImageAlt="Emergency flood damage restoration service Brisbane"
            stats={[
                { label: "Avg Response", value: 60, suffix: "min" },
                { label: "Properties Restored", value: 300, suffix: "+" },
                { label: "Rating", value: 5.0 },
            ]}
            benefitsTitle="Why Brisbane Trusts Fair and Fresh for Flood Restoration"
            benefitsDescription="Water damage gets worse by the hour. Our certified restoration technicians are equipped and ready to respond across Brisbane any time of the day or night."
            benefits={[
                {
                    iconName: "Zap",
                    title: "24/7 Emergency Response",
                    description:
                        "Floods do not wait for business hours. Our emergency line is open 24 hours a day, 7 days a week. We aim to be on-site within 60 minutes of your call anywhere across Brisbane.",
                },
                {
                    iconName: "Droplets",
                    title: "Industrial Water Extraction",
                    description:
                        "We use truck-mounted and portable extraction units capable of removing hundreds of litres of standing water quickly, preventing further saturation of floors, walls, and subflooring.",
                },
                {
                    iconName: "ShieldCheck",
                    title: "Mould Prevention Treatment",
                    description:
                        "After extraction, we apply professional anti-microbial treatments to all affected surfaces. This kills mould spores before they can take hold and protects your family's health.",
                },
                {
                    iconName: "Home",
                    title: "Full Property Restoration",
                    description:
                        "From soaked carpets and wet mattresses to water-damaged furniture and rugs, we restore as much as possible on-site so you can get back to normal life faster.",
                },
            ]}
            galleryTitle="Flood Restoration Results Across Brisbane"
            galleryDescription="Real restoration jobs completed by our emergency response team across Brisbane and surrounding suburbs."
            galleryImages={[
                { url: "/flood-damage-restoration/photo1.jpg", alt: "Flood damage restoration Brisbane" },
                { url: "/flood-damage-restoration/photo2.jpg", alt: "Flood damage restoration Brisbane" },
                { url: "/flood-damage-restoration/photo3.jpg", alt: "Flooding damage after restoration" },
                { url: "/flood-damage-restoration/photo4.jpg", alt: "Property after water damage" },
            ]}
            processTitle="Our Flood Restoration Process"
            processDescription="A fast, structured, and thorough approach designed to minimise damage, prevent mould, and restore your property as completely as possible."
            processSteps={[
                {
                    step: "01",
                    title: "Emergency Arrival and Assessment",
                    description:
                        "Our team arrives on-site and immediately assesses the source and extent of the water damage. We identify all affected materials including carpets, underlay, flooring, walls, and furniture before work begins.",
                },
                {
                    step: "02",
                    title: "Water Extraction",
                    description:
                        "Using industrial-grade wet vacuums and submersible pumps, we remove all standing water from the property as quickly as possible. Speed at this stage is critical to preventing permanent structural damage.",
                },
                {
                    step: "03",
                    title: "Drying and Dehumidification",
                    description:
                        "We deploy high-capacity air movers and commercial dehumidifiers throughout the affected areas. Moisture meters are used to monitor progress and confirm that materials reach safe dryness levels before equipment is removed.",
                },
                {
                    step: "04",
                    title: "Sanitise, Restore and Report",
                    description:
                        "All affected surfaces are sanitised with anti-microbial solution. Carpets, rugs, upholstery, and other salvageable items are professionally cleaned and restored. We provide a full damage and restoration report for insurance purposes.",
                },
            ]}
            typesTitle="What We Restore After Flood Damage"
            types={[
                "Flood-Damaged Carpets and Underlay",
                "Water-Damaged Timber and Hard Floors",
                "Soaked Rugs and Mats",
                "Wet Mattresses and Bedding",
                "Water-Damaged Upholstery and Sofas",
                "Damp Curtains and Drapes",
                "Flooded Basements and Garages",
                "Wet Walls and Skirting Boards",
                "Mould-Affected Surfaces",
                "Storm and Burst Pipe Damage",
            ]}
            faqs={[
                {
                    question: "How quickly can you respond to flood damage in Brisbane?",
                    answer:
                        "We aim to be on-site within 60 minutes for emergency calls anywhere across Brisbane and the surrounding suburbs. The faster we arrive, the more we can save. Please call our emergency line immediately rather than waiting to fill in a form online.",
                },
                {
                    question: "Can all flood-damaged carpets and furniture be saved?",
                    answer:
                        "Many items can be fully restored if we respond quickly. Carpets that have been wet for less than 24 to 48 hours can usually be dried and cleaned successfully. Items left wet for longer may develop irreversible mould or structural damage. Early intervention is key.",
                },
                {
                    question: "Do you work with home insurance companies?",
                    answer:
                        "Yes. We provide a detailed damage assessment report and full documentation of the restoration work carried out, which most insurance providers require for claims. We are experienced with the insurance process and can assist you in understanding what is covered.",
                },
                {
                    question: "How do you prevent mould after flood damage?",
                    answer:
                        "We apply hospital-grade anti-microbial treatments to all affected surfaces during the restoration process. Combined with thorough drying using commercial dehumidifiers and air movers, this prevents mould spores from taking hold. We also use moisture meters to confirm safe dryness levels before we leave.",
                },
                {
                    question: "What causes the most damage during a flood event?",
                    answer:
                        "Time is the biggest factor. The longer water sits in contact with carpets, underlay, timber floors, and walls, the deeper it penetrates and the harder it is to restore. Mould can begin growing within 24 to 48 hours in Brisbane's humid climate. Calling us immediately gives you the best chance of a full recovery.",
                },
            ]}
            ctaTitle="Flood Damage? Call Us Right Now"
            ctaDescription="Our emergency restoration team is standing by 24/7. The sooner we arrive, the more we can save. Do not wait."
        />
    );
}