"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const partners = [
  { name: "Federal Republic of Nigeria", src: "/images/partners/nigeria-coa.png" },
  { name: "NAAPE", src: "/logo.png" },
  { name: "Air Peace", src: "/images/partners/air-peace-logo.png" },
  { name: "Arik Air", src: "/images/partners/Arik-Air-Logo.jpg" },
  { name: "Ibom Air", src: "/images/partners/Ibom_air_Logo.png" },
];

export default function PartnersSection() {
  return (
    <section className="w-full bg-slate-50 border-y border-slate-200 py-16 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center mb-12">
        <span className="text-sm text-accent font-bold tracking-widest uppercase mb-3">
          Trusted By Industry Leaders
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
          Our Partners & Affiliations
        </h2>
        <p className="max-w-2xl text-lg text-slate-600 font-medium">
          Collaborating with leading aviation bodies, government agencies, and global organizations to advance professional standards.
        </p>
      </div>

      <div className="w-full overflow-hidden flex relative mask-gradient">
        <motion.div
          className="flex gap-16 items-center flex-nowrap pl-16"
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
          style={{ width: "fit-content" }}
        >
          {/* Duplicate the list to ensure seamless infinite scroll */}
          {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((partner, idx) => (
            <div key={idx} className="relative w-32 h-24 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center justify-center">
              <Image
                src={partner.src}
                alt={partner.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Gradient Mask for fading edges (optional but looks premium) */}
      <style jsx>{`
        .mask-gradient {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </section>
  );
}
