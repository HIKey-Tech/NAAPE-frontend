"use client"

import Image from "next/image";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.08,
        },
    },
};

const textBlockVariants  = {
    hidden: { opacity: 0, x: -38 },
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 18,
            duration: 0.55,
        },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.96, x: 42 },
    show: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 65,
            damping: 16,
            duration: 0.55,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring", stiffness: 60, damping: 18, duration: 0.5,
        },
    },
};

export default function BirthSection() {
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
                    The Birth of NAAPE<br className="hidden md:block" />{" "}
                    <span className="font-semibold text-primary">and Its First Leaders</span>
                </motion.h2>
                <motion.div
                    className="text-neutral-700 text-base md:text-lg leading-relaxed space-y-4"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.10 }}
                >
                    <p>
                        The National Association of Aircraft Pilots and Engineers (NAAPE) was officially registered as a trade union on <b>16 August 1985</b>, in accordance with the Trade Unions (Amendment) Act No. 22 of 1978, and issued certificate No. 008.
                    </p>
                    <p>
                        NAAPE was established exclusively for <b>Aircraft Pilots</b>, <b>Aircraft Maintenance Engineers</b>, and <b>Flight Engineers</b>, ensuring that their unique interests and professional standards would be represented at the highest levels.
                    </p>
                    <p>
                        The Association was formed through the merger of two prominent groups: the <b>Airline Pilots and Flight Engineers Association of Nigeria (APFEAN)</b> and the <b>Nigeria Airways Association of Aircraft Engineers and Technicians (NAAATE)</b>. These organizations converged on <b>16 April 1984</b>, forming an organizing committee to plan a delegates conference. It was at this pivotal meeting that the name <b>National Association of Aircraft Pilots and Engineers</b> was adopted, marking a new chapter in aviation professionalism in Nigeria.
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
                        src="/logo.png"
                        alt="Pilots in the cockpit of an airplane"
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
