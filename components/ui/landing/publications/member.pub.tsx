"use client";

import React from "react";
import CustomHeroSection from "../../custom/hero.section";
import PublishedPublicationCard from "@/components/ui/custom/publication.card";
import Link from "next/link";
import { NaapButton } from "../../custom/button.naap";

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

// Publications data, IDs must match dynamic page names and routing
const publications = [
    {
        id: "safety-protocols",
        imageUrl: "/publications/modern.jpg",
        title: "Safety Protocols in Modern Aviation",
        summary: "A deep dive into protocols ensuring flight safety in today's advanced aviation sector.",
        authorName: "Capt Grace Oluwatobi",
        authorRole: "Pilot",
        category: "Safety",
        publishedDate: "2024-03-21",
    },
    {
        id: "maintaining-avionics",
        imageUrl: "/publications/fly.jpg",
        title: "Maintaining Avionics: A Modern Perspective",
        summary: "Best practices for avionics maintenance based on latest industry research.",
        authorName: "Engr. Ifeanyi Okeke",
        authorRole: "Avionics Engineer",
        category: "Avionics",
        publishedDate: "2023-12-17",
    },
];

export default function MemberPublicationsComponent() {
    return (
        <main className="w-full min-h-screen flex flex-col">
            <CustomHeroSection
                heading={<>Member Publications</>}
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
                    {publications.map((pub) => (
                        <PublishedPublicationCard
                            key={pub.id}
                            imageUrl={pub.imageUrl}
                            title={pub.title}
                            summary={pub.summary}
                            authorName={pub.authorName}
                            authorRole={pub.authorRole}
                            // Route to the detail page by ID per dynamic route [id]
                            linkUrl={`/publication/members/${pub.id}`}
                            category={pub.category}
                            publishedDate={
                                // Format as "Mar 21, 2024" if available, else raw
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
                {/* Call to Action or Upload/Submit new Publication (optional, for members) */}
                <div className="mt-10 text-center">
                    <NaapButton
                        variant="primary"
                        className="py-3 px-7 text-base font-semibold shadow"
                        onClick={() => window.location.href = "/login"}
                        tooltip="Sign in to submit your publication"
                        fullWidth={false}
                    >
                        Submit Your Publication
                    </NaapButton>
                </div>
            </section>
        </main>
    );
}
