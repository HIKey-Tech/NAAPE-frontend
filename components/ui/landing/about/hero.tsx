"use client"

import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.20,
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

export default function AboutHeroSection() {
  return (
    <motion.section
      className="w-full h-screen bg-white flex flex-col items-center pt-12 pb-10 px-4 md:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="max-w-full w-full flex flex-col items-center text-center gap-4 mb-8"
        variants={fadeUpVariants as any}
      >
        <motion.h1
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#232835] leading-tight mb-2"
          variants={fadeUpVariants as any}
        >
          About the National Association of <br className="hidden md:block" />
          Aircraft Pilots &amp; Engineers
        </motion.h1>
        <motion.p
          className="text-[#4B4B55] text-base md:text-lg font-medium max-w-2xl mx-auto"
          variants={fadeUpVariants as any}
          transition={{ delay: 0.16 }}
        >
          Championing the legacy and future of aviation professionals with an unwavering commitment to safety, advocacy and excellence.
        </motion.p>
      </motion.div>
      <motion.div
        className="w-full px-10 flex justify-center"
        variants={fadeUpVariants as any}
        transition={{ delay: 0.26 }}
      >
        <motion.div
          className="relative rounded-xl h-full overflow-hidden shadow-xl w-full max-w-full"
          variants={imageVariants as any}
        >
          <Image
            src="/logo.png"
            alt="NAAPE Logo"
            width={650}
            height={650}
            className="object-cover w-full h-full md:h-80"
            priority
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

