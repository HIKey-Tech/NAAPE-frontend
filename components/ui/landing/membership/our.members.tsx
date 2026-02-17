"use client";

import { TestimonialCard } from "@/components/ui/custom/testimonial.card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
];

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function OurMembersSection() {
  const [idx, setIdx] = useState(0);
  const testimonialsCount = TESTIMONIALS.length;
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");

  useEffect(() => {
    if (testimonialsCount < 2) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile && !isHovered) {
      intervalRef.current = setInterval(() => {
        setDirection("right");
        setIdx((prev) => (prev + 1) % testimonialsCount);
      }, 8000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isHovered, testimonialsCount]);

  const goPrev = () => { setDirection("left"); setIdx((prev) => (prev === 0 ? testimonialsCount - 1 : prev - 1)); };
  const goNext = () => { setDirection("right"); setIdx((prev) => (prev + 1) % testimonialsCount); };

  return (
    <section className="py-24 px-6 md:px-12 bg-[#f8fafc] w-full">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={fadeUpVariants} className="text-center mb-16"
        >
          <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Hear From Our Members
          </h2>
        </motion.div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onKeyDown={(e) => { if (e.key === "ArrowLeft") goPrev(); if (e.key === "ArrowRight") goNext(); }}
          tabIndex={0}
        >
          {/* Desktop: all at once */}
          <div className="hidden md:grid grid-cols-2 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <TestimonialCard {...t} className="bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-3xl p-8 h-full hover:shadow-2xl transition-all duration-300" />
              </motion.div>
            ))}
          </div>

          {/* Mobile: carousel */}
          <div className="md:hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: direction === "right" ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "right" ? -40 : 40 }}
                className="w-full"
              >
                <TestimonialCard {...TESTIMONIALS[idx]} className="bg-white border border-slate-100 shadow-xl rounded-3xl p-8" />
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-6 items-center">
              <button onClick={goPrev} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition" disabled={testimonialsCount < 2}>
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => { setDirection(i < idx ? "left" : "right"); setIdx(i); }}
                    className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-primary" : "w-2 bg-slate-300"}`} />
                ))}
              </div>
              <button onClick={goNext} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center hover:bg-slate-50 transition" disabled={testimonialsCount < 2}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
