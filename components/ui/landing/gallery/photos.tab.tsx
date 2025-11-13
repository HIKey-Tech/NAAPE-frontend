"use client";

import * as React from "react";
import { LandingTabs, TabItem } from "@/components/ui/custom/landing.tab";

// Dummy data for gallery images by category
const photoCategories: { [key: string]: { src: string, alt: string }[] } = {
    events: [
        {
            src: "/images/leader.png",
            alt: "Award ceremony with Nigerian flag",
        },
        {
            src: "/images/leader.png",
            alt: "Attendees at seminar, someone writing",
        },
        {
            src: "/images/leader.png",
            alt: "Attendees, woman in purple dress, mask",
        },
        {
            src: "/images/leader.png",
            alt: "Black-and-white portrait of smiling girl",
        },
    ],
    members: [
        {
            src: "/images/leader.png",
            alt: "NAAPE member group",
        },
        {
            src: "/images/leader.png",
            alt: "Member portrait smiling",
        }
    ],
    highlights: [
        {
            src: "/images/leader.png",
            alt: "Highlight 1",
        }
    ]
};

// All photos (flat, for search across tabs)
const allPhotos = [
    ...photoCategories.events,
    ...photoCategories.members,
    ...photoCategories.highlights,
];

// Tabs definition
const GALLERY_TABS: TabItem[] = [
    {
        value: "events",
        label: "Events",
        icon: (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        )
    },
    {
        value: "members",
        label: "Members",
        icon: (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" />
                <path d="M2 20c0-4 8-6 8-6s8 2 8 6" />
            </svg>
        )
    },
    {
        value: "highlights",
        label: "Highlights",
        icon: (
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M12 2v20M2 12h20M5 5l14 14" />
            </svg>
        )
    }
];

// Tab panel renderer
function renderGalleryPanel(tab: TabItem, isActive: boolean, searchTerm: string) {
    // Show all photos when searching
    let photosToShow: { src: string, alt: string }[] = [];
    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        photosToShow = allPhotos.filter(img =>
            img.alt.toLowerCase().includes(lower)
        );
    } else {
        photosToShow = photoCategories[tab.value as keyof typeof photoCategories] || [];
    }

    if (photosToShow.length === 0)
        return (
            <div className="py-8 text-center text-gray-500">
                No photos found.
            </div>
        );

    return (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {photosToShow.map((photo, idx) => (
                <div
                    key={idx}
                    className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm bg-gray-100"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photo.src}
                        alt={photo.alt}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        style={{ minHeight: 0, minWidth: 0 }}
                    />
                </div>
            ))}
        </div>
    );
}

export default function PhotoGalleryTab() {
    // For handling search term locally for custom panel rendering
    const [searchTerm, setSearchTerm] = React.useState("");
    const [activeTab, setActiveTab] = React.useState("events");

    // Handler for search
    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    // Handler for tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchTerm(""); // Reset search when tab changes
    };

    return (
        <section className="w-full min-h-screen bg-white flex flex-col items-center pt-8 pb-0 px-2 md:px-1">
            <div className="w-full max-w-full p-6">
                <LandingTabs
                    tabs={GALLERY_TABS}
                    defaultValue={activeTab}
                    onTabChange={handleTabChange}
                    showTabs={true}
                    showSearch={true}
                    onSearch={handleSearch}
                    searchPlaceholder="Search photos..."
                    className="mb-0 w-full bg-white p-0"
                    tabListClassName="mb-0 w-fit  justify-between items-center"
                    tabPanel={(tab, isActive) =>
                        activeTab === tab.value && renderGalleryPanel(tab, isActive, searchTerm)
                    }
                />
            </div>
        </section>
    );
}
