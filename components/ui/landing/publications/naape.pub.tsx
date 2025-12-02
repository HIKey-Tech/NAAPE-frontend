"use client";

import CustomHeroSection from "../../custom/hero.section";
import PublishedPublicationCard from "@/components/ui/custom/publication.card";

// Hero slides for NAAPE publications page
const heroSlides = [
    {
        src: "/logo.png",
        alt: "NAAPE Publishing Team",
        caption: "Official releases and research from NAAPE.",
    },
    {
        src: "/logo.png",
        alt: "Aviation Industry Standards",
        caption: "Guidance, policy, and insights to power progress.",
    },
    {
        src: "/images/event1.jpg",
        alt: "NAAPE meeting",
        caption: "Driving excellence in Nigeria's aviation sector.",
    },
];

// The IDs must match dynamic [id] routes for /publication/naape/[id]
const naapePublications = [
    {
        id: "annual-report-2023",
        imageUrl: "/logo.png",
        title: "2023 NAAPE Annual Report",
        summary: "A comprehensive overview of NAAPE's activities, achievements, and industry impact throughout 2023.",
        authorName: "NAAPE",
        authorRole: "Admin",
        authorAvatarUrl: "/logo.png",
        category: "Annual Report",
        publishedDate: "2024-04-10",
    },
    {
        id: "aviation-safety-guidance-2024",
        imageUrl: "/logo.png",
        title: "Updated Aviation Safety Guidance 2024",
        summary: "Official NAAPE recommendations for flight safety updated for evolving regulatory standards and technologies.",
        authorName: "NAAPE",
        authorRole: "Admin",
        authorAvatarUrl: "/logo.png",
        category: "Guidance",
        publishedDate: "2024-02-14",
    },
    {
        id: "rpas-drones-nigerian-airspace",
        imageUrl: "/images/handplane.jpg",
        title: "NAAPE Research: RPAS/Drones in Nigerian Airspace",
        summary: "Assessment of risks, opportunities, and regulatory considerations regarding unmanned aerial systems in Nigeria.",
        authorName: "NAAPE",
        authorRole: "Admin",
        authorAvatarUrl: "/logo.jpg",
        category: "Research",
        publishedDate: "2023-09-07",
    },
];

export default function NaapePublicationsComponent() {
    return (
        <main className="w-full min-h-screen flex flex-col">
            <CustomHeroSection
                heading={<>NAAPE Publications</>}
                subheading={
                    <>
                        Access officially released publications, research, and guidelines from the National Association of Aircraft Pilots and Engineers. Stay updated with NAAPE's authoritative thought leadership, technical standards, and reports powering the aviation industry.
                    </>
                }
                slides={heroSlides}
                minHeightClass="min-h-[400px]"
                showArrows={true}
                pauseOnHover={true}
            />

            <section className="max-w-6xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col gap-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a2236] mb-2">
                    Browse Official Publications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {naapePublications.map((pub) => (
                        <PublishedPublicationCard
                            key={pub.id}
                            imageUrl={pub.imageUrl}
                            title={pub.title}
                            summary={pub.summary}
                            authorName={pub.authorName}
                            authorRole={pub.authorRole}
                            authorAvatarUrl={pub.authorAvatarUrl}
                            // Route to the detail page by ID per dynamic route [id]
                            linkUrl={`/publication/naape/${pub.id}`}
                            category={pub.category}
                            publishedDate={
                                pub.publishedDate
                                    ? (new Date(pub.publishedDate)).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })
                                    : ""
                            }
                            className=""
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
