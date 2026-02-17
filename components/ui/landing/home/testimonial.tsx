"use client";

import { useEffect, useRef, useState } from "react";
import { TestimonialCard } from "@/components/ui/custom/testimonial.card";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";

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

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative w-full py-24 px-6 bg-slate-900 overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        {/* Left: Text */}
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-accent text-sm font-bold tracking-wider uppercase mb-6">
            <Quote size={14} className="fill-accent" />
            <span>Member Stories</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Voices of the <br /><span className="text-white">Aviation Community</span>
          </h2>
          <p className="text-lg text-slate-400 font-medium mb-8 max-w-xl mx-auto md:mx-0">
            Real stories from members whose passion for aviation found purpose, support, and growth through NAAPE.
          </p>

          <div className="flex gap-3 justify-center md:justify-start">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-3 rounded-full transition-all duration-300 ${active === i ? "w-12 bg-accent" : "w-3 bg-white/20 hover:bg-white/40"}`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: Card */}
        <div className="flex-1 w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <TestimonialCard
                testimonial={testimonials[active].testimonial}
                name={testimonials[active].name}
                title={testimonials[active].title}
                className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/20"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
