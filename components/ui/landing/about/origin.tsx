"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.07,
        },
    },
};

const textBlockVariants = {
    hidden: { opacity: 0, x: -36 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 65,
            damping: 18,
            duration: 0.52,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 58,
            damping: 16,
            duration: 0.46,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.97, x: 34 },
    show: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 58,
            damping: 19,
            duration: 0.48,
        },
    },
};

export default function OriginSection() {
    // For micro-animations (hover/tap): state not required, using framer-motion props directly

    return (
        <motion.section
            className="relative flex flex-col md:flex-row justify-center items-stretch md:items-center gap-14 w-full py-20 px-4 md:px-16 bg-[#F8F5F0] border-t border-[#E0DBC9]"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.34 }}
        >
            {/* Backdrop Motif: Faded Era Symbol */}
            <motion.span
                aria-hidden="true"
                className="pointer-events-none select-none absolute left-[9%] top-6 opacity-10 text-[8rem] md:text-[11rem] rotate-[-6deg] hidden md:block"
                style={{
                    fontFamily: 'serif',
                    letterSpacing: '-0.07em',
                    color: "#a08860",
                    lineHeight: 1,
                    userSelect: "none",
                }}
                whileHover={{ scale: 1.04, rotate: -5 }} // slight hover scale and rotate for motif micro animation
                transition={{ type: "spring", stiffness: 80, damping: 16 }}
            >
                1984
            </motion.span>

            {/* Image Content w/ border, no shadow, gentle motif, ambiguous */}
            <motion.div
                className="flex-1 flex justify-center items-center max-w-xl md:max-w-none mb-10 md:mb-0 relative"
                variants={imageVariants as any}
                whileHover={{ scale: 1.025, boxShadow: "0 6px 32px 0 #dbcbaa44" }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 160, damping: 15 }}
            >
                <motion.div
                    className={`
                        relative w-full max-w-md aspect-[4/3] rounded-xl overflow-hidden
                        border-2 border-[#daccad] bg-[#efe9de] flex items-center justify-center
                    `}
                    whileHover={{ boxShadow: "0 4px 24px #ecdcb844" }}
                    transition={{ duration: 0.25 }}
                >
                    {/* Ambiguous layered effect */}
                    <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-[#bfa477] opacity-30 pointer-events-none"
                        aria-hidden="true"
                        whileHover={{ opacity: 0.43, scale: 1.04 }}
                        transition={{ duration: 0.28 }}
                    />
                    <motion.div
                        className="absolute inset-0 z-10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.14 }}
                        transition={{ duration: 0.33 }}
                        aria-hidden="true"
                        style={{
                            background: "radial-gradient(circle at 65% 50%, #f3eed17c 18%, transparent 80%)"
                        }}
                    />
                    <motion.div
                        className="relative w-full h-full"
                        whileHover={{ scale: 1.025, rotate: 0.2 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ type: "spring", stiffness: 150, damping: 14 }}
                    >
                        <Image
                            src="/logo.png"
                            alt="NAAPE Origin"
                            fill
                            style={{ objectFit: "cover", mixBlendMode: "luminosity" }}
                            className="rounded-xl scale-100 saturate-70"
                            priority
                        />
                    </motion.div>
                </motion.div>
            </motion.div>
            
            {/* Text Content: creamy bg, storytelling style, strong contrast */}
            <motion.div
                className="flex-1 max-w-2xl px-0 md:px-4 py-0 flex flex-col justify-center"
                variants={textBlockVariants as any}
            >
                <motion.h2
                    className="text-2xl md:text-4xl font-black text-[#26200d] mb-6 uppercase tracking-tight leading-tight"
                    variants={fadeUpVariants as any}
                    whileHover={{ letterSpacing: "0.02em", color: "#574318" }}
                    transition={{ type: "spring", stiffness: 100, damping: 13 }}
                >
                    <motion.span
                        className="border-b-4 border-[#daccad] pb-1 inline-block"
                        whileHover={{ borderColor: "#bfa477", scale: 1.04 }}
                        transition={{ duration: 0.22 }}
                    >
                        Our Origins
                    </motion.span>
                    <motion.span
                        className="text-lg font-light text-[#bfa477] ml-3 align-top"
                        whileHover={{ color: "#a08860" }}
                        transition={{ duration: 0.17 }}
                    >
                        (1984–1985)
                    </motion.span>
                </motion.h2>
                <motion.div
                    className="text-[#3d2b14] text-base md:text-lg font-medium leading-relaxed space-y-5 bg-[#fcf8f3] border border-[#efe9de] rounded-xl px-6 py-5"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.12 }}
                    whileHover={{ backgroundColor: "#f4eee3", borderColor: "#dac6a9" }}
                >
                    <motion.p
                        whileHover={{ x: 2, color: "#7a5c31" }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 70 }}
                    >
                        <motion.span
                            className="font-semibold text-[#866b38]"
                            whileHover={{ color: "#a88651" }}
                            transition={{ duration: 0.16 }}
                        >Subsequently,</motion.span>{" "}
                        NAAPE held its maiden delegates Conference (May 17–18, 1984) at the Nigeria Airways Sports Club, C.I.A., Ikeja, Lagos (now demolished). The Conference elected the first National Executive Council (NEC) – now National Administrative Council (NAC) – with Capt. Ade Olubadewo (Aero Contractors) as first National President of NAAPE.
                    </motion.p>
                    <motion.p
                        whileHover={{ x: -2, color: "#866b38" }}
                        transition={{ duration: 0.2, type: "spring", stiffness: 70 }}
                    >
                        The NEC appointed Comrade Michael Ekujumi as first General Secretary (then Professional Secretary) in June 1984; soon after, the process began to register the Association as a trade union—accomplished in August 1985.
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
