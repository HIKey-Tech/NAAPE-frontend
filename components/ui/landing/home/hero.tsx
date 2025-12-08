"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import {
    FaArrowRight,
    FaShieldAlt,
    FaRegClock,
    FaChalkboardTeacher,
    FaUserFriends,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { LegacyStatCard } from "@/components/ui/custom/legacy.card";

// --- Ultra-Stable Typewriter Effect Hook ---
function useTypewriter(
    text: string,
    options: {
        speed?: number; // time between characters (ms)
        punctuationPause?: number; // extra pause after punctuation
        onDone?: () => void;
    } = {}
) {
    const { speed = 28, punctuationPause = 320, onDone } = options;

    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    const frameRef = useRef(0);
    const lastTimeRef = useRef(0);
    const iRef = useRef(0);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        iRef.current = 0;
        frameRef.current = 0;
        lastTimeRef.current = performance.now();

        const loop = (now: number) => {
            if (iRef.current >= text.length) {
                setDone(true);
                if (onDone) onDone();
                return;
            }

            const dt = now - lastTimeRef.current;

            // Only advance character after enough time passes
            if (dt >= speed) {
                const char = text[iRef.current];

                setDisplayed((prev) => prev + char);
                iRef.current++;
                lastTimeRef.current = now;

                // Punctuation smart pause
                if ([",", ".", "!", "?", ";", ":"].includes(char)) {
                    lastTimeRef.current += punctuationPause;
                }
            }

            frameRef.current = requestAnimationFrame(loop);
        };

        frameRef.current = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(frameRef.current);
    }, [text, speed, punctuationPause]);

    return { displayed, done };
}

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

// Gallery images (remove slider, modern grid gallery)
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
        icon: (
            <FaShieldAlt size={28} className="text-[#CA9414] dark:text-[#CA9414]" />
        ),
    },
    {
        value: "39+",
        label: <>Years of Aviation Leadership</>,
        icon: (
            <FaRegClock size={28} className="text-primary" />
        ),
    },
    {
        value: "50+",
        label: <>Training &amp; Development Programs</>,
        icon: (
            <FaChalkboardTeacher size={28} className="text-[#3970D8]" />
        ),
    },
    {
        value: "1200+",
        label: <>Pilots &amp; Engineers Represented</>,
        icon: (
            <FaUserFriends size={28} className="text-primary" />
        ),
    },
];

// The string to type out
const heroTypewriteText =
    "NAAPE unites and elevates aircraft pilots and engineers across Nigeria—advocating standards, safety, and professional excellence for every member in our aviation community.";

