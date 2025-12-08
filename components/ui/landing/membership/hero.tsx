"use client"

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

// Use CSS variable for primary colour to enforce consistency
const PRIMARY_COLOR = "var(--primary)";
const PRIMARY_COLOR_FOREGROUND = "var(--primary-foreground)";
const PRIMARY_COLOR_HOVER = "#0051b3"; // fallback for hover if not defined in css vars

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
        },
    },
};

const leftVariants = {
    hidden: { opacity: 0, x: -35 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 17,
            duration: 0.55,
        },
    },
};

const rightVariants = {
    hidden: { opacity: 0, x: 35, scale: 0.98 },
    show: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 17,
            duration: 0.55,
        },
    },
};

// Micro animation variants
const pulseHover = {
    whileHover: { scale: 1.085, boxShadow: "0 6px 26px rgba(33,150,243,0.14)" },
    whileTap: { scale: 0.98 },
};

const circlePulseVariants = {
    initial: { scale: 1, opacity: 0.85 },
    animate: {
        scale: [1, 1.1, 1],
        opacity: [0.85, 1, 0.85],
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
    },
};

const popInPhoto = {
    initial: { scale: 0.88, opacity: 0, y: 12 },
    animate: (i: number) => ({
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.1 + 0.11 * i,
            type: "spring",
            stiffness: 120,
            damping: 11,
        },
    }),
    whileHover: { scale: 1.09, boxShadow: "0 0 0 4px #ebf4ff" },
};

const circleCountVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: { delay: 0.35, type: "spring", stiffness: 500, damping: 18 },
    },
    whileHover: { scale: 1.11 },
};

const textHighlightVariants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.045, 1],
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
};

