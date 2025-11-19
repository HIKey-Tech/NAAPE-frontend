"use client";

import React from "react";
import CustomHeroSection from "../../custom/hero.section";
import PublishedPublicationCard from "@/components/ui/custom/publication.card";

// Example hero slides for publications page
const heroSlides = [
    {
        src: "/images/plane.jpg",
        alt: "Member writing an aviation article",
        caption: "Member insight: Publications that move the industry forward.",
    },
    {
        src: "/images/handplane.jpg",
        alt: "Aircraft and pilot documentation",
        caption: "Explore, contribute, and elevate pilot & engineer knowledge.",
    },
    {
        src: "/images/loginpic.jpg",
        alt: "Engineers collaborating on research",
        caption: "Collaboration and excellence in every page.",
    },
];

// Sample publications for demonstration (should be replaced by real data in production)
const publications = [
    {
        imageUrl: "/images/event1.jpg",
        title: "Safety Protocols in Modern Aviation",
        summary: "A deep dive into protocols ensuring flight safety in today's advanced aviation sector.",
        authorName: "Jane Doe",
        authorRole: "Pilot",
        authorAvatarUrl: '/images/leader.png',
        linkUrl: "#",
        category: "Safety",
        publishedDate: "Mar 21, 2024",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Maintaining Avionics: A Modern Perspective",
        summary: "Best practices for avionics maintenance based on latest industry research.",
        authorName: "Engr. Ifeanyi Okeke",
        authorRole: "Avionics Engineer",
        authorAvatarUrl: '/images/leader.png',
        linkUrl: "#",
        category: "Avionics",
        publishedDate: "Dec 17, 2023",
    },
];

export default function MemberPublicationsComponent() {
    return (
        <main className="w-full min-h-screen flex flex-col">
            <CustomHeroSection
                heading={
                    <>Member Publications</>
                }
                subheading={
                    <>
                        Dive into a curated library of articles, research, and technical reports authored by members of the National Association of Aircraft Pilots and Engineers. Stay informed, inspired, and connected with the latest developments and thought leadership in the aviation community.
                    </>
                }
                slides={heroSlides}
                minHeightClass="min-h-[400px]"
                showArrows={true}
                pauseOnHover={true}
            />

            <section className="max-w-6xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col gap-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a2236] mb-2">
                    Browse Publications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {publications.map((pub, idx) => (
                        <PublishedPublicationCard
                            key={pub.title + pub.publishedDate}
                            imageUrl={pub.imageUrl}
                            title={pub.title}
                            summary={pub.summary}
                            authorName={pub.authorName}
                            authorRole={pub.authorRole}
                            authorAvatarUrl={pub.authorAvatarUrl}
                            linkUrl={pub.linkUrl}
                            category={pub.category}
                            publishedDate={pub.publishedDate}
                            className=""
                        />
                    ))}
                </div>
                {/* Call to Action or Upload/Submit new Publication (optional, for members) */}
                <div className="mt-10 text-center">
                    <button
                        className="bg-[#2043A2] hover:bg-[#183077] text-white font-semibold py-3 px-7 rounded-full shadow transition-all text-base"
                        // onClick={} // Link to submission page if available
                        disabled
                        title="Feature coming soon"
                    >
                        Submit Your Publication (Coming Soon)
                    </button>
                </div>
            </section>
        </main>
    );
}
