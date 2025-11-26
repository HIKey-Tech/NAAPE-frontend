"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type SubHeroSectionProps = {
  heading: ReactNode;
  subheading?: ReactNode;
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  containerClassName?: string;
  textClassName?: string;
  imageClassName?: string;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
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
      damping: 17,
      duration: 0.55,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 55,
      damping: 15,
      duration: 0.5,
      delay: 0.32,
    },
  },
};

/**
 * Layout rearranged:
 * - On desktop: side-by-side, image on left, text on right.
 * - On mobile: stacked, image on top, text below.
 */
export default function SubHeroSection({
  heading,
  subheading,
  imageSrc,
  imageAlt,
  imageWidth = 650,
  imageHeight = 650,
  containerClassName = "w-full min-h-screen bg-white flex flex-col md:flex-row items-center justify-center pt-12 pb-10 px-4 md:px-6",
  textClassName = "max-w-full w-full flex flex-col items-center md:items-start text-center md:text-left gap-4 mb-8 md:mb-0 md:pl-10",
  imageClassName = "object-cover w-full h-full md:h-80",
}: SubHeroSectionProps) {
  return (
    <motion.section
      className={containerClassName}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Image first on desktop, first on mobile */}
      <motion.div
        className="w-full md:w-1/2 flex justify-center md:justify-end mb-6 md:mb-0 px-0 md:px-10"
        variants={fadeUpVariants as any}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="relative rounded-xl h-full overflow-hidden shadow-xl w-full max-w-full"
          variants={imageVariants as any}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className={imageClassName}
            priority
          />
        </motion.div>
      </motion.div>
      {/* Text second on desktop, below image on mobile */}
      <motion.div
        className={`w-full md:w-1/2 flex flex-col justify-center ${textClassName}`}
        variants={fadeUpVariants as any}
      >
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#232835] leading-tight mb-2"
          variants={fadeUpVariants as any}
        >
          {heading}
        </motion.h1>
        {subheading && (
          <motion.p
            className="text-[#4B4B55] text-base md:text-lg font-medium max-w-2xl mx-auto md:mx-0"
            variants={fadeUpVariants as any}
            transition={{ delay: 0.16 }}
          >
            {subheading}
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
}
