"use client"

import Image from "next/image";
import { motion } from "framer-motion";

// Remove shadow/gradient, emphasize story, historic feel, contrast, visual hierarchy

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.16,
            delayChildren: 0.04,
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
            stiffness: 68,
            damping: 18,
            duration: 0.5,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.97, x: 38 },
    show: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 63,
            damping: 16,
            duration: 0.55,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring", stiffness: 62, damping: 18, duration: 0.46,
        },
    },
};

export default function BirthSection() {
    return (
        <motion.section
            className="flex flex-col md:flex-row items-stretch md:items-start gap-16 w-full py-20 px-4 md:px-16 bg-neutral-50"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.34 }}
        >
            {/* Left: Historic Photo/Collage */}
            <motion.div
                className="flex-1 flex justify-center items-center md:items-start max-w-xl md:pr-6"
                variants={imageVariants as any}
            >
                <figure className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border-4 border-[#CA9414] bg-neutral-100 flex items-end">
                    <Image
                        src="/gallery/1.jpeg"
                        alt="Historic photo: Early Nigerian pilots and engineers"
                        fill
                        style={{ objectFit: 'cover', filter: "saturate(0.46) contrast(1.22) brightness(0.98)" }}
                        className="rounded-xl"
                        priority
                    />
                    <figcaption className="absolute bottom-0 left-0 px-4 py-3 bg-[#CA9414]/95 text-white text-xs md:text-sm font-medium tracking-wide"
                        style={{
                            letterSpacing: '.03em',
                            borderTopRightRadius: 8,
                        }}
                    >
                        Delegates of APFEAN and NAAATE, Lagos, April 1984 <span className="hidden md:inline">– the merging of legacies.</span>
                    </figcaption>
                </figure>
            </motion.div>
            {/* Right: Visual Story & Timeline */}
            <motion.div
                className="flex-1 max-w-2xl"
                variants={textBlockVariants as any}
            >
                <motion.h2
                    className="mb-6"
                    variants={fadeUpVariants as any}
                >
                    <span className="block text-[#CA9414] text-sm md:text-base uppercase tracking-widest font-semibold mb-2">
                        Founding Milestone
                    </span>
                    <span className="block text-[2.05rem] md:text-[2.45rem] leading-tight font-black text-neutral-900">
                        The Birth of NAAPE
                    </span>
                    <span className="block text-[1.16rem] md:text-[1.34rem] font-semibold text-neutral-700 mt-1">
                        and Its First Leaders
                    </span>
                </motion.h2>
                <motion.ol
                    className="relative border-l-4 border-[#CA9414] pl-6 space-y-6 before:hidden mb-2"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.10 }}
                >
                    <li>
                        <div className="absolute -left-3 w-3 h-3 rounded-full bg-[#CA9414] border-2 border-white mt-1.5"></div>
                        <div className="text-base md:text-lg font-medium text-neutral-800">
                            <span className="font-bold text-[#CA9414]">April 16, 1984</span> — Leaders of <b>APFEAN</b> and <b>NAAATE</b> unite to form a single, new association.
                        </div>
                        <div className="text-sm md:text-base text-neutral-600 mt-1">
                            An organizing committee is set to convene a major <b>delegates conference</b>.
                        </div>
                    </li>
                    <li>
                        <div className="absolute -left-3 w-3 h-3 rounded-full bg-[#CA9414] border-2 border-white mt-1.5"></div>
                        <div className="text-base md:text-lg font-medium text-neutral-800">
                            <span className="font-bold text-[#CA9414]">Adoption of NAAPE</span> — The name <b>National Association of Aircraft Pilots and Engineers</b> is officially adopted, signifying a new era in aviation professionalism in Nigeria.
                        </div>
                    </li>
                    <li>
                        <div className="absolute -left-3 w-3 h-3 rounded-full bg-[#CA9414] border-2 border-white mt-1.5"></div>
                        <div className="text-base md:text-lg font-medium text-neutral-800">
                            <span className="font-bold text-[#CA9414]">August 16, 1985</span> — NAAPE is formally registered as a trade union, in accordance with the Trade Unions (Amendment) Act No. 22 of 1978 (<span className="font-mono text-sm">certificate #008</span>).
                        </div>
                    </li>
                </motion.ol>
                <motion.div
                    className="mt-6 text-neutral-700 text-[1.06rem] md:text-lg leading-relaxed bg-[#fffdfa] border-l-4 border-[#CA9414]/70 pl-5 py-4 rounded-r-xl font-serif"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.18 }}
                >
                    <span>
                        <span className="font-semibold text-[#CA9414]">NAAPE</span> was established exclusively for <b>Aircraft Pilots</b>, <b>Aircraft Maintenance Engineers</b>, and <b>Flight Engineers</b>, championing their distinct interests and the highest professional standards. For decades, this union has been a <span className="italic font-medium">beacon for unity, progress, and legacy</span> in the Nigerian aviation industry.
                    </span>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
