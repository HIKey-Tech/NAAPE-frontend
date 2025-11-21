"use client";

import { useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/ui/custom/testimonial.card";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    testimonial:
      "NAAPE has been my professional anchor – from winning fair workplace terms to championing safety standards that protect every crew and passenger. Their training and advocacy genuinely advanced my career.",
    name: "Capt. Amina Okoro",
    title: "Senior Airline Pilot (11 yrs)",
  },
  {
    testimonial:
      "Joining NAAPE meant real representation. They pushed for better maintenance protocols, delivered practical upskilling, and always stood by members when it mattered most.",
    name: "Engr. Chinedu Eze",
    title: "Lead Aircraft Maintenance Engineer (12 yrs)",
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  enter: { opacity: 0, y: 50 },
  center: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.5 } },
  exit: { opacity: 0, y: -30, transition: { duration: 0.3 } },
};

function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(typeof window === "undefined" ? false : window.innerWidth < breakpoint);
  useEffect(() => {
    function handler() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    window.addEventListener("resize", handler);
    handler();
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

export default function TestimonialsSection() {
  const isMobile = useIsMobile();
  const [active, setActive] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile: auto-advance each 4s. Desktop: show all cards.
  useEffect(() => {
    if (isMobile) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActive((a) => (a + 1) % testimonials.length);
      }, 4000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    // Clean up and reset for desktop (show all)
    setActive(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { };
  }, [isMobile]);

  // Dots navigation
  const handleDot = (i: number) => {
    setActive(i);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActive((a) => (a + 1) % testimonials.length);
      }, 4000);
    }
  };

  return (
    <motion.section
      className="relative w-full max-w-screen-xl mx-auto py-16 px-4 flex flex-col items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        className="text-xs md:text-sm text-[#CA9414] font-semibold tracking-widest uppercase mb-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        TESTIMONIALS
      </motion.span>
      <motion.h2
        className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Real stories from members whose passion for aviation found
        <br className="hidden md:inline" /> purpose, support, and growth through NAAPE
      </motion.h2>
      <motion.div
        className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {/* Mobile: auto slider; Desktop: show all */}
        {isMobile ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  variants={cardVariants as any}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full max-w-md"
                >
                  <TestimonialCard
                    testimonial={testimonials[active].testimonial}
                    name={testimonials[active].name}
                    title={testimonials[active].title}
                    className="flex-1 max-w-md"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="flex gap-2 mt-4 justify-center items-center">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`
                    h-2.5 w-2.5 rounded-full 
                    ${i === active ? "bg-[#2852B4] scale-110" : "bg-[#D7DDF1]"}
                    transition-all
                  `}
                  style={{ transition: "background .2s, transform .2s" }}
                  onClick={() => handleDot(i)}
                  type="button"
                />
              ))}
            </div>
          </div>
        ) : (
          testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={cardVariants as any}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
              className="flex-1 max-w-md w-full"
            >
              <TestimonialCard
                testimonial={t.testimonial}
                name={t.name}
                title={t.title}
                className="flex-1 max-w-md"
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.section>
  );
}
