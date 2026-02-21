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
    { src: "/gallery/16.jpeg", alt: "NAAPE Members Leadership" },
    { src: "/gallery/15.jpeg", alt: "NAAPE Members Networking" },
    { src: "/gallery/12.jpeg", alt: "NAAPE Members Workshop" },
  ],
  highlights: [
    { src: "/gallery/7.jpeg", alt: "NAAPE Highlights Award" },
    { src: "/gallery/4.jpeg", alt: "NAAPE Keynote Highlights" },
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
function PhotoCard({ photo, index, onClick }: { photo: { src: string; alt: string }, index: number, onClick: (photo: { src: string; alt: string }) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => onClick(photo)}
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
        <span className="text-white font-bold text-sm md:text-base transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 drop-shadow-md flex items-center justify-between">
          {photo.alt}
          <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </span>
      </div>
    </motion.div>
  );
}

// --- Gallery Grid ---
function GalleryGrid({ photos, onPhotoClick }: { photos: { src: string; alt: string }[], onPhotoClick: (photo: { src: string; alt: string }) => void }) {
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-1">
      <AnimatePresence>
        {photos.map((photo, idx) => (
          <PhotoCard key={`${photo.src}-${idx}`} photo={photo} index={idx} onClick={onPhotoClick} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// --- Gallery Lightbox ---
function Lightbox({ photo, onClose }: { photo: { src: string; alt: string } | null, onClose: () => void }) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 cursor-zoom-out"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer z-[101]"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center cursor-default bg-transparent rounded-lg overflow-hidden"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
            draggable={false}
          />
          <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pointer-events-none">
            <p className="text-white text-lg font-medium drop-shadow-md text-center">{photo.alt}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Tab panel renderer ---
function renderGalleryPanel({
  tab,
  isActive,
  onPhotoClick,
}: {
  tab: TabItem;
  isActive: boolean;
  onPhotoClick: (photo: { src: string; alt: string }) => void;
}) {
  const photosToShow = photoCategories[tab.value] ?? [];

  if (!photosToShow.length)
    return (
      <div className="py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">No photos found</h3>
        <p className="text-slate-500">We couldn&apos;t find any photos for this category.</p>
      </div>
    );
  return <GalleryGrid photos={photosToShow} onPhotoClick={onPhotoClick} />;
}

// --- Main Export ---
export default function PhotoGalleryTab() {
  const [activeTab, setActiveTab] = React.useState("events");
  const [selectedPhoto, setSelectedPhoto] = React.useState<{ src: string; alt: string } | null>(null);

  const panelRenderer = React.useCallback(
    (tab: TabItem, isActive: boolean) =>
      activeTab === tab.value
        ? renderGalleryPanel({ tab, isActive, onPhotoClick: setSelectedPhoto })
        : null,
    [activeTab]
  );

  const handleTabChange = (tabVal: string) => {
    setActiveTab(tabVal);
  };

  return (
    <>
      <section
        className="w-full bg-background flex flex-col items-center pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 relative z-10"
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
            showSearch={false}
            className="mb-0 w-full bg-transparent p-0"
            tabListClassName="mb-8 w-full justify-center items-center gap-4 border-b-0 pb-0"
            tabPanel={panelRenderer}
          />
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <Lightbox photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}
