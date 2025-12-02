"use client";

import * as React from "react";
import { LandingTabs, TabItem } from "@/components/ui/custom/landing.tab";

// Placeholder gallery: Replace with real data or fetch from API in production.
const photoCategories: Record<string, { src: string; alt: string }[]> = {
  events: [
    {
      src: "/gallery/1.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/2.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/3.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/4.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/5.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/6.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/7.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/8.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/9.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/10.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/11.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/12.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/13.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/14.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/15.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/16.jpeg",
      alt: "NAAPE Gallery",
    },
  ],
  members: [
    {
      src: "/gallery/leader.jpeg",
      alt: "NAAPE Gallery",
    },
    {
      src: "/gallery/leader.jpeg",
      alt: "NAAPE Gallery",
    },
  ],
  highlights: [
    {
      src: "/gallery/leader.jpeg",
      alt: "NAAPE Gallery",
    },
  ],
};

// Gather all photos for easier global search
const allPhotos: { src: string; alt: string }[] = Object.values(photoCategories).flat();

// Gallery Tabs Config, split SVGs for easier theme control if necessary
const GALLERY_TABS: TabItem[] = [
  {
    value: "events",
    label: "Events",
    icon: (
      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  // {
  //   value: "members",
  //   label: "Members",
  //   icon: (
  //     <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
  //       <circle cx="12" cy="8" r="4" />
  //       <path d="M2 20c0-4 8-6 8-6s8 2 8 6" />
  //     </svg>
  //   ),
  // },
  // {
  //   value: "highlights",
  //   label: "Highlights",
  //   icon: (
  //     <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
  //       <path d="M12 2v20M2 12h20M5 5l14 14" />
  //     </svg>
  //   ),
  // },
];

// Single image card for gallery, improves reusability/clarity.
function PhotoCard({ photo }: { photo: { src: string; alt: string } }) {
  return (
    <div
      className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden shadow-xs sm:shadow-sm bg-gray-100 group transition-shadow duration-150 focus-within:ring-2 focus-within:ring-blue-300"
      tabIndex={0}
      aria-label={photo.alt}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-active:scale-95 group-focus:scale-105"
        style={{ minHeight: 0, minWidth: 0 }}
        loading="lazy"
      />
      {/* <span className="absolute left-2 bottom-2 text-xs xs:text-sm sm:text-xs md:text-sm px-2 py-0.5 bg-white/70 rounded text-gray-700 font-medium shadow max-w-[90%] truncate pointer-events-none select-none">
        {photo.alt}
      </span> */}
      {/* Focus ring for accessibility */}
      <span className="pointer-events-none absolute inset-0 rounded-lg sm:rounded-xl ring-2 ring-offset-2 ring-blue-300 focus-within:ring-2 transition-all opacity-0 group-focus-within:opacity-100"></span>
    </div>
  );
}

// Gallery grid, now split as component for animation/extensibility
function GalleryGrid({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {photos.map((photo, idx) => (
        <PhotoCard key={`${photo.src}-${idx}`} photo={photo} />
      ))}
    </div>
  );
}

// Tab panel renderer: handles search & fallback UI
function renderGalleryPanel({
  tab,
  isActive,
  searchTerm,
}: {
  tab: TabItem;
  isActive: boolean;
  searchTerm: string;
}) {
  // If searching, ignore tab and show global photos filtered.
  const trimmed = searchTerm.trim().toLowerCase();
  let photosToShow: { src: string; alt: string }[] = [];

  if (trimmed) {
    photosToShow = allPhotos.filter((img) => img.alt.toLowerCase().includes(trimmed));
  } else {
    photosToShow = photoCategories[tab.value] ?? [];
  }

  if (!photosToShow.length)
    return (
      <div className="py-12 text-center text-gray-400 select-none text-base">
        <span role="status">No photos found.</span>
      </div>
    );

  return <GalleryGrid photos={photosToShow} />;
}

export default function PhotoGalleryTab() {
  // Track activeTab and searchTerm for tailored panel
  const [activeTab, setActiveTab] = React.useState("events");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Memoize panel renderer for performance
  const panelRenderer = React.useCallback(
    (tab: TabItem, isActive: boolean) =>
      activeTab === tab.value
        ? renderGalleryPanel({ tab, isActive, searchTerm })
        : null,
    [activeTab, searchTerm]
  );

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchTerm("");
  };

  // Improved container: sticky tabs, more clear hierarchy, responsiveness tweaks, ARIA
  return (
    <section
      className="w-full min-h-screen bg-white flex flex-col items-center pt-2 sm:pt-6 md:pt-8 pb-2 sm:pb-4 md:pb-0 px-1 sm:px-2 md:px-1"
      aria-label="Photo Gallery"
    >
      <div className="w-full max-w-full sm:p-4 p-1">
        <div className="sticky top-[57px] sm:top-[65px] z-20 bg-white border-b border-gray-100">
          <LandingTabs
            tabs={GALLERY_TABS}
            defaultValue={activeTab}
            onTabChange={handleTabChange}
            showTabs={true}
            showSearch={true}
            onSearch={handleSearch}
            searchPlaceholder="Search photos..."
            className="mb-0 h-full w-full bg-white p-0"
            tabListClassName="mb-0 w-full h-full justify-between items-center"
            tabPanel={panelRenderer}
          />
        </div>
      </div>
    </section>
  );
}
