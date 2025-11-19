"use client"

import Image from "next/image";
import { motion } from "framer-motion";

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
            className="flex flex-col md:flex-row items-start md:items-center gap-12 w-full py-16 px-4 md:px-16 bg-white"
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
                    className="text-3xl md:text-4xl font-extrabold text-neutral-800 mb-5 leading-tight"
                    variants={fadeUpVariants as any}
                >
                    Flying the Future of Nigeria’s<br />
                    <span className="font-normal">Aviation Professionals</span>
                </motion.h2>
                <motion.div
                    className="text-neutral-700 text-base md:text-lg leading-relaxed space-y-4"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.13 }}
                >
                    <p>
                        Being a platform for frontline professionals in aviation, NAAPE is a leading voice for safe flights operation in Nigeria, hence its motto, <b>We Do Right For Safety</b>. NAAPE is also a strong advocate for the full autonomy and effectiveness of the Nigerian Civil Aviation Authority (NCAA) being the sector regulator. NAAPE is equally the rallying point for Pilots and Aircraft Maintenance Engineers on professional, ethical and sector growth issues.
                    </p>
                    <p>
                        Above all, NAAPE performs its traditional role of vanguard for the protection and advancement of the workplace rights of its members with passion and dedication.
                    </p>
                    <p>
                        The present National President is Engr. Abednego Galadima, elected in July, 2018.
                        <br />
                        NAAPE is an affiliate of the Nigeria Labour Congress of Nigeria (NLC).
                    </p>
                </motion.div>
            </motion.div>
            {/* Image Content */}
            <motion.div
                className="flex-1 flex justify-center items-center max-w-xl md:max-w-full"
                variants={imageVariants as any}
            >
                <motion.div
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 32px 0 rgba(36,80,180,0.13)" }}
                    transition={{ type: "spring", stiffness: 210, damping: 18 }}
                >
                    <Image
                        src="/images/plane.jpg"
                        alt="NAAPE Pilot in cockpit looking at future"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="rounded-2xl transition-transform duration-300 hover:scale-105"
                        priority
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
