"use client";

import { TestimonialCard } from "@/components/ui/custom/testimonial.card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

// Improved: Expandable testimonials, optional auto-cycling, accessibility, scalable testimonial list
const TESTIMONIALS = [
  {
    testimonial:
      "NAAPE has been my professional anchor – from winning fair workplace terms to championing safety standards that protect every crew and passenger. Their training and advocacy genuinely advanced my career.",
    name: "Capt. Amina Okoro",
    title: "Senior Airline Pilot (18 yrs)",
  },
  {
    testimonial:
      "Joining NAAPE meant real representation. They pushed for better maintenance protocols, delivered practical upskilling, and always stood by members when it mattered most.",
    name: "Engr. Chinedu Eze",
    title: "Lead Aircraft Maintenance Engineer (12 yrs)",
  },
  // You could easily add more testimonials here.
];

export default function OurMembersSection() {
  const [idx, setIdx] = useState(0);
  const testimonialsCount = TESTIMONIALS.length;
  // Optional: auto-advance every 8s on mobile.
  // Pause on mouse hover.
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only auto-scroll on mobile
    if (testimonialsCount < 2) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile && !isHovered) {
      intervalRef.current = setInterval(() => {
        setIdx((prev) => (prev + 1) % testimonialsCount);
      }, 8000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovered, testimonialsCount]);

  const goPrev = () => {
    setIdx((prev) => (prev === 0 ? testimonialsCount - 1 : prev - 1));
  };

  const goNext = () => {
    setIdx((prev) => (prev + 1) % testimonialsCount);
  };

  // Improved: disables buttons if only 1 testimonial, aria-labels, keyboard navigation support
  // Improved: Dots navigation on mobile
  return (
    <section className="w-full bg-[#F4F6FA] py-16 px-2 flex flex-col items-center justify-center">
      <h2 className="text-2xl md:text-3xl font-bold text-[#232845] mb-10 text-center">
        Don&apos;t Take Our Word For It—Hear From Our Members
      </h2>
      <div
        className="relative w-full max-w-4xl flex items-center justify-center gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goPrev();
          if (e.key === "ArrowRight") goNext();
        }}
        aria-label="NAAPE member testimonials carousel"
      >
        {/* Left arrow */}
        <button
          aria-label="Previous testimonial"
          onClick={goPrev}
          className="rounded-full bg-white border border-[#e1e4ec] shadow p-2 mr-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 disabled:opacity-40 transition absolute left-0 top-1/2 -translate-y-1/2 z-10"
          disabled={testimonialsCount < 2}
          tabIndex={testimonialsCount < 2 ? -1 : 0}
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5 w-full justify-center items-stretch">
          {/* Desktop: show all, Mobile: show one */}
          <div className="hidden md:flex w-full gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} {...t} className="flex-1 transition-transform duration-300" />
            ))}
          </div>
          <div className="flex md:hidden w-full">
            <TestimonialCard
              {...TESTIMONIALS[idx]}
              className="w-full transition-transform duration-300"
            />
          </div>
        </div>

        {/* Right arrow */}
        <button
          aria-label="Next testimonial"
          onClick={goNext}
          className="rounded-full bg-white border border-[#e1e4ec] shadow p-2 ml-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 disabled:opacity-40 transition absolute right-0 top-1/2 -translate-y-1/2 z-10"
          disabled={testimonialsCount < 2}
          tabIndex={testimonialsCount < 2 ? -1 : 0}
        >
          <FaChevronRight size={20} />
        </button>

        {/* Dots for mobile navigation */}
        {testimonialsCount > 1 && (
          <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 pb-3">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIdx(i)}
                className={`h-2 w-2 rounded-full transition ${
                  idx === i ? "bg-blue-800" : "bg-[#e1e4ec]"
                }`}
                style={{
                  border: idx === i ? "2px solid #0d254b" : undefined,
                  outline: idx === i ? "2px solid #2563eb" : undefined,
                }}
                tabIndex={0}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

