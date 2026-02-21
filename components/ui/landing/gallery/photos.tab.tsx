"use client";

import * as React from "react";
import { LandingTabs, TabItem } from "@/components/ui/custom/landing.tab";
import { motion, AnimatePresence } from "framer-motion";

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
    { src: "/gallery/leader.jpeg", alt: "NAAPE Members Leadership" },
    { src: "/gallery/leader.jpeg", alt: "NAAPE Members Networking" },
  ],
  highlights: [
    { src: "/gallery/leader.jpeg", alt: "NAAPE Highlights Award" },
  ],
};

const allPhotos: { src: string; alt: string }[] = Object.values(photoCategories).flat();

const GALLERY_TABS: TabItem[] = [
  {
    value: "events",
    label: "Events",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: "members",
    label: "Members",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5V4H2v16h5m10 0v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5m10 0H7m4-8a4 4 0 100-8 4 4 0 000 8z" />
      </svg>
    ),
  },
  {
    value: "highlights",
    label: "Highlights",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
      className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer bg-white border border-slate-200/50 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
        <span className="text-white font-bold text-sm md:text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md">
          {photo.alt}
        </span>
      </div>
    </motion.div>
  );
}

// --- Gallery Grid ---
function GalleryGrid({ photos }: { photos: { src: string; alt: string }[] }) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
      <AnimatePresence>
        {photos.map((photo, idx) => (
          <PhotoCard key={`${photo.src}-${idx}`} photo={photo} index={idx} />
        ))}
      </AnimatePresence>
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
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">No photos found</h3>
        <p className="text-slate-500">We couldn&apos;t find any photos matching your search.</p>
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
      className="w-full bg-background flex flex-col items-center py-16 md:py-24 px-4 sm:px-6"
      aria-label="Photo Gallery"
    >
      <header className="w-full max-w-7xl mx-auto mb-12 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 uppercase tracking-wider">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Gallery
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
          Photo <span className="text-primary">Gallery</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl leading-relaxed">
          Explore NAAPE moments, milestones, and the faces driving aviation excellence forward.
        </p>
      </header>

      <div className="w-full max-w-7xl mx-auto">
        <LandingTabs
          tabs={GALLERY_TABS}
          defaultValue={activeTab}
          onTabChange={handleTabChange}
          showTabs={true}
          showSearch={true}
          onSearch={handleSearch}
          searchPlaceholder="Search perfect moments..."
          className="mb-0 w-full bg-transparent p-0"
          tabListClassName="mb-8 w-full justify-between sm:justify-center items-center gap-4"
          tabPanel={panelRenderer}
        />
      </div>
    </section>
  );
}
