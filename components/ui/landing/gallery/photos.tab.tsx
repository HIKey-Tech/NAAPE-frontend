"use client";

import * as React from "react";
import { LandingTabs, TabItem } from "@/components/ui/custom/landing.tab";

// --- Visual Variables ---
const ACCENT_COLOR = "#1c5be5";
const ACCENT_LIGHT = "#e8f0ff";
const CARD_BG = "#fafdff";
const BORDER_COLOR = "#214879";
const CARD_BORDER = "#d1e3f8";

// --- Gallery Data ---
const photoCategories: Record<string, { src: string; alt: string }[]> = {
  events: [
    { src: "/gallery/1.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/2.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/3.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/4.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/5.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/6.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/7.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/8.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/9.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/10.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/11.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/12.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/13.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/14.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/15.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/16.jpeg", alt: "NAAPE Gallery" },
  ],
  members: [
    { src: "/gallery/leader.jpeg", alt: "NAAPE Gallery" },
    { src: "/gallery/leader.jpeg", alt: "NAAPE Gallery" },
  ],
  highlights: [
    { src: "/gallery/leader.jpeg", alt: "NAAPE Gallery" },
  ],
};

const allPhotos: { src: string; alt: string }[] = Object.values(photoCategories).flat();

// Remove shadows and gradients from SVG icons, use accent color.
const GALLERY_TABS: TabItem[] = [
  {
    value: "events",
    label: "Events",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke={ACCENT_COLOR} strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  // Add more tabs here as needed
];

// --- Micro-animations ---
const animationStyles = `
@media (hover: hover) {
  .photo-animate {
    transition: 
      border-color 0.18s cubic-bezier(.48,2,.13,.81),
      background 0.22s cubic-bezier(.48,2,.13,.81),
      transform 0.20s cubic-bezier(.56,1.15,.65,1.01);
  }
  .photo-animate:hover,
  .photo-animate:focus-visible {
    border-color: ${ACCENT_COLOR};
    background: ${ACCENT_LIGHT};
    transform: translateY(-2.5px) scale(1.037);
    outline: none;
  }
  .photo-animate:active {
    transform: scale(.97);
    background: #e1ebf9;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .gallery-card-appear {
    opacity: 0;
    transform: scale(.94) translateY(20px);
    animation: fade-in-card .54s cubic-bezier(.44,1.55,.61,1.01) both;
  }
  @keyframes fade-in-card {
    0% {
      opacity: 0;
      transform: scale(.92) translateY(18px);
    }
    65% {
      opacity: .98;
      transform: scale(1.018) translateY(-2px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
}
`;

// --- Photo Card ---
function PhotoCard({ photo, index }: { photo: { src: string; alt: string }, index: number }) {
  // Stagger animation
  const style = { animationDelay: `${index * 45}ms` };

  return (
    <div
      className="photo-animate gallery-card-appear relative aspect-[3/4] rounded-xl border bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-400"
      tabIndex={0}
      aria-label={photo.alt}
      style={{ borderColor: CARD_BORDER, ...style }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105 group-active:scale-98 group-focus:scale-105"
        style={{ minHeight: 0, minWidth: 0, background: "#f8fbff" }}
        loading="lazy"
        draggable={false}
      />
      {/* Focus ring for accessibility */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-offset-2 ring-blue-300 focus-within:ring-2 transition-all opacity-0 group-focus-within:opacity-100"></span>
    </div>
  );
}

// --- Gallery Grid ---
function GalleryGrid({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <div className="mt-4 sm:mt-6 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
      {photos.map((photo, idx) => (
        <PhotoCard key={`${photo.src}-${idx}`} photo={photo} index={idx} />
      ))}
    </div>
  );
}

// --- Tab panel renderer ---
function renderGalleryPanel({
  tab,
  isActive,
  searchTerm,
}: {
  tab: TabItem;
  isActive: boolean;
  searchTerm: string;
}) {
  const trimmed = searchTerm.trim().toLowerCase();
  let photosToShow: { src: string; alt: string }[] = [];
  if (trimmed) {
    photosToShow = allPhotos.filter((img) => img.alt.toLowerCase().includes(trimmed));
  } else {
    photosToShow = photoCategories[tab.value] ?? [];
  }
  if (!photosToShow.length)
    return (
      <div className="py-12 text-center text-gray-400 select-none text-base font-semibold tracking-wide">
        <span role="status">No photos found.</span>
      </div>
    );
  return <GalleryGrid photos={photosToShow} />;
}

// --- Main Export ---
export default function PhotoGalleryTab() {
  const [activeTab, setActiveTab] = React.useState("events");
  const [searchTerm, setSearchTerm] = React.useState("");

  // Memoized tab panel renderer
  const panelRenderer = React.useCallback(
    (tab: TabItem, isActive: boolean) =>
      activeTab === tab.value
        ? renderGalleryPanel({ tab, isActive, searchTerm })
        : null,
    [activeTab, searchTerm]
  );

  const handleSearch = (term: string) => setSearchTerm(term);
  const handleTabChange = (tabVal: string) => {
    setActiveTab(tabVal);
    setSearchTerm("");
  };

  return (
    <section
      className="w-full min-h-screen bg-[#f7fafd] flex flex-col items-center pt-4 sm:pt-8 md:pt-12 pb-2 sm:pb-6 px-1 sm:px-4"
      aria-label="Photo Gallery"
    >
      <style>{animationStyles}</style>
      <header className="w-full max-w-5xl mx-auto flex flex-col items-start sm:mb-6 mb-2 px-2 sm:px-0">
        <h2
          className="font-extrabold text-[1.7rem] sm:text-3xl text-[#183164] tracking-tight leading-tight mb-1 sm:mb-2"
          style={{
            letterSpacing: "0.01em",
            lineHeight: 1.18,
          }}
        >
          Photo Gallery
        </h2>
        <span className="text-base sm:text-lg font-medium text-[#3159a1] mb-2 sm:mb-0">
          Explore NAAPE moments &amp; milestones
        </span>
        <span
          className="block h-[3px] w-14 rounded bg-[#2376de] mt-1 mb-1 sm:mb-2"
          aria-hidden
        />
      </header>
      <div className="w-full max-w-5xl mx-auto sm:px-2 px-1">
        <div className="sticky top-[57px] sm:top-[65px] z-20 bg-[#f7fafd] border-b border-[#e5ecf7]">
          <LandingTabs
            tabs={GALLERY_TABS}
            defaultValue={activeTab}
            onTabChange={handleTabChange}
            showTabs={true}
            showSearch={true}
            onSearch={handleSearch}
            searchPlaceholder="Search photos..."
            className="mb-0 h-full w-full bg-transparent p-0"
            tabListClassName="mb-0 w-full h-full justify-between items-center"
            tabPanel={panelRenderer}
          />
        </div>
      </div>
    </section>
  );
}
