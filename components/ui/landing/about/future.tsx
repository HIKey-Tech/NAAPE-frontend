"use client"

import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants remain unchanged for clarity
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.10,
        },
    },
};

const textBlockVariants = {
    hidden: { opacity: 0, x: -38 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 18,
            duration: 0.53,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 26 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 17,
            duration: 0.5,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.96, x: 36 },
    show: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 65,
            damping: 16,
            duration: 0.53,
        },
    },
};

export default function FutureSection() {
    return (
        <motion.section
            className="flex flex-col md:flex-row items-start md:items-center gap-16 w-full py-20 px-4 md:px-20 bg-white border-t border-neutral-200"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.34 }}
        >
            {/* Text Content */}
            <motion.div
                className="flex-1 max-w-2xl"
                variants={textBlockVariants as any}
            >
                <motion.h2
                    className="mb-7"
                    variants={fadeUpVariants as any}
                >
                    <span className="block text-lg md:text-xl font-mono uppercase tracking-wider text-neutral-500 mb-2">
                        Our History in the Skies
                    </span>
                    <span className="block text-4xl md:text-5xl font-black text-neutral-900 leading-tight">
                        Flying the Future of Nigeria’s
                    </span>
                    <span className="block text-2xl md:text-3xl font-semibold tracking-tight text-amber-800 mt-2">
                        Aviation Professionals
                    </span>
                </motion.h2>
                <motion.div
                    className="text-neutral-800 text-base md:text-lg leading-relaxed space-y-5 font-serif"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.13 }}
                >
                    <blockquote className="border-l-4 border-amber-700 pl-4 italic text-amber-900 font-medium mb-3">
                        “We Do Right For Safety”
                    </blockquote>
                    <p>
                        Since its inception, NAAPE has stood as the home and hub for Nigeria's frontline aviation professionals; the pilots and aircraft engineers who safeguard our airways. In every era, NAAPE’s steadfast voice has championed safe flight operations and the full autonomy of the sector’s regulator, the Nigerian Civil Aviation Authority (NCAA).
                    </p>
                    <p>
                        NAAPE’s history is rich with advocacy for professional, ethical, and sector growth, uniting generations of pilots and engineers to advance aviation’s highest standards. The union remains the vanguard for workplace rights — a mission pursued with passion and devotion through every decade of change.
                    </p>
                    <p className="text-neutral-700 mt-3 text-sm font-mono">
                        <span className="uppercase tracking-wider text-amber-900">Current President:</span> Engr. Abednego Galadima (since July 2018)
                        <br />
                        <span className="uppercase tracking-wide text-neutral-600">Affiliation:</span> Nigeria Labour Congress (NLC)
                    </p>
                </motion.div>
            </motion.div>

            {/* Image Content */}
            <motion.div
                className="flex-1 flex flex-col justify-start items-center max-w-xl md:max-w-full gap-2"
                variants={imageVariants as any}
            >
                <motion.div
                    className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-2 border-amber-900 bg-neutral-100"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 210, damping: 18 }}
                >
                    <Image
                        src="/logo.png"
                        alt="Historic NAAPE pilot, cockpit, and flight log"
                        fill
                        style={{
                            objectFit: 'cover',
                            filter: 'grayscale(65%) contrast(1.18) brightness(0.97)'
                        }}
                        className="rounded-xl transition-transform duration-300"
                        priority
                    />
                </motion.div>
                <div className="w-full flex flex-row gap-4 mt-3">
                    {/* Placeholders/historic illustrative images */}
                    <div className="relative aspect-square w-24 rounded border border-neutral-300 overflow-hidden bg-white flex items-center justify-center">
                        <Image
                            src="/img/historic-pilot.png"
                            alt="Historic NAAPE pilot"
                            fill
                            style={{ objectFit: 'cover', filter: 'grayscale(88%) contrast(1.12)' }}
                            className="rounded"
                        />
                    </div>
                    <div className="relative aspect-square w-24 rounded border border-neutral-300 overflow-hidden bg-white flex items-center justify-center">
                        <Image
                            src="/img/logbook.png"
                            alt="Old pilot logbook"
                            fill
                            style={{ objectFit: 'cover', filter: 'sepia(0.3) contrast(1.07)' }}
                            className="rounded"
                        />
                    </div>
                    <div className="relative aspect-square w-24 rounded border border-neutral-300 overflow-hidden bg-white flex items-center justify-center">
                        <Image
                            src="/img/naape-aircraft.png"
                            alt="Legacy NAAPE aircraft"
                            fill
                            style={{ objectFit: 'cover', filter: 'grayscale(75%) contrast(1.10)' }}
                            className="rounded"
                        />
                    </div>
                </div>
                <div className="w-full mt-4">
                    <p className="text-xs text-neutral-500 text-center font-mono italic">Documenting the journey: pilots, logbooks, and enduring legacy.</p>
                </div>
            </motion.div>
        </motion.section>
    );
}
