"use client";

import Image from "next/image";
import { useEffect, useState, useRef, ReactNode, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NewsSlide = {
    src: string;
    alt: string;
    caption?: ReactNode;
    headline?: ReactNode;
    excerpt?: ReactNode;
    link?: string;
};

type NewsHeroSectionProps = {
    heading: ReactNode;
    subheading?: ReactNode;
    slides: NewsSlide[];
    intervalMs?: number;
    minHeightClass?: string;
    className?: string;
    children?: ReactNode;
    showArrows?: boolean;
    pauseOnHover?: boolean;
};

export default function NewsHeroSection({
    heading,
    subheading,
    slides,
    intervalMs = 4500,
    minHeightClass = "min-h-fit",
    className = "",
    children,
    showArrows = true,
    pauseOnHover = true,
}: NewsHeroSectionProps) {
    const [current, setCurrent] = useState(0);
    const prevIndex = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const total = slides.length;

    // Handle previous/next navigation robustly
    const goTo = useCallback(
        (idx: number) => setCurrent(((idx % total) + total) % total),
        [total]
    );
    const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
    const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

    // Slide direction logic for animation (left/right)
    useEffect(() => {
        prevIndex.current = current;
    }, [current]);

    // Slideshow auto-advance, respects pause (e.g., hover)
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

    // Support zero/one slide gracefully
    const hasMultipleSlides = total > 1;

    // Keyboard navigation: left/right arrow
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!hasMultipleSlides) return;
            if (e.key === "ArrowLeft") {
                goPrev();
            } else if (e.key === "ArrowRight") {
                goNext();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [hasMultipleSlides, goNext, goPrev]);

    // Pause on hover: adds accessibility for reading captions/presentations
    const handleMouseEnter = () => pauseOnHover && setIsPaused(true);
    const handleMouseLeave = () => pauseOnHover && setIsPaused(false);

    return (
        <section
            className={`w-full ${minHeightClass} bg-gradient-to-b from-[#f8fafc] to-white flex flex-col items-center pt-16 pb-12 px-4 md:px-8 ${className}`}
        >
            <div className="max-w-4xl w-full flex flex-col items-center text-center gap-5 mb-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a2236] leading-tight mb-2 drop-shadow-md">
                    {heading}
                </h1>
                {subheading && (
                    <p className="text-[#42425a] text-lg md:text-xl font-medium max-w-3xl mx-auto">{subheading}</p>
                )}
                {children}
            </div>
            <div className="w-full flex justify-center">
                <div
                    className="relative rounded-2xl h-72 md:h-96 overflow-hidden shadow-2xl w-full max-w-3xl border border-gray-200 bg-white group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    aria-roledescription="carousel"
                >
                    {/* Arrow navigation (improved accessibility) */}
                    {showArrows && hasMultipleSlides && (
                        <>
                            <button
                                aria-label="Previous slide"
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={goPrev}
                                tabIndex={0}
                                style={{ visibility: total < 2 ? "hidden" : undefined }}
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" className="text-[#357AA8]" fill="none">
                                    <path d="M13.5 16L9.5 11L13.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                            <button
                                aria-label="Next slide"
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 hover:bg-white/90 rounded-full p-2 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                                onClick={goNext}
                                tabIndex={0}
                                style={{ visibility: total < 2 ? "hidden" : undefined }}
                            >
                                <svg width="22" height="22" viewBox="0 0 22 22" className="text-[#357AA8]" fill="none">
                                    <path d="M8.5 6L12.5 11L8.5 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
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
                                    scale: 0.98,
                                }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    scale: 1,
                                    transition: { duration: 0.7, ease: [0.32, 0.72, 0, 1] },
                                }}
                                exit={{
                                    opacity: 0,
                                    x: direction < 0 ? 80 : direction > 0 ? -80 : 0,
                                    scale: 0.98,
                                    transition: { duration: 0.45, ease: [0.32, 0.72, 0, 1] },
                                }}
                                aria-hidden={false}
                            >
                                <Image
                                    src={slides[current].src}
                                    alt={slides[current].alt}
                                    fill
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105 group-active:scale-100"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 650px"
                                    draggable={false}
                                />
                                {(slides[current].caption || slides[current].headline || slides[current].excerpt) && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4"
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.13, duration: 0.5 } }}
                                        exit={{ opacity: 0, y: 40, transition: { duration: 0.28 } }}
                                    >
                                        {slides[current].headline && (
                                            <span className="block text-white text-xl md:text-2xl font-bold drop-shadow-lg mb-2">
                                                {slides[current].link ? (
                                                    <a href={slides[current].link} className="hover:underline" target="_blank" rel="noopener noreferrer">
                                                        {slides[current].headline}
                                                    </a>
                                                ) : (
                                                    slides[current].headline
                                                )}
                                            </span>
                                        )}
                                        {slides[current].excerpt && (
                                            <span className="block text-white text-sm md:text-base font-medium drop-shadow bubble">
                                                {slides[current].excerpt}
                                            </span>
                                        )}
                                        {slides[current].caption && (
                                            <span className="block text-gray-300 text-xs mt-2">{slides[current].caption}</span>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                    {/* Slide indicators */}
                    {hasMultipleSlides && (
                        <div className="absolute bottom-4 right-4 flex gap-2 z-20" aria-label="Slide indicators">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    aria-current={idx === current}
                                    className={`w-2.5 h-2.5 rounded-full ring-1 ring-white transition-all duration-300
                                        ${idx === current
                                            ? "scale-110 bg-[#357AA8] shadow-lg"
                                            : "bg-white/60 hover:bg-[#357AA8]/70"}
                                    `}
                                    onClick={() => setCurrent(idx)}
                                    tabIndex={0}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
