"use client"

import Image from "next/image";
import { motion } from "framer-motion";

const partners = [
  {
    name: "SHELLS",
    logo: "/images/partners/shells.svg",
  },
  {
    name: "SmartFinder",
    logo: "/images/partners/smartfinder.svg",
  },
  {
    name: "Zoomer",
    logo: "/images/partners/zoomer.svg",
  },
  {
    name: "ArtVenue",
    logo: "/images/partners/artvenue.svg",
  },
  {
    name: "kontrastr",
    logo: "/images/partners/kontrastr.svg",
  },
  {
    name: "WAVESMARATHON",
    logo: "/images/partners/wavesmarathon.svg",
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
        {partners.map((partner, idx) => (
          <motion.div
            key={partner.name}
            className="flex flex-col items-center"
            variants={partnerVariants as any}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 70 }}
          >
            <div className="mb-1">
              <Image
                src={partner.logo}
                alt={partner.name}
                width={60}
                height={40}
                className="object-contain grayscale hover:grayscale-0 transition"
              />
            </div>
            <span className="text-xs text-muted-foreground font-medium">{partner.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
