"use client";

import Image from "next/image";
import Link from "next/link";
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
    return (
        <section className="relative w-full h-full min-h-full flex flex-col md:flex-col items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-8 ">
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

                {/* Right: Modern Image Gallery */}
                <motion.div
                    className="flex-1 flex w-full justify-center items-center"
                    variants={rightVariants as any}
                >
                    {/* Increase size: make max-w-[550px] (was 420px), and aspect-square remains */}
                    <div className="relative w-full flex items-center justify-center max-w-[550px] aspect-square">
                        <motion.div
                            // Optionally, increase grid gap for large images
                            className="grid grid-cols-2 grid-rows-3 gap-4 w-full h-full rounded-2xl overflow-hidden"
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
                                        relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group
                                    `}
                                    // Increase the minHeight for larger display
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
                                        className="object-cover object-center group-hover:scale-[1.045] transition-transform duration-300"
                                        draggable={false}
                                        sizes="(max-width: 550px) 100vw, 550px"
                                    />
                                    <span className="absolute left-0 bottom-0 w-full h-16 bg-gradient-to-t from-[#213765ad] to-transparent pointer-events-none"></span>
                                    {/* <span className="absolute left-1 bottom-2 text-xs xs:text-sm font-medium text-white drop-shadow">{img.alt}</span> */}
                                </div>
                            ))}
                        </motion.div>
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
