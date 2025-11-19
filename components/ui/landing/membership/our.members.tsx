"use client";

import { TestimonialCard } from "@/components/ui/custom/testimonial.card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.08,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 18,
      duration: 0.55,
    },
  },
};

const cardSlideVariants = {
  initial: (direction: "left" | "right") =>
    direction === "left"
      ? { opacity: 0, x: -42 }
      : { opacity: 0, x: 42 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 70, damping: 18, duration: 0.5 } },
  exit: (direction: "left" | "right") =>
    direction === "left"
      ? { opacity: 0, x: 42 }
      : { opacity: 0, x: -42 },
};

export default function OurMembersSection() {
  const [idx, setIdx] = useState(0);
  const testimonialsCount = TESTIMONIALS.length;
  // Optional: auto-advance every 8s on mobile.
  // Pause on mouse hover.
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    // Only auto-scroll on mobile
    if (testimonialsCount < 2) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile && !isHovered) {
      intervalRef.current = setInterval(() => {
        setDirection("right");
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
    setDirection("left");
    setIdx((prev) => (prev === 0 ? testimonialsCount - 1 : prev - 1));
  };

  const goNext = () => {
    setDirection("right");
    setIdx((prev) => (prev + 1) % testimonialsCount);
  };

  // Improved: disables buttons if only 1 testimonial, aria-labels, keyboard navigation support
  // Improved: Dots navigation on mobile
  return (
    <motion.section
      className="w-full bg-[#F4F6FA] py-16 px-2 flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-[#232845] mb-10 text-center"
        variants={fadeUpVariants as any}
      >
        Don&apos;t Take Our Word For It—Hear From Our Members
      </motion.h2>
      <motion.div
        className="relative w-full max-w-4xl flex items-center justify-center gap-6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") goPrev();
          if (e.key === "ArrowRight") goNext();
        }}
        aria-label="NAAPE member testimonials carousel"
        variants={fadeUpVariants as any}
        transition={{ delay: 0.15 }}
      >
        {/* Left arrow */}
        <motion.button
          aria-label="Previous testimonial"
          onClick={goPrev}
          className="rounded-full bg-white border border-[#e1e4ec] shadow p-2 mr-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 disabled:opacity-40 transition absolute left-0 top-1/2 -translate-y-1/2 z-10"
          disabled={testimonialsCount < 2}
          tabIndex={testimonialsCount < 2 ? -1 : 0}
          whileTap={{ scale: 0.87 }}
          whileHover={testimonialsCount > 1 ? { scale: 1.10 } : {}}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
        >
          <FaChevronLeft size={20} />
        </motion.button>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5 w-full justify-center items-stretch">
          {/* Desktop: show all testimonials at once */}
          <motion.div
            className="hidden md:flex w-full gap-5"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUpVariants as any}
                whileHover={{ scale: 1.025, boxShadow: "0 8px 24px 0 rgba(24, 60, 160, 0.07)" }}
                transition={{ type: "spring", stiffness: 110, damping: 22 }}
                className="flex-1"
              >
                <TestimonialCard {...t} className="flex-1 transition-transform duration-300" />
              </motion.div>
            ))}
          </motion.div>
          {/* Mobile: carousel, animate transition between testimonials */}
          <div className="flex md:hidden w-full min-h-[220px]">
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={idx}
                custom={direction}
                variants={cardSlideVariants as any}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 70, damping: 18, duration: 0.5 }}
                className="w-full"
              >
                <TestimonialCard
                  {...TESTIMONIALS[idx]}
                  className="w-full transition-transform duration-300"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right arrow */}
        <motion.button
          aria-label="Next testimonial"
          onClick={goNext}
          className="rounded-full bg-white border border-[#e1e4ec] shadow p-2 ml-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-200 disabled:opacity-40 transition absolute right-0 top-1/2 -translate-y-1/2 z-10"
          disabled={testimonialsCount < 2}
          tabIndex={testimonialsCount < 2 ? -1 : 0}
          whileTap={{ scale: 0.87 }}
          whileHover={testimonialsCount > 1 ? { scale: 1.10 } : {}}
          transition={{ type: "spring", stiffness: 240, damping: 18 }}
        >
          <FaChevronRight size={20} />
        </motion.button>

        {/* Dots for mobile navigation */}
        {testimonialsCount > 1 && (
          <motion.div
            className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 pb-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.14, type: "spring", duration: 0.34 }}
          >
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i < idx ? "left" : "right");
                  setIdx(i);
                }}
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
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
}

