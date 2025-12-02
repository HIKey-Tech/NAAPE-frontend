"use client"

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion } from "framer-motion";

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

export default function MembershipHeroSection() {
    return (
        <section className="relative w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-center bg-gradient-to-br from-[#F5F7FA] to-[#e5ecfa] overflow-hidden px-4 py-6 md:py-16 md:px-0">
            {/* Soft background image overlay */}
            <div
                className="pointer-events-none absolute inset-0 z-0"
                aria-hidden
                style={{
                    backgroundImage: "url('/images/plane.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.16,
                }}
            ></div>
            <motion.div
                className="relative z-10 flex flex-col md:flex-row items-center gap-10 w-full max-w-7xl mx-auto px-2 md:px-10"
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {/* Content */}
                <motion.div
                    className="flex flex-1 flex-col items-center md:items-start text-center md:text-left gap-6"
                    variants={leftVariants as any}
                >
                    <motion.h1
                        className="text-3xl md:text-5xl font-extrabold text-[#232835] leading-tight mb-2 drop-shadow-[0_2px_12px_rgba(30,41,59,0.11)]"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.18, duration: 0.7, type: "spring", stiffness: 70 }}
                    >
                        Join Nigeria’s Premier <span className="text-primary">Aviation</span>{" "}
                        <br className="hidden md:block" />
                        Community of Professionals
                    </motion.h1>
                    <motion.p
                        className="text-[#4B4B55] text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.28, duration: 0.7, type: "spring", stiffness: 70 }}
                    >
                        Become part of NAAPE—the national network for pilots, engineers, and aviation professionals committed to{" "}
                        <span className="font-semibold text-[#232835]">
                            advancing safety, skill, and excellence
                        </span>{" "}
                        in Nigeria’s aviation industry.
                    </motion.p>
                    <motion.div
                        className="flex gap-5 mt-4 w-full justify-center md:justify-start"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.39, duration: 0.55, type: "spring" }}
                    >
                        <Link href="/register" passHref >
                            <NaapButton
                                variant="primary"
                                className="px-7 py-3 font-semibold text-base shadow-lg"
                                icon={<FaArrowRight className="ml-1" />}
                                iconPosition="right"
                            >
                                Become a Member
                            </NaapButton>
                        </Link>
                        <Link href="/about-us" passHref >
                            <NaapButton
                                variant="ghost"
                                className="px-7 py-3 font-semibold text-base border-[#2852B4] text-[#2852B4]"
                            >
                                Learn More
                            </NaapButton>
                        </Link>
                    </motion.div>
                </motion.div>
                {/* Hero Image */}
                <motion.div
                    className="flex-1 w-full md:w-[420px] max-w-[430px] relative shadow-2xl rounded-2xl overflow-hidden border border-[#e6e9f1] bg-white/70"
                    variants={rightVariants as any}
                >
                    <Image
                        src="/images/plane.jpg"
                        alt="Nigerian pilots and engineers group"
                        width={600}
                        height={600}
                        className="object-cover w-full h-72 md:h-[340px] grayscale-0"
                        priority
                    />
                    {/* Subtle shape decoration */}
                    <div
                        aria-hidden
                        className="hidden md:block absolute -bottom-10 -right-10 z-10 h-32 w-32 rounded-full bg-[#d8ecfa] opacity-70 blur-2xl"
                    ></div>
                </motion.div>
            </motion.div>
        </section>
    );
}
