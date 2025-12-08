"use client";

import Image from "next/image";
import { useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type HeroSlide = {
    src: string;
    alt: string;
    caption?: ReactNode;
};

type CustomHeroSectionProps = {
    heading: ReactNode;
    subheading?: ReactNode;
    slides: HeroSlide[];
    intervalMs?: number;
    minHeightClass?: string;
    className?: string;
    children?: ReactNode;
    showArrows?: boolean;
    pauseOnHover?: boolean;
};

export default function CustomHeroSection({
    heading,
    subheading,
    slides,
    intervalMs = 4500,
    minHeightClass = "min-h-fit",
    className = "",
    children,
    showArrows = true,
    pauseOnHover = true,
}: CustomHeroSectionProps) {
    const [current, setCurrent] = useState(0);
    const prevIndex = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const total = slides.length;

    // Slide index utilities
    const goTo = useCallback(
        (idx: number) => setCurrent(((idx % total) + total) % total),
        [total]
    );
    const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
    const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Track slide direction (for animation)
    useEffect(() => {
        prevIndex.current = current;
    }, [current]);
    // Autoplay
    useEffect(() => {
        if (!total || isPaused) return;
        if (intervalRef.current) clearTimeout(intervalRef.current);
        intervalRef.current = setTimeout(() => {
            goNext();
        }, intervalMs);
        return () => {
            if (intervalRef.current) clearTimeout(intervalRef.current);
        };
    }, [current, total, isPaused, intervalMs, goNext]);

    const direction = (() => {
        if (current === prevIndex.current) return 0;
        if (current > prevIndex.current || (current === 0 && prevIndex.current === total - 1)) return 1;
        if (current < prevIndex.current || (current === total - 1 && prevIndex.current === 0)) return -1;
        return 1;
    })();

    const hasMultipleSlides = total > 1;

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!hasMultipleSlides) return;
            if (e.key === "ArrowLeft") goPrev();
            else if (e.key === "ArrowRight") goNext();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [hasMultipleSlides, goNext, goPrev]);

    const handleMouseEnter = () => pauseOnHover && setIsPaused(true);
    const handleMouseLeave = () => pauseOnHover && setIsPaused(false);

    // Microanimation - button tap
    const tap = { scale: 0.9 };

    return (
        <section
            className={`w-full ${minHeightClass} bg-white flex flex-col items-center pt-16 pb-12 px-4 md:px-8 ${className}`}
        >
            <div className="max-w-4xl w-full flex flex-col items-center text-center gap-6 mb-4">
                <motion.h1
                    className="text-3xl md:text-4xl lg:text-6xl font-black tracking-tight leading-tight mb-1 text-[#172043]"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.45, 1, 0.38, 1] }}
                >
                    {heading}
                </motion.h1>
                {subheading && (
                    <motion.p
                        className="text-[#224AA5] text-lg md:text-xl font-semibold max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.23, duration: 0.48, ease: [0.45, 1, 0.38, 1] }}
                    >
                        {subheading}
                    </motion.p>
                )}
                {children}
            </div>
            <div className="w-full flex justify-center">
                <div
                    className="relative rounded-2xl h-72 md:h-96 overflow-hidden w-full max-w-3xl border-2 border-[#172043] bg-white group transition-colors duration-300 focus-within:ring-2 focus-within:ring-[#224AA5]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    aria-roledescription="carousel"
                >
                    {/* Arrows */}
                    {showArrows && hasMultipleSlides && (
                        <>
                            <motion.button
                                aria-label="Previous slide"
                                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#224AA5] hover:text-white rounded-full p-2 border border-[#224AA5] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#224AA5]"
                                onClick={goPrev}
                                tabIndex={0}
                                whileTap={tap}
                                style={{ visibility: total < 2 ? "hidden" : undefined }}
                                whileHover={{ scale: 1.13 }}
                                aria-controls="hero-carousel"
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" className="stroke-[#224AA5] group-hover:stroke-white transition-colors duration-200" fill="none">
                                    <path d="M13.5 16L9.5 11L13.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </motion.button>
                            <motion.button
                                aria-label="Next slide"
                                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-[#224AA5] hover:text-white rounded-full p-2 border border-[#224AA5] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#224AA5]"
                                onClick={goNext}
                                tabIndex={0}
                                whileTap={tap}
                                style={{ visibility: total < 2 ? "hidden" : undefined }}
                                whileHover={{ scale: 1.13 }}
                                aria-controls="hero-carousel"
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" className="stroke-[#224AA5] group-hover:stroke-white transition-colors duration-200" fill="none">
                                    <path d="M8.5 6L12.5 11L8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </motion.button>
                        </>
                    )}

                    {slides.length > 0 && (
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={slides[current].src}
                                className="absolute inset-0 w-full h-full"
                                initial={{
                                    opacity: 0,
                                    x: direction > 0 ? 80 : direction < 0 ? -80 : 0,
                                    scale: 0.96,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    transition: { duration: 0.6, ease: [0.38, 0.8, 0, 1] },
                                }}
                                exit={{
                                    opacity: 0,
                                    x: direction < 0 ? 80 : direction > 0 ? -80 : 0,
                                    scale: 0.96,
                                    transition: { duration: 0.36, ease: [0.32, 0.72, 0, 1] },
                                }}
                                aria-hidden={false}
                            >
                                <Image
                                    src={slides[current].src}
                                    alt={slides[current].alt}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 650px"
                                    draggable={false}
                                />
                                {slides[current].caption && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full p-4 bg-white/95 border-t-2 border-[#224AA5]"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.13, duration: 0.38 } }}
                                        exit={{ opacity: 0, y: 30, transition: { duration: 0.21 } }}
                                    >
                                        <span className="text-[#172043] text-base md:text-lg font-bold">
                                            {slides[current].caption}
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* Slide indicators */}
                    {hasMultipleSlides && (
                        <motion.div
                            className="absolute bottom-3 right-4 flex gap-2 z-20"
                            aria-label="Slide indicators"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.35 }}
                        >
                            {slides.map((_, idx) => (
                                <motion.button
                                    key={idx}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    aria-current={idx === current}
                                    className={`w-3 h-3 rounded-full border-2 duration-200 transition-all outline-none
                                        ${idx === current
                                            ? "bg-[#224AA5] border-[#224AA5] scale-125"
                                            : "bg-white border-[#224AA5] hover:bg-[#e1e7fa] scale-100"}
                                    `}
                                    onClick={() => setCurrent(idx)}
                                    tabIndex={0}
                                    whileHover={{ scale: 1.18 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
