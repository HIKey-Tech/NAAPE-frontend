"use client";

import CustomHeroSection from "../../custom/hero.section";
import PublishedPublicationCard from "@/components/ui/custom/publication.card";
import { useRef, useEffect } from "react";

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

// Accent colors for visual hierarchy
const ACCENT_COLOR = "#1c5be5";
const CARD_BG = "#fafdff";
const BORDER_ACCENT = "#214879";
const SELECT_BG = "#e7f0ff";
const MAIN_TEXT = "#122244";

function useSetBodyTheme() {
    // Dynamic way to inject base background for page
    useEffect(() => {
        document.body.style.background = "#f5faff";
        return () => {
            document.body.style.background = "";
        };
    }, []);
}

export default function NaapePublicationsComponent() {
    useSetBodyTheme();

    const cardsContainerRef = useRef<HTMLDivElement>(null);

    // Optional: micro "pop" for grid cards on mount
    useEffect(() => {
        const container = cardsContainerRef.current;
        if (container) {
            Array.from(container.children).forEach((el, idx) => {
                (el as HTMLElement).style.opacity = "0";
                (el as HTMLElement).style.transform = "scale(0.96) translateY(12px)";
                setTimeout(() => {
                    (el as HTMLElement).style.transition = "all 0.38s cubic-bezier(.54,1.48,.4,1) " + idx * 80 + "ms";
                    (el as HTMLElement).style.opacity = "1";
                    (el as HTMLElement).style.transform = "scale(1) translateY(0)";
                }, 25);
            });
        }
    }, []);

    return (
        <main className="w-full min-h-screen flex flex-col">
            <style>
                {`
                .publications-section-title {
                    color: ${MAIN_TEXT};
                    letter-spacing: 0.01em;
                    font-weight: 800;
                    line-height: 1.2;
                }
                .publications-section-title:after {
                    display: block;
                    content: "";
                    margin-top: 7px;
                    width: 52px;
                    height: 3px;
                    border-radius: 3px;
                    background: ${ACCENT_COLOR};
                }
                .publications-card-animate {
                    transition:
                        box-shadow 0.17s cubic-bezier(.49,1.47,.57,1),
                        border-color 0.17s cubic-bezier(.49,1.47,.57,1),
                        background 0.20s cubic-bezier(.44,1.47,.37,1),
                        transform 0.17s cubic-bezier(.49,1.47,.57,1);
                }
                .publications-card-animate:focus-visible,
                .publications-card-animate:hover {
                    border-color: ${ACCENT_COLOR};
                    background: ${SELECT_BG};
                    outline: none;
                    /* Subtle "lift" effect with contrast, no shadow */
                    transform: translateY(-2px) scale(1.018);
                }
                .publications-card-animate:active {
                    transform: scale(0.98);
                    background: #eaf2ff;
                }
                `}
            </style>
            <CustomHeroSection
                heading={
                    <span
                        style={{
                            color: ACCENT_COLOR,
                            letterSpacing: "0.03em",
                            fontWeight: 900,
                            fontSize: "2.5rem",
                        }}
                    >
                        NAAPE Publications
                    </span>
                }
                subheading={
                    <span style={{ color: BORDER_ACCENT, fontWeight: 500 }}>
                        Access officially released publications, research, and guidelines from the National Association of Aircraft Pilots and Engineers.{" "}
                        <span style={{ color: ACCENT_COLOR, fontWeight: 600 }}>Stay updated</span> with NAAPE's authoritative thought leadership, technical standards, and reports powering the aviation industry.
                    </span>
                }
                slides={heroSlides}
                minHeightClass="min-h-[400px]"
                showArrows={true}
                pauseOnHover={true}
            />

            <section
                className="max-w-6xl mx-auto w-full px-4 md:px-8 py-12 flex flex-col gap-8"
                style={{
                    background: "none",
                }}
            >
                <h2
                    className="publications-section-title text-2xl md:text-3xl mb-2"
                >
                    Browse Official Publications
                </h2>
                <div
                    ref={cardsContainerRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
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
                            className="publications-card-animate relative border-2 border-[#cdd9eb] rounded-xl bg-[#fafdff] focus-visible:ring-2 focus-visible:ring-[#1845c1]"
                            // Note: bg is light, border provides contrast, on hover/active gets micro animations
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
