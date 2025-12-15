"use client"

import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

// Narrative micro animations for story/legacy
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.08,
    },
  },
};

const glowAnim = {
  rest: { boxShadow: "0 0 0px #fbc98600" },
  hover: {
    boxShadow: "0 0 36px 0px #fbc98644",
    transition: { duration: 0.45, type: "spring" },
  },
};

const h1MicroAnim = {
  rest: { scale: 1, color: "#211b12", letterSpacing: "0.015em" },
  hover: {
    scale: 1.03,
    color: "#af8958",
    letterSpacing: "0.05em",
    transition: { duration: 0.56, type: "spring", stiffness: 260, damping: 18 },
  },
};

const underlineAnim = {
  rest: { width: "0%" },
  hover: {
    width: "90%",
    transition: { duration: 0.7, type: "spring", stiffness: 60, damping: 18 }
  }
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 56,
      damping: 16,
      duration: 0.58,
    },
  },
};

const logoPulseAnim = {
  rest: { scale: 1, rotate: 0 },
  hover: {
    scale: [1, 1.04, 1],
    rotate: [-1, 1, 0],
    transition: { duration: 1.08, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
  },
  tap: { scale: 1.11, transition: { type: "spring", stiffness: 180, damping: 7 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 50 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 54,
      damping: 18,
      duration: 0.47,
      delay: 0.32,
    },
  },
};

const textMarkAnim = {
  rest: { backgroundColor: "rgba(0,0,0,0)" },
  hover: {
    backgroundColor: "#fbc98644",
    transition: { duration: 0.7, type: "spring" }
  }
};

const quoteAnim = {
  rest: { opacity: 1, scale: 1, rotate: 0 },
  hover: {
    opacity: 1,
    scale: 1.04,
    rotate: [-2, 2, 0],
    transition: { duration: 0.8, type: "spring" }
  }
};

export default function AboutHeroSection() {
  const [h1Hover, setH1Hover] = useState(false);

  return (
    <motion.section
      className="relative w-full min-h-screen bg-[#F6F4F1] flex flex-col items-center pt-16 pb-12 px-4 md:px-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      aria-label="About NAAPE Hero Section"
    >

      {/* Narrative animated headline */}
      <motion.div
        className="max-w-3xl w-full flex flex-col items-center text-center gap-6 mb-12"
        variants={fadeUpVariants as any}
      >
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-black text-[#211b12] uppercase tracking-tight leading-tight mb-3 relative"
          variants={fadeUpVariants as any}
          initial="rest"
          whileHover="hover"
          animate={h1Hover ? "hover" : "rest"}
          onHoverStart={() => setH1Hover(true)}
          onHoverEnd={() => setH1Hover(false)}
        >
          <motion.span variants={h1MicroAnim as any} transition={{ type: "spring" }} style={{ display: "inline-block" }}>
            Our Story: National Association of Aircraft Pilots &amp; Engineers
          </motion.span>
          {/* Micro-animated underline on hover */}
          <motion.span
            variants={underlineAnim as any}
            className="block h-1 rounded bg-[#af8958] absolute left-1/2 -translate-x-1/2 bottom-0"
            style={{ marginTop: "4px" }}
          />
        </motion.h1>
        {/* Animated history text */}
        <motion.p
          className="text-[#432d18] text-lg md:text-xl font-semibold max-w-2xl mx-auto leading-relaxed"
          variants={fadeUpVariants as any}
          transition={{ delay: 0.16 }}
          initial="rest"
          whileHover="hover"
        >
          Since our founding in 1980, NAAPE has united pilots and engineers dedicated to the advancement of Nigerian and African aviation.{" "}
          <motion.span
            className="font-bold text-[#23170d] px-1 rounded"
            variants={textMarkAnim as any}
          >Through decades of transformation</motion.span>
          , we have promoted safety, knowledge, and camaraderie—preserving our legacy while inspiring the next generation in the skies.
        </motion.p>
        {/* Ambitious keywords micro animation */}
        <motion.div
          className="flex flex-col items-center gap-2 mt-2"
          variants={fadeUpVariants as any}
          transition={{ delay: 0.19 }}
          initial="rest"
          whileHover="hover"
        >
          <motion.span
            className="uppercase text-xs md:text-sm text-[#816d4a] tracking-widest font-medium"
            variants={glowAnim as any}
          >
            Legacy &nbsp;·&nbsp; Unity &nbsp;·&nbsp; Progress
          </motion.span>
        </motion.div>
      </motion.div>

      {/* Logo with narrative micro animation */}
      <motion.div
        className="w-full flex justify-center mt-2"
        variants={fadeUpVariants as any}
        transition={{ delay: 0.28 }}
      >
        <motion.div
          className="relative rounded-lg border-2 border-[#af8958] bg-[#ebdfcd] h-64 md:h-80 w-full max-w-2xl flex items-center justify-center overflow-hidden"
          variants={imageVariants as any}
          initial="rest"
          whileHover="hover"
        >
          {/* Micro logo animation evokes history: a gentle loop pulse on hover */}
          <motion.div
            className="relative w-full flex justify-center items-center h-full"
            variants={logoPulseAnim as any}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src="/logo.png"
              alt="Historic NAAPE Logo"
              width={420}
              height={420}
              className="object-contain w-full h-3/4 opacity-90 sepia contrast-125"
              priority
              style={{
                filter: "grayscale(0.2) sepia(0.2) contrast(1.18)",
                mixBlendMode: "multiply",
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
      {/* Quotation gently animates as narrative punctuation */}
      <motion.div
        className="w-full flex justify-center pt-4"
        variants={fadeUpVariants as any}
        transition={{ delay: 0.34 }}
        initial="rest"
        whileHover="hover"
      >
        <motion.div
          className="max-w-2xl text-center"
          variants={quoteAnim as any}
        >
          <p className="text-[#7b6750] text-base md:text-lg font-medium italic">
            “We honor the pioneers and elevate today’s visionaries—safeguarding the journey of Nigerian aviation, together.”
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
