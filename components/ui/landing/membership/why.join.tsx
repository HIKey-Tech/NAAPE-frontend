"use client"

import { useState, useRef, useEffect } from "react";
import { FaHandshake, FaLayerGroup } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi2";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// Use palette and CSS vars for consistent styling
const PRIMARY = "var(--primary, #2852B4)";
const BG_CARD = "bg-white";
const TEXT_DARK = "#1A2340";
const TEXT_LIGHT = "#f7fafc";
const HIGHLIGHT = "#42A5F5";
const BORDER_CARD = "border border-[#c8d6e6]";
const ICON_CIRCLE = "bg-[var(--primary-foreground,#f7fafc)]";
const ICON_COLOR = PRIMARY;

const CARD_DATA = [
    {
        icon: <FaHandshake size={28} color={ICON_COLOR} />,
        title: "Vibrant Community",
        description:
            "Belong to a strong, collaborative network of Nigerian pilots and engineers sharing a passion for safety, growth, and advancement.",
    },
    {
        icon: <HiOutlineLightBulb size={28} color={ICON_COLOR} />,
        title: "Professional Growth",
        description:
            "Access members-only networking events, industry advocacy, leadership development, and career resources.",
    },
    {
        icon: <FaLayerGroup size={28} color={ICON_COLOR} />,
        title: "Membership for Every Stage",
        description:
            "Whether you’re a Student, Associate, or Full Member, our tailored tiers support every step of your aviation career.",
    },
];

// Framer Motion animation variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.19,
            delayChildren: 0.14,
        },
    },
};

const cardVariants = {
    enter: { opacity: 0, y: 48, scale: 0.97 },
    center: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 18,
            duration: 0.5,
        }
    },
    exit: { opacity: 0, y: -42, scale: 0.985, transition: { duration: 0.3 } },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.12, duration: 0.6, type: "spring", stiffness: 60 },
    },
};

export default function WhyJoinSection() {
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Automatic slide logic
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % CARD_DATA.length);
        }, 3700);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Manual control (for dot navigation)
    const handleDot = (idx: number) => {
        setActive(idx);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActive((a) => (a + 1) % CARD_DATA.length);
            }, 3700);
        }
    };

    return (
        <section className="relative w-full bg-[#222836] py-20 px-4 flex items-center justify-center overflow-hidden">
            {/* Subtle background image & overlay */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/plane.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-10"
                    priority={false}
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[#222836] opacity-70"
                    style={{ mixBlendMode: "multiply" }}
                />
            </div>
            <motion.div
                className="relative z-10 mx-auto w-full max-w-6xl flex flex-col items-center"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.36 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-black text-white text-center mb-3 tracking-tight"
                    style={{
                        letterSpacing: "-0.025em",
                        lineHeight: 1.16,
                    }}
                    variants={fadeUpVariants as any}
                >
                    Why Join{" "}
                    <span className="text-[#42A5F5] underline underline-offset-4">NAAPE?</span>
                </motion.h2>
                <motion.p
                    className="text-[#c2d1ed] text-base md:text-lg max-w-2xl text-center mb-10 mx-auto font-medium"
                    style={{
                        lineHeight: 1.6,
                    }}
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.22, duration: 0.6, type: "spring" }}
                >
                    Join Nigeria’s premier organization for aviation professionals. <br className="hidden md:inline"/>Membership with NAAPE connects you to a powerful community, unlocks exclusive opportunities, and supports your journey from student to leader.
                </motion.p>
                {/* Mobile: Slideshow */}
                <div className="w-full flex flex-col items-center md:hidden">
                    <div className="w-full flex justify-center mb-3" style={{ minHeight: 270 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                variants={cardVariants as any}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className={`flex-1 w-full ${BG_CARD} rounded-xl px-7 py-7 max-w-xs flex flex-col items-center text-center gap-3 ${BORDER_CARD}`}
                                style={{
                                    background: "#fff",
                                    boxShadow: "none",
                                }}
                            >
                                <span
                                    className={`${ICON_CIRCLE} rounded-full p-3 mb-0 border-2`}
                                    style={{
                                        borderColor: PRIMARY,
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {CARD_DATA[active].icon}
                                </span>
                                <div className="font-bold text-lg md:text-xl" style={{ color: TEXT_DARK, letterSpacing: "-0.01em" }}>
                                    {CARD_DATA[active].title}
                                </div>
                                <div className="text-[#476099] text-base font-medium" style={{ lineHeight: 1.55 }}>
                                    {CARD_DATA[active].description}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex gap-2 mt-1 justify-center items-center">
                        {CARD_DATA.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to card ${i + 1}`}
                                className={`
                                    h-2.5 w-2.5 rounded-full border
                                    ${i === active ? "bg-[#2852B4] border-[#2852B4] scale-110" : "bg-white border-[#c8d6e6]"}
                                    transition-all
                                `}
                                style={{ transition: "background .2s, transform .2s, border .2s" }}
                                onClick={() => handleDot(i)}
                                type="button"
                            />
                        ))}
                    </div>
                </div>
                {/* Desktop: Show all cards */}
                <motion.div
                    className="w-full hidden md:flex flex-row md:items-stretch gap-7 justify-center items-center"
                    variants={containerVariants}
                >
                    {CARD_DATA.map((card, idx) => (
                        <motion.div
                            key={card.title}
                            className={`flex-1 w-full ${BG_CARD} rounded-xl px-7 py-8 max-w-xs flex flex-col items-center text-center gap-3 ${BORDER_CARD}`}
                            variants={cardVariants as any}
                            whileHover={{
                                scale: 1.033,
                                borderColor: HIGHLIGHT,
                                // No boxShadow
                            }}
                            transition={{ type: "spring", stiffness: 250, damping: 19 }}
                            style={{
                                background: "#fff",
                                boxShadow: "none",
                                border: "1.5px solid #c8d6e6",
                                transition: "border-color .2s, transform .18s",
                            }}
                        >
                            <span
                                className={`${ICON_CIRCLE} rounded-full p-3 mb-0 border-2`}
                                style={{
                                    borderColor: PRIMARY,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {card.icon}
                            </span>
                            <div className="font-bold text-lg md:text-xl" style={{ color: TEXT_DARK, letterSpacing: "-0.01em" }}>
                                {card.title}
                            </div>
                            <div className="text-[#476099] text-base font-medium" style={{ lineHeight: 1.55 }}>
                                {card.description}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