export default function Hero() {
    const [showCursor, setShowCursor] = useState(true);

    // Flashing cursor interval (pauses when finished typing)
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (showCursor) {
            interval = setInterval(() => {
                setShowCursor((v) => !v);
            }, 540);
        }
        return () => {
            if (interval) clearInterval(interval);
            setShowCursor(true);
        };
    }, [showCursor]);

    const { displayed, done } = useTypewriter(heroTypewriteText, {
        speed: 32,
        punctuationPause: 260,
        onDone: () => setShowCursor(false),
    });

    // For accessibility: expose the full sentence after typing for screen readers
    const [srText, setSrText] = useState("");
    useEffect(() => {
        if (done) setSrText(heroTypewriteText);
        else setSrText("");
    }, [done]);

    // Optionally, visually split the sentence if needed for emphasis
    return (
        <section className="relative w-full h-full min-h-full flex flex-col md:flex-col items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] dark:from-[#232835] dark:to-[#2f3650] overflow-hidden px-4 py-8 ">
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
                    className="flex-1 text-center md:text-left flex flex-col items-center md:items-start gap-4 md:gap-8"
                    variants={leftVariants as any}
                >
                    <motion.h1
                        className="text-[2.45rem] sm:text-4xl md:text-[2.8rem] lg:text-[3.3rem] font-extrabold tracking-tight text-[#232835] dark:text-white leading-tight md:leading-[1.08] mb-1"
                        variants={headingVariants as any}
                    >
                        <span>The National Association of Aircraft Pilots &amp; Engineers</span>
                    </motion.h1>

                    <motion.p
                        className="text-[#3B4360] dark:text-[#BDC4D7] text-[1.13rem] md:text-lg max-w-lg md:max-w-xl min-h-[3.8em] md:min-h-[2.7em] font-medium tracking-[0.005em] whitespace-pre-line"
                        variants={paragraphVariants}
                        aria-live="polite"
                    >
                        <span aria-hidden="true">
                            {displayed}
                            <span className="inline-block align-baseline w-4" aria-hidden>
                                {!done && showCursor && (
                                    <span
                                        className="ml-0.5 animate-blink font-mono text-[#232835] dark:text-white"
                                        style={{
                                            fontWeight: "bold",
                                            letterSpacing: "0.01em",
                                            opacity: 0.70,
                                            fontSize: "1.04em",
                                            position: "relative",
                                            top: "1px",
                                        }}
                                    >
                                        |
                                    </span>
                                )}
                            </span>
                        </span>
                        {done && (
                            <span className="sr-only">{srText}</span>
                        )}
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-2 md:mt-6 w-full max-w-sm md:max-w-full items-center md:items-start"
                        variants={ctaVariants as any}
                    >
                        <Link href="/membership" className="w-full sm:w-auto" aria-label="Join NAAPE">
                            <NaapButton
                                className="bg-primary hover:bg-primary/90 w-full h-full sm:w-auto text-white text-base font-semibold px-7 py-3 transition-colors rounded-full"
                                icon={<FaArrowRight size={18} />}
                                iconPosition="right"
                            >
                                Join NAAPE
                            </NaapButton>
                        </Link>
                        <Link href="/about-us" className="w-full sm:w-auto" aria-label="Learn More about NAAPE">
                            <NaapButton
                                className="border border-primary h-full text-primary hover:bg-primary/10 text-base font-semibold px-7 py-3 w-full sm:w-auto bg-transparent transition-colors rounded-full"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right: Modern Image Gallery */}
                <motion.div
                    className="flex-1 flex w-full justify-center items-center"
                    variants={rightVariants as any}
                >
                    <div className="relative w-full flex items-center justify-center max-w-[550px] aspect-square pt-3 pb-3">
                        <motion.div
                            className="grid grid-cols-2 grid-rows-3 gap-5 w-full h-full rounded-2xl overflow-hidden"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, type: "spring", stiffness: 70, damping: 15 }}
                        >
                            {IMAGES.map((img, idx) => (
                                <div
                                    key={img.src}
                                    className={`
                                        ${idx === 0
                                            ? "row-span-2 col-span-1"
                                            : idx === 1
                                                ? "col-span-1 row-span-1"
                                                : idx === 2
                                                    ? "col-span-1 row-span-2"
                                                    : "col-span-1 row-span-1"}
                                        relative rounded-xl overflow-hidden transition-[transform,box-shadow] duration-300 group border border-gray-300 dark:border-[#232C4F]
                                    `}
                                    style={
                                        idx === 0 || idx === 2
                                            ? { minHeight: "190px", minWidth: "0" }
                                            : { minHeight: "110px", minWidth: "0" }
                                    }
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className="object-cover object-center group-hover:scale-[1.035] transition-transform duration-300"
                                        draggable={false}
                                        sizes="(max-width: 550px) 100vw, 550px"
                                    />
                                    <span className="absolute left-0 bottom-0 w-full h-16 bg-gradient-to-t from-[#213765ad] to-transparent pointer-events-none"></span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
            {/* Stats Row (moved up for better mobile experience) */}
            <motion.div
                className="w-full flex flex-col sm:flex-row gap-4 md:gap-6 justify-center md:justify-between mt-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {stats.map(({ icon, value, label }, idx) => (
                    <motion.div
                        key={idx}
                        variants={leftVariants as any}
                        whileHover={{ scale: 1.04 }}
                        className="flex-1"
                    >
                        <LegacyStatCard
                            icon={icon}
                            value={value}
                            label={
                                <span className="text-[1.03rem] md:text-base text-[#5E6792] dark:text-[#C1C8DC] font-semibold">
                                    {label}
                                </span>
                            }
                            className="flex-1 bg-white min-w-[150px] h-auto max-w-xs rounded-xl border border-gray-200 dark:border-[#252c45] px-6 py-6 flex flex-col items-center"
                        />
                    </motion.div>
                ))}
            </motion.div>
            <style jsx global>{`
                @keyframes blink {
                    0%, 100% {
                        opacity: 0.70;
                    }
                    50% {
                        opacity: 0;
                    }
                }
                .animate-blink {
                    animation: blink 1.14s steps(2, start) infinite;
                }
            `}</style>
        </section>
    );
}
