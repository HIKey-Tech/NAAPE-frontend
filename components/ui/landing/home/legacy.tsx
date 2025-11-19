"use client";

import React from "react";
import { LegacyStatCard } from "@/components/ui/custom/legacy.card";
import {
    FaShieldAlt,
    FaRegClock,
    FaChalkboardTeacher,
    FaUserFriends,
} from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 66, damping: 15, duration: 0.54 } }
};

const statVariants = {
    hidden: { opacity: 0, y: 36, scale: 0.93 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            delay: i * 0.10 + 0.25,
            type: "spring",
            stiffness: 70,
            damping: 17,
            duration: 0.48,
        }
    }),
};

// --- LegacyMobileSlider START ---
function LegacyMobileSlider({ stats }: { stats: any[] }) {
    const [active, setActive] = React.useState(0);

    const goPrev = () => setActive((a) => (a - 1 + stats.length) % stats.length);
    const goNext = () => setActive((a) => (a + 1) % stats.length);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full flex items-center justify-center">
                <button
                    aria-label="Previous"
                    className="mr-3 p-2 rounded-full bg-[#F5F6FB] hover:bg-[#ececef] text-[#2852B4] disabled:opacity-50"
                    onClick={goPrev}
                    disabled={stats.length < 2}
                    type="button"
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="flex-1 w-full">
                    <motion.div
                        key={active}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ type: "spring", duration: 0.35 }}
                    >
                        <LegacyStatCard
                            {...stats[active]}
                            className="w-full"
                        />
                    </motion.div>
                </div>
                <button
                    aria-label="Next"
                    className="ml-3 p-2 rounded-full bg-[#F5F6FB] hover:bg-[#ececef] text-[#2852B4] disabled:opacity-50"
                    onClick={goNext}
                    disabled={stats.length < 2}
                    type="button"
                >
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <div className="flex gap-1 justify-center mt-3">
                {stats.map((_s, i) => (
                    <button
                        aria-label={`Go to slide ${i + 1}`}
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${i === active
                                ? 'bg-[#2852B4] scale-110'
                                : 'bg-[#D7DDF1]'
                            }`}
                        style={{ transition: "background .2s, transform .2s" }}
                        onClick={() => setActive(i)}
                        type="button"
                    />
                ))}
            </div>
        </div>
    );
}
// --- LegacyMobileSlider END ---

export default function OurLegacy() {
    const stats = [
        {
            value: "100%",
            label: <>Safety &amp; Compliance Advocacy</>,
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

    return (
        <motion.section
            className="w-full bg-white md:px-0 flex flex-col items-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
        >
            <motion.div
                className="w-full px-6 py-10 max-w-full mx-auto flex flex-col items-center text-center gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
            >
                <motion.span
                    className="text-[#CA9414] font-semibold text-sm tracking-widest mb-2"
                    variants={fadeUpVariants as any}
                >
                    OUR LEGACY
                </motion.span>
                <motion.h2
                    className="text-2xl md:text-3xl font-bold text-[#232835] mb-2"
                    variants={fadeUpVariants as any}
                >
                    Building a Legacy That Soars
                </motion.h2>
                <motion.p
                    className="text-[#4B4B55] max-w-2xl text-base md:text-lg mb-6"
                    variants={fadeUpVariants as any}
                >
                    Born from the merger of two pioneering aviation groups in 1984, NAAPE represents a legacy of unity, professionalism, and service.
                </motion.p>
                {/* The outer grid now ensures full width */}
                <motion.div
                    className="w-full"
                    variants={containerVariants}
                >
                    {/* Responsive: Slideshow (Swiper) on mobile, grid otherwise */}
                    <div className="w-full">
                        <div className="block md:hidden w-full">
                            {/* Mobile Slideshow */}
                            <div className="relative w-full">
                                <input type="checkbox" id="legacy-prev" className="hidden peer/prev" />
                                <input type="checkbox" id="legacy-next" className="hidden peer/next" />
                                {/* Carousel-like logic without external deps */}
                                <LegacyMobileSlider stats={stats} />
                            </div>
                        </div>
                        <motion.div
                            className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full mt-4"
                            variants={containerVariants}
                            style={{ width: "100%" }}
                        >
                            {stats.map(({ value, label, icon }, idx) => (
                                <motion.div
                                    key={idx}
                                    custom={idx}
                                    variants={statVariants as any}
                                    className="w-full"
                                >
                                    <LegacyStatCard
                                        value={value}
                                        label={label}
                                        icon={icon}
                                        className="w-full"
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