export default function MembershipHeroSection() {
    // For micro-interaction demo: Animate the main image on pointer
    const [isPlaneHovered, setIsPlaneHovered] = useState(false);
    const controls = useAnimation();

    const avatarSources = [
        {
            src: "/images/people1.jpg",
            alt: "Pilot avatar",
        },
        {
            src: "/images/people2.jpg",
            alt: "Engineer avatar",
        },
        {
            src: "/images/people3.jpg",
            alt: "Community member avatar",
        },
    ];

    return (
        <section
            className="relative w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center bg-[#f7fafc] overflow-hidden px-2 sm:px-4 py-6 sm:py-8 md:py-20 md:px-0"
            style={{
                borderTop: `5px solid ${PRIMARY_COLOR}`,
            }}
        >
            {/* Decorative Divider */}
            <motion.div
                className="hidden md:block absolute left-0 top-0 h-full w-1.5"
                style={{ background: PRIMARY_COLOR, opacity: 0.2 }}
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, type: "spring", stiffness: 60 }}
            ></motion.div>

            {/* Content */}
            <motion.div
                className="relative z-10 flex flex-col md:flex-row items-center gap-10 sm:gap-12 md:gap-14 w-full max-w-6xl mx-auto px-1 sm:px-3 md:px-8"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                <motion.div
                    className="flex flex-1 flex-col items-center md:items-start text-center md:text-left gap-5 sm:gap-7 w-full"
                    variants={leftVariants as any}
                >
                    <motion.h1
                        className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-black leading-tight mb-1"
                        style={{ color: PRIMARY_COLOR }}
                        initial={{ opacity: 0, y: 32 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.7, type: "spring", stiffness: 70 }}
                    >
                        Welcome    
                        <motion.span
                            initial={{ rotate: -12, y: -8, opacity: 0 }}
                            animate={{ rotate: 0, y: 0, opacity: 1 }}
                            transition={{ delay: 0.34, duration: 0.4, type: "spring", stiffness: 300 }}
                            className="inline-block"
                        >
                            ,
                        </motion.span>
                        {" "}
                        <br className="hidden md:block" />
                        <motion.span
                            className="inline-block bg-[#ebf4ff] rounded px-2 py-1"
                            style={{ color: "#1767a3" }}
                            variants={textHighlightVariants as any}
                            initial="initial"
                            animate="animate"
                        >
                            Future Aviation Professional!
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        className="text-base sm:text-lg md:text-2xl font-medium max-w-[95vw] sm:max-w-2xl mx-auto md:mx-0 leading-relaxed"
                        style={{ color: "#22294C" }}
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.7, type: "spring", stiffness: 70 }}
                    >
                        <motion.span
                            className="inline-block font-extrabold bg-[#e3eaf3] px-2 rounded mb-2"
                            style={{ color: PRIMARY_COLOR }}
                            whileHover={{ scale: 1.08, rotate: 2 }}
                            transition={{ type: "spring", stiffness: 360, damping: 10 }}
                        >
                            Join NAAPE
                        </motion.span>{" "}
                        — Nigeria’s vibrant community of pilots, engineers, and aviation professionals.
                        <br className="hidden md:block" />
                        <span className="mt-1 block">
                            <motion.span
                                className="font-semibold"
                                style={{ color: "#1b506f" }}
                                whileHover={{ scale: 1.07, color: "#1767a3" }}
                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                            >
                                Connect
                            </motion.span>{" "}
                            with peers,{" "}
                            <motion.span
                                className="font-semibold"
                                style={{ color: "#1a8d2c" }}
                                whileHover={{ scale: 1.08, color: "#057C44" }}
                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                            >
                                grow
                            </motion.span>{" "}
                            your career, and{" "}
                            <motion.span
                                className="font-semibold"
                                style={{ color: "#ca6a0c" }}
                                whileHover={{ scale: 1.08, color: "#ff7400" }}
                                transition={{ type: "spring", stiffness: 500, damping: 12 }}
                            >
                                advance
                            </motion.span>{" "}
                            aviation safety and excellence in an inclusive, supportive network.
                        </span>
                    </motion.p>
                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 sm:gap-5 mt-4 w-full justify-center md:justify-start"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.39, duration: 0.55, type: "spring" }}
                    >
                        <Link href="/register" passHref>
                            <motion.div {...pulseHover} transition={{ type: "spring", stiffness: 400, damping: 13 }}>
                                <NaapButton
                                    variant="primary"
                                    className="w-full sm:w-auto px-6 sm:px-8 py-3 font-bold text-base sm:text-lg rounded-full border-0 transition-colors"
                                    style={{
                                        background: PRIMARY_COLOR,
                                        color: PRIMARY_COLOR_FOREGROUND,
                                        boxShadow: "none",
                                    }}
                                    icon={<FaArrowRight className="ml-2" style={{ color: PRIMARY_COLOR_FOREGROUND }} />}
                                    iconPosition="right"
                                >
                                    Become a Member
                                </NaapButton>
                            </motion.div>
                        </Link>
                        <Link href="/about-us" passHref>
                            <motion.div {...pulseHover} transition={{ type: "spring", stiffness: 400, damping: 13 }}>
                                <NaapButton
                                    variant="ghost"
                                    className="w-full sm:w-auto px-6 sm:px-7 py-3 font-bold text-base sm:text-lg rounded-full border-2 transition-colors"
                                    style={{
                                        borderColor: "#2196f3",
                                        color: "#2196f3",
                                        boxShadow: "none",
                                    }}
                                >
                                    Learn More
                                </NaapButton>
                            </motion.div>
                        </Link>
                    </motion.div>
                    <div className="w-full flex flex-col items-center md:items-start mt-7 gap-1 max-w-full">
                        <div className="text-xs xs:text-sm tracking-wide text-center md:text-left" style={{ color: "#3b495d" }}>
                            <span className="font-semibold" style={{ color: PRIMARY_COLOR }}>
                                Already a member?
                            </span>{" "}
                            <Link
                                href="/login"
                                className="underline font-semibold transition-colors"
                                style={{
                                    color: PRIMARY_COLOR,
                                    textUnderlineOffset: 2,
                                }}
                            >
                                <motion.span
                                    whileHover={{ scale: 1.05, color: PRIMARY_COLOR_HOVER }}
                                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                                >
                                    Sign in here
                                </motion.span>
                            </Link>
                        </div>
                        <motion.div
                            className="text-xs text-center md:text-left max-w-[95vw]"
                            style={{ color: "#7b818a" }}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.62, duration: 0.55, type: "spring", stiffness: 60 }}
                        >
                            <span className="font-semibold">NAAPE Secretariat:</span> No.2, Unity Road, Ikeja, Lagos. Tel: 234-01-8417290
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div
                    className="flex-1 w-full xs:w-[92vw] sm:w-[400px] md:w-[380px] max-w-[97vw] sm:max-w-[420px] md:max-w-[400px] relative rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 bg-white mt-8 md:mt-0"
                    style={{ borderColor: PRIMARY_COLOR }}
                    variants={rightVariants as any}
                >
                    <motion.div
                        className="absolute inset-0 z-0 pointer-events-none"
                        aria-hidden
                        style={{ background: PRIMARY_COLOR, opacity: 0.05 }}
                        initial={{ opacity: 0.0 }}
                        animate={{ opacity: 0.05 }}
                        transition={{ delay: 0.33, duration: 0.45 }}
                    ></motion.div>
                    <motion.div
                        onHoverStart={() => setIsPlaneHovered(true)}
                        onHoverEnd={() => setIsPlaneHovered(false)}
                        className="w-full"
                        style={{ borderRadius: "inherit" }}
                    >
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0, y: 32 }}
                            animate={{ scale: isPlaneHovered ? 1.015 : 1, opacity: 1, y: 0 }}
                            transition={{ delay: 0.22, duration: 0.68, type: "spring", stiffness: 65 }}
                        >
                            <Image
                                src="/images/plane.jpg"
                                alt="Nigerian pilots and engineers group"
                                width={600}
                                height={600}
                                className="object-cover w-full h-44 xs:h-56 sm:h-72 md:h-[340px] transition-transform"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                    {/* Community circle overlay */}
                    <motion.div
                        aria-hidden
                        className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 z-10 h-10 sm:h-16 w-36 sm:w-44 rounded-full bg-[#e3eaf3] opacity-85 blur-lg"
                        variants={circlePulseVariants as any}
                        initial="initial"
                        animate="animate"
                    ></motion.div>
                    {/* Community photo group */}
                    <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1 z-20">
                        {/* Example community avatars */}
                        {avatarSources.map((avatar, i) => (
                            <motion.div
                                key={i}
                                custom={i}
                                variants={popInPhoto as any}
                                initial="initial"
                                animate="animate"
                                whileHover="whileHover"
                                transition={{ type: "spring", stiffness: 110 + i * 20, damping: 16 }}
                                style={{ display: "inline-block" }}
                            >
                                <Image
                                    src={avatar.src}
                                    width={30}
                                    height={30}
                                    alt={avatar.alt}
                                    className="rounded-full border-2 border-white object-cover xs:w-9 xs:h-9 sm:w-9 sm:h-9"
                                />
                            </motion.div>
                        ))}
                        <motion.span
                            className="rounded-full text-xs font-bold w-7 h-7 xs:w-8 xs:h-8 flex items-center justify-center border-2 border-white"
                            style={{ background: "#2196f3", color: "#fff" }}
                            variants={circleCountVariants as any}
                            initial="initial"
                            animate="animate"
                            whileHover="whileHover"
                        >
                            +7
                        </motion.span>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
