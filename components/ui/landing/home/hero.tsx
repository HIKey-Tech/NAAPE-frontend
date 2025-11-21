"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import {
    FaArrowRight,
    FaShieldAlt,
    FaRegClock,
    FaChalkboardTeacher,
    FaUserFriends,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { LegacyStatCard } from "@/components/ui/custom/legacy.card";

// Animation variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.09,
        },
    },
};

const leftVariants = {
    hidden: { opacity: 0, x: -36 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 65,
            damping: 12,
            duration: 0.5,
        },
    },
};

const rightVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 66,
            damping: 14,
            duration: 0.5,
        },
    },
};

const headingVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 12,
            duration: 0.44,
        },
    },
};

const paragraphVariants = {
    hidden: { opacity: 0, y: 18 },
    show: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.06, duration: 0.38 },
    },
};

const ctaVariants = {
    hidden: { opacity: 0, y: 14 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.12,
            duration: 0.32,
            type: "spring",
            stiffness: 60,
            damping: 13,
        },
    },
};

// Slideshow images
const IMAGES = [
    {
        src: "/images/event1.jpg",
        alt: "Nigerian pilots in cockpit",
    },
    {
        src: "/images/plane.jpg",
        alt: "Cockpit controls",
    },
    {
        src: "/images/loginpic.jpg",
        alt: "Nigerian aviation crew group photo",
    },
    {
        src: "/images/event2.jpg",
        alt: "Engineers at hangar",
    },
    {
        src: "/images/handplane.jpg",
        alt: "Aircraft parked on tarmac",
    },
];

const slideMotion = {
    initial: { opacity: 0, x: 56, scale: 0.96 },
    animate: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: { duration: 0.4, type: "spring", stiffness: 60, damping: 13 },
    },
    exit: {
        opacity: 0,
        x: -56,
        scale: 0.96,
        transition: { duration: 0.34 },
    },
};

// Stats section
const stats = [
    {
        value: "100%",
        label: (
            <>
                Safety <span className="hidden sm:inline">&amp;</span>
                <span className="inline sm:hidden">&amp;</span> Compliance Advocacy
            </>
        ),
        icon: <FaShieldAlt size={28} className="text-[#CA9414]" />,
    },
    {
        value: "39+",
        label: <>Years of Aviation Leadership</>,
        icon: <FaRegClock size={28} className="text-[#2347A0]" />,
    },
    {
        value: "50+",
        label: <>Training &amp; Development Programs</>,
        icon: <FaChalkboardTeacher size={28} className="text-[#3970D8]" />,
    },
    {
        value: "1200+",
        label: <>Pilots &amp; Engineers Represented</>,
        icon: <FaUserFriends size={28} className="text-[#2852B4]" />,
    },
];

export default function Hero() {
    const [current, setCurrent] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const AUTO_SLIDE_DELAY = 5000;

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(
            () => setCurrent((prev) => (prev + 1) % IMAGES.length),
            AUTO_SLIDE_DELAY
        );
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [current]);

    const goToSlide = useCallback((idx: number) => {
        setCurrent(idx);
    }, []);

    return (
        <section className="relative w-full h-screen min-h-screen flex flex-col md:flex-col items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-8 ">
            {/* Decorative aviation-themed background */}
            <div
                aria-hidden
                className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none"
            >
                <Image
                    src="/images/handplane.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-10 md:opacity-15"
                    priority
                    draggable={false}
                />
            </div>

            <motion.div
                className="relative z-10 flex px-2 sm:px-6 flex-col md:flex-row items-center w-full gap-4 md:gap-8 max-w-full mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Left: Headline & CTA */}
                <motion.div
                    className="flex-1 text-center md:text-left flex flex-col items-center md:items-start gap-6 md:gap-8"
                    variants={leftVariants as any}
                >
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#232835] leading-tight md:leading-[1.11]"
                        variants={headingVariants as any}
                    >
                        Empowering Nigeria&apos;s
                        <br />
                        <span className="text-[#2852B4]">Aviators and Engineers</span>
                    </motion.h1>
                    <motion.p
                        className="text-[#565C69] text-base md:text-lg max-w-lg md:max-w-xl"
                        variants={paragraphVariants}
                    >
                        NAAPE unites and elevates aircraft pilots and engineers across Nigeria—advocating standards, safety, and professional excellence for every member in our aviation community.
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-2 md:mt-4 w-full max-w-sm md:max-w-full items-center md:items-start"
                        variants={ctaVariants as any}
                    >
                        <Link href="/register" className="w-full sm:w-auto" aria-label="Join NAAPE">
                            <NaapButton
                                className="bg-[#2852B4] hover:bg-[#233672] w-full h-full sm:w-auto text-white text-base font-semibold px-7 py-3 shadow transition-colors"
                                icon={<FaArrowRight size={18} />}
                                iconPosition="right"
                            >
                                Join NAAPE
                            </NaapButton>
                        </Link>
                        <Link href="/about" className="w-full sm:w-auto" aria-label="Learn More about NAAPE">
                            <NaapButton
                                className="border-[#2852B4] h-full border text-[#2852B4] hover:bg-[#f7fafd] text-base font-semibold px-7 py-3 w-full sm:w-auto bg-transparent transition-colors"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right: Slideshow */}
                <motion.div
                    className="flex-1 flex w-full justify-center items-center"
                    variants={rightVariants as any}
                >
                    <div className="relative w-full h-fit flex items-center justify-center max-w-[420px] aspect-square">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={IMAGES[current].src}
                                className="rounded-2xl shadow-xl overflow-hidden border border-[#E6EAF1] bg-white w-full h-full flex items-center justify-center absolute inset-0"
                                initial={slideMotion.initial}
                                animate={slideMotion.animate as any}
                                exit={slideMotion.exit}
                            >
                                <Image
                                    src={IMAGES[current].src}
                                    alt={IMAGES[current].alt}
                                    width={420}
                                    height={420}
                                    className="object-cover w-full h-full"
                                    priority
                                    draggable={false}
                                />
                            </motion.div>
                        </AnimatePresence>
                        {/* Slideshow dots */}
                        <div className="absolute z-10 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {IMAGES.map((img, idx) => (
                                <button
                                    key={img.src}
                                    aria-label={`Show slide ${idx + 1}`}
                                    onClick={() => goToSlide(idx)}
                                    className={`w-full h-2.5 rounded-full border outline-none transition
                    ${idx === current
                                            ? "bg-[#2852B4] border-[#2852B4] shadow-lg scale-110"
                                            : "bg-white/80 border-[#CED6E0] hover:bg-[#e8f0ff] hover:scale-105"}`}
                                    tabIndex={0}
                                    type="button"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            {/* Stats Row (moved up for better mobile experience) */}
            <motion.div
                className="w-full flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-between mt-6"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {stats.map(({ icon, value, label }, idx) => (
                    <motion.div
                        key={idx}
                        variants={leftVariants as any}
                        whileHover={{ scale: 1.04, boxShadow: "0 8px 32px #2852B41a" }}
                    >
                        <LegacyStatCard
                            icon={icon}
                            value={value}
                            label={label}
                            className="flex-1 bg-white min-w-[150px] h-auto max-w-xs"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
