import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/service-template";

export const metadata: Metadata = {
    title: "Professional Lawn Mowing Brisbane | Regular Garden Maintenance | Fair & Fresh",
    description:
        "Keep your lawn neat and healthy with Fair and Fresh Cleaning's professional lawn mowing and garden maintenance services in Brisbane. Reliable, affordable, and available 7 days a week.",
    keywords: [
        "lawn mowing Brisbane",
        "lawn care Brisbane",
        "garden maintenance Brisbane",
        "lawn mowing service near me",
        "grass cutting Brisbane",
        "regular lawn mowing Brisbane",
        "Fair and Fresh Cleaning",
    ],
};

export default function LawnMowingPage() {
    return (
        <ServiceTemplate
            badge="Reliable Lawn and Garden Care"
            title="Professional Lawn Mowing and Garden Maintenance in Brisbane"
            description="A well-kept lawn makes a great impression and adds real value to your property. Our professional lawn mowing team delivers a neat, even, and healthy result every single visit, with flexible scheduling to suit your lifestyle and block size."
            heroImage="/lawn-mowing-hero-image.jpg"
            heroImageAlt="Professional lawn mowing service Brisbane"
            stats={[
                { label: "Lawns Serviced", value: 1500, suffix: "+" },
                { label: "Suburbs Covered", value: 50, suffix: "+" },
                { label: "Rating", value: 4.9 },
            ]}
            benefitsTitle="Why Brisbane Homeowners Choose Fair and Fresh for Lawn Care"
            benefitsDescription="We treat every lawn as if it were our own. From compact unit courtyards to large family backyards, our team shows up on time with the right equipment and leaves your property looking its best."
            benefits={[
                {
                    iconName: "CalendarCheck",
                    title: "Flexible Scheduling",
                    description:
                        "Choose fortnightly, monthly, or one-off mowing to suit your needs and budget. We work 7 days a week and will always send you a reminder before your scheduled visit.",
                },
                {
                    iconName: "Sparkles",
                    title: "Clean, Neat Finish Every Time",
                    description:
                        "We use professional-grade mowers, whipper snippers, and blowers to deliver a clean edge along all paths, garden beds, and fences, leaving your property looking sharp and tidy.",
                },
                {
                    iconName: "Leaf",
                    title: "Lawn Health Focus",
                    description:
                        "Our technicians adjust mowing height based on the grass type and season. Cutting at the right height promotes healthy root growth, reduces weeds, and keeps your lawn green and lush.",
                },
                {
                    iconName: "ShieldCheck",
                    title: "Fully Insured and Reliable",
                    description:
                        "All of our lawn technicians are fully insured and background-checked. We never cancel last minute, and if anything unexpected comes up, we will always call ahead and reschedule promptly.",
                },
            ]}
            galleryTitle="Lawns We Have Transformed Across Brisbane"
            galleryDescription="From overgrown blocks to regular maintenance jobs, see the quality of our lawn mowing work across Brisbane."
            galleryImages={[
                { url: "/lawn-mowing/photo1.jpg", alt: "Freshly mowed residential lawn Brisbane" },
                { url: "/lawn-mowing/photo2.jpg", alt: "Lawn edging and finishing work" },
                { url: "/lawn-mowing/photo3.jpg", alt: "Large backyard lawn mowing result" },
                { url: "/lawn-mowing/photo4.jpg", alt: "Garden cleanup and green waste removal" },
            ]}
            processTitle="How Our Lawn Mowing Service Works"
            processDescription="Simple, professional, and hassle-free lawn care from booking to cleanup."
            processSteps={[
                {
                    step: "01",
                    title: "Book Online or Call",
                    description:
                        "Get an instant quote online or call us directly. Tell us your block size, grass type, and how often you need the service. We will confirm your booking the same day.",
                },
                {
                    step: "02",
                    title: "We Arrive on Time",
                    description:
                        "Our team arrives at your property with all equipment required. No need to be home as long as we have access to the yard. We bring our own water and power where needed.",
                },
                {
                    step: "03",
                    title: "Mow, Edge and Blow",
                    description:
                        "We mow the full lawn area at the correct height, edge along all paths, driveways, and garden beds with a whipper snipper, then blow all clippings off hard surfaces for a clean finish.",
                },
                {
                    step: "04",
                    title: "Clipping Removal and Sign-Off",
                    description:
                        "Grass clippings are either mulched back into the lawn for nutrients or collected and removed, depending on your preference. We do a final walkthrough and send you a completion photo.",
                },
            ]}
            typesTitle="What Is Included in Our Lawn Service"
            types={[
                "Full Lawn Mowing (Front and Back)",
                "Edge Trimming Along Paths and Driveways",
                "Whipper Snipping Around Obstacles",
                "Garden Bed Edging",
                "Grass Clipping Collection or Mulching",
                "Hard Surface Blowing and Cleanup",
                "Overgrown Lawn Clearing",
                "Green Waste Removal (on request)",
                "Fortnightly and Monthly Maintenance Plans",
                "One-Off Pre-Sale or Rental Property Tidy-Up",
            ]}
            faqs={[
                {
                    question: "Do I need to be home when you mow?",
                    answer:
                        "No, you do not need to be home. As long as we have safe access to the yard, our team will complete the job and send you a photo when finished. Many of our regular clients are at work during their scheduled mow.",
                },
                {
                    question: "How much does lawn mowing in Brisbane cost?",
                    answer:
                        "Pricing depends on the size of your lawn, the frequency of service, and the condition of the grass at the time of the first visit. Contact us for a free quote and we will provide a fixed price based on your specific property.",
                },
                {
                    question: "Can you mow an overgrown lawn?",
                    answer:
                        "Yes. We regularly take on overgrown lawns that have not been mowed for weeks or months. There may be an additional charge for the first clean-up cut, but once the lawn is at a manageable height we can set up a regular maintenance schedule at the standard price.",
                },
                {
                    question: "What areas of Brisbane do you cover?",
                    answer:
                        "We service Brisbane city and surrounding suburbs including the northside, southside, east, and west. We also cover parts of the Gold Coast and Sunshine Coast. Contact us to confirm availability in your specific suburb.",
                },
                {
                    question: "Do you offer garden maintenance beyond just mowing?",
                    answer:
                        "Yes. In addition to lawn mowing we offer garden bed weeding, hedge trimming, rubbish removal, and general yard tidy-ups. Ask about our combined lawn and garden maintenance packages for the best value.",
                },
            ]}
            ctaTitle="Book Your Lawn Mowing Service Today"
            ctaDescription="Get a neat, healthy lawn without the effort. Brisbane's reliable lawn mowing team is ready to help. Get your free quote now."
        />
    );
}