"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Users2 } from "lucide-react";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.19,
            delayChildren: 0.09,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 34 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 62,
            damping: 17,
            duration: 0.56,
        },
    },
};

// Micro animation for icon "wobble"
const iconMicroAnim = {
    rest: { rotate: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
    hover: {
        rotate: [0, 7, -7, 7, -5, 0],
        scale: 1.08,
        transition: {
            type: "spring",
            stiffness: 220,
            damping: 8,
            duration: 0.5,
        },
    },
};

export default function MissionSection() {
    return (
        <motion.section
            className="relative w-full bg-[#203a5e] py-20 px-4 md:px-0 flex flex-col items-center overflow-hidden border-t border-b border-[#1b2942]"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.28 }}
            aria-label="NAAPE Mission and Vision"
        >
            {/* Visual Motif: subtle faded icons (background, storytelling, ambiguous) */}
            <span
                aria-hidden="true"
                className="pointer-events-none opacity-10 absolute left-12 top-12 hidden md:block"
            >
                <Users2 size={108} className="text-white/70" />
            </span>
            <span
                aria-hidden="true"
                className="pointer-events-none opacity-10 absolute -right-10 bottom-10 hidden md:block"
            >
                <Eye size={124} className="text-white/30" />
            </span>

            <motion.h2
                className="text-white text-4xl md:text-5xl font-black tracking-tight uppercase mb-16 text-center drop-shadow-none leading-tight"
                variants={fadeUpVariants as any}
            >
                Mission & Vision
            </motion.h2>

            <motion.div
                className="flex flex-col md:flex-row gap-10 w-full max-w-5xl justify-center items-stretch"
                variants={containerVariants}
            >
                {/* Mission Card */}
                <motion.div
                    className="relative flex-1 min-w-[280px] flex flex-col items-center text-center gap-2
                    border-2 border-[#eee8da] bg-white/95 rounded-xl px-8 py-12
                    transition-colors"
                    variants={fadeUpVariants as any}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                >
                    <motion.div
                        className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#203a5e] rounded-full p-3"
                        variants={iconMicroAnim as any}
                    >
                        <ArrowUpRight size={32} className="text-white" aria-hidden="true" />
                    </motion.div>
                    <h3 className="font-extrabold text-[#203a5e] text-xl tracking-wide mb-3 uppercase">
                        Mission
                    </h3>
                    <p className="text-neutral-800 text-base md:text-lg font-medium mt-1 leading-relaxed max-w-xs">
                        Championing safety, skill, and solidarity— we advocate broadly, protect our own, and nurture aviation’s future.
                    </p>
                </motion.div>
                {/* Vision Card */}
                <motion.div
                    className="relative flex-1 min-w-[280px] flex flex-col items-center text-center gap-2
                    border-2 border-[#eee8da] bg-white/95 rounded-xl px-8 py-12
                    transition-colors"
                    variants={fadeUpVariants as any}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                >
                    <motion.div
                        className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#203a5e] rounded-full p-3"
                        variants={iconMicroAnim as any}
                    >
                        <Eye size={32} className="text-white" aria-hidden="true" />
                    </motion.div>
                    <h3 className="font-extrabold text-[#203a5e] text-xl tracking-wide mb-3 uppercase">
                        Vision
                    </h3>
                    <p className="text-neutral-800 text-base md:text-lg font-medium mt-1 leading-relaxed max-w-xs">
                        Together— pilots, engineers, stories— we are the horizon where tomorrow’s possibilities take flight.
                    </p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
