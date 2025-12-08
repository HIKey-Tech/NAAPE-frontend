"use client"

import { motion, useAnimation } from "framer-motion";
import { useRef } from "react";
// Example chosen icons from react-icons (adjust as needed for your actual use-cases/partners)
import { FaRegGem, FaSearch, FaRocket, FaPalette, FaAdjust, FaWater } from "react-icons/fa";

const partners = [
  {
    name: "SHELLS",
    icon: FaRegGem,
  },
  {
    name: "SmartFinder",
    icon: FaSearch,
  },
  {
    name: "Zoomer",
    icon: FaRocket,
  },
  {
    name: "ArtVenue",
    icon: FaPalette,
  },
  {
    name: "kontrastr",
    icon: FaAdjust,
  },
  {
    name: "WAVESMARATHON",
    icon: FaWater,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const partnerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 12 } },
};

// Additional: micro animation for icon (wiggle/bounce/scale) on hover
const iconMicroAnim = {
  rest: { rotate: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 15 } },
  hover: { 
    scale: 1.14,
    rotate: [0, -10, 10, -5, 5, 0], 
    transition: { duration: 0.4, type: "spring" }
  },
  tap: { scale: 0.93, rotate: 0 }
};

export default function PartnersSection() {
  return (
    <motion.section
      className="w-full max-w-screen-xl mx-auto py-14 px-6 flex flex-col items-center text-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ staggerChildren: 0.15 }}
    >
      <motion.span
        className="text-xs md:text-sm text-primary font-semibold tracking-widest uppercase mb-2"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
      >
        YOU ARE IN GOOD COMPANY
      </motion.span>
      <motion.h2
        className="text-2xl md:text-3xl font-extrabold text-foreground mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
      >
        Our Partners & Affiliations
      </motion.h2>
      <motion.p
        className="mb-7 md:mb-10 max-w-2xl text-xs md:text-sm text-foreground/80"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
      >
        We collaborate with leading aviation bodies, government agencies, and global organizations to advance professional standards and promote the growth of the aviation industry.
      </motion.p>
      <motion.div
        className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-6 gap-y-6 items-center justify-center"
        variants={containerVariants}
      >
        {partners.map((partner) => {
          const IconComp = partner.icon;
          return (
            <motion.div
              key={partner.name}
              className="flex flex-col items-center"
              variants={partnerVariants as any}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 70 }}
            >
              <motion.div
                className="mb-1"
                variants={undefined}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                animate="rest"
              >
                <motion.div variants={iconMicroAnim as any}>
                  <IconComp
                    size={48}
                    className="text-primary/80 grayscale hover:grayscale-0 transition"
                    aria-label={partner.name}
                  />
                </motion.div>
              </motion.div>
              <span className="text-xs text-muted-foreground font-medium">{partner.name}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
