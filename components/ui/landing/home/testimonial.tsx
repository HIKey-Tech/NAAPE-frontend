"use client";

import { TestimonialCard } from "@/components/ui/custom/testimonial.card";

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
  return (
    <section className="relative w-full max-w-screen-xl mx-auto py-16 px-4 flex flex-col items-center">
      <span className="text-xs md:text-sm text-[#CA9414] font-semibold tracking-widest uppercase mb-2 text-center">
        TESTIMONIALS
      </span>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-3 text-center">
        Real stories from members whose passion for aviation found<br className="hidden md:inline" /> purpose, support, and growth through NAAPE
      </h2>
      <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-center mt-10">
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            testimonial={t.testimonial}
            name={t.name}
            title={t.title}
            className="flex-1 max-w-md"
          />
        ))}
      </div>
    </section>
  );
}
