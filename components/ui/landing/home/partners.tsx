"use client"

import { motion } from "framer-motion";
import { FaRegGem, FaSearch, FaRocket, FaPalette, FaAdjust, FaWater } from "react-icons/fa";

const partners = [
  { name: "SHELLS", icon: FaRegGem },
  { name: "SmartFinder", icon: FaSearch },
  { name: "Zoomer", icon: FaRocket },
  { name: "ArtVenue", icon: FaPalette },
  { name: "kontrastr", icon: FaAdjust },
  { name: "WAVESMARATHON", icon: FaWater },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const partnerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function PartnersSection() {
  return (
    <section className="w-full bg-slate-50 border-y border-slate-200">
      <motion.div
        className="w-full max-w-7xl mx-auto py-16 px-6 flex flex-col items-center text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={containerVariants}
      >
        <span className="text-sm text-accent font-bold tracking-widest uppercase mb-3">
          Trusted By Industry Leaders
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
          Our Partners & Affiliations
        </h2>
        <p className="mb-12 max-w-2xl text-lg text-slate-600 font-medium">
          Collaborating with leading aviation bodies, government agencies, and global organizations to advance professional standards.
        </p>

        <motion.div
          className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 items-center justify-center opacity-70"
          variants={containerVariants}
        >
          {partners.map((partner) => {
            const IconComp = partner.icon;
            return (
              <motion.div
                key={partner.name}
                className="flex flex-col items-center gap-3 group cursor-default"
                variants={partnerVariants}
                whileHover={{ scale: 1.05, opacity: 1 }}
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:border-primary/20 group-hover:shadow-md transition-all duration-300">
                  <IconComp size={32} className="text-slate-400 group-hover:text-primary transition-colors duration-300" />
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-primary transition-colors">{partner.name}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
