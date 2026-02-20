"use client";

import * as React from "react";
import { LandingTabs, TabItem } from "@/components/ui/custom/landing.tab";
import Image from "next/image";
import { motion } from "framer-motion";

// --- Gallery Data ---
const photoCategories: Record<string, { src: string; alt: string }[]> = {
  events: [
    { src: "/gallery/1.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/2.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/3.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/4.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/5.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/6.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/7.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/8.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/9.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/10.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/11.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/12.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/13.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/14.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/15.jpeg", alt: "NAAPE Event Gallery" },
    { src: "/gallery/16.jpeg", alt: "NAAPE Event Gallery" },
  ],
  members: [
    { src: "/gallery/leader.jpeg", alt: "NAAPE Members" },
    { src: "/gallery/leader.jpeg", alt: "NAAPE Members" },
  ],
  highlights: [
    { src: "/gallery/leader.jpeg", alt: "NAAPE Highlights" },
  ],
};

const allPhotos: { src: string; alt: string }[] = Object.values(photoCategories).flat();

const GALLERY_TABS: TabItem[] = [
  {
    value: "events",
    label: "Events",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
];

// --- Photo Card ---
function PhotoCard({ photo, index }: { photo: { src: string; alt: string }, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

// --- Gallery Grid ---
function GalleryGrid({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
      <div className="py-16 text-center text-slate-400 font-bold text-lg">
        No photos found.
      </div>
    );
  return <GalleryGrid photos={photosToShow} />;
}

// --- Main Export ---
export default function PhotoGalleryTab() {
  const [activeTab, setActiveTab] = React.useState("events");
  const [searchTerm, setSearchTerm] = React.useState("");

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
      className="w-full min-h-screen bg-slate-50 flex flex-col items-center pt-8 md:pt-12 pb-8 px-4 sm:px-6"
      aria-label="Photo Gallery"
    >
      <header className="w-full max-w-7xl mx-auto mb-8">
        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Gallery</span>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
          Photo Gallery
        </h2>
        <p className="text-lg text-slate-500 font-medium">
          Explore NAAPE moments &amp; milestones
        </p>
      </header>
      <div className="w-full max-w-7xl mx-auto">
        <LandingTabs
          tabs={GALLERY_TABS}
          defaultValue={activeTab}
          onTabChange={handleTabChange}
          showTabs={true}
          showSearch={false}
          onSearch={handleSearch}
          searchPlaceholder="Search photos..."
          className="mb-0 w-full bg-transparent p-0"
          tabListClassName="mb-0 w-full justify-between items-center"
          tabPanel={panelRenderer}
        />
      </div>
    </section>
  );
}
