"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 40, delay: 0.2 } },
};

export default function AboutHeroSection() {
  return (
    <motion.section
      className="relative w-full min-h-[85vh] flex flex-col items-center justify-center py-20 px-6 bg-[#f8fafc] overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Background Elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <motion.div className="z-10 text-center max-w-4xl mx-auto mb-16" variants={fadeUpVariants as any}>
        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
          The National Association of <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
            Aircraft Pilots & Engineers
          </span>
        </h1>
        <div className="w-24 h-1.5 bg-accent rounded-full mx-auto mb-8" />
        <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto">
          Since 1980, we have united professionals dedicated to the advancement of Nigerian and African aviation.
          <span className="text-slate-900 font-bold block mt-2">Legacy · Unity · Progress</span>
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-5xl mx-auto relative z-10"
        variants={imageVariants as any}
      >
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/50">
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply z-10" />
          <Image
            src="/images/plane.jpg"
            alt="Aviation History"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Quote */}
          <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20 text-center">
            <p className="text-white text-lg md:text-2xl font-serif italic max-w-3xl mx-auto">
              “We honor the pioneers and elevate today’s visionaries—safeguarding the journey of Nigerian aviation, together.”
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}
