"use client";

import { motion } from "framer-motion";

export default function GalleryHeroSection() {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center pt-24 pb-12 overflow-hidden bg-slate-900">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 w-full h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/plane.jpg"
                    alt="Airplane at sunset"
                    className="w-full h-full object-cover opacity-40 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-background" />
            </div>

            <div className="relative z-10 max-w-4xl w-full px-4 text-center flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.38, 0, 0.24, 1] }}
                    className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-xl"
                >
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-white text-sm font-semibold tracking-widest uppercase">
                        The Visual Story
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.7, ease: [0.38, 0, 0.24, 1] }}
                    className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 drop-shadow-lg"
                >
                    NAAPE Media Gallery
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: [0.38, 0, 0.24, 1] }}
                    className="text-lg md:text-2xl text-slate-200 font-medium max-w-2xl drop-shadow-md leading-relaxed"
                >
                    Dive into our curated collection of memorable events, vibrant moments, and inspiring stories from our members.
                </motion.p>
            </div>
        </section>
    );
}
