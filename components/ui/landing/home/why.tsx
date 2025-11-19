"use client"

import Image from "next/image";
import { FaRegCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdSecurity, MdTrendingUp } from "react-icons/md";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion } from "framer-motion";
import { AnyCaaRecord } from "dns";

const containerVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.17,
            delayChildren: 0.1,
            type: "spring",
            stiffness: 60,
            damping: 15,
        }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 26 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 65, damping: 16, duration: 0.5 }
    }
};

const pillarItemVariants = {
    hidden: { opacity: 0, y: 34 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1 + 0.22,
            type: "spring",
            stiffness: 60,
            damping: 16,
            duration: 0.46,
        }
    }),
};

export default function WhyJoinSection() {
    const pillars = [
        {
            icon: <FaRegCalendarCheck />,
            text: "Advocating the rights and improving the working conditions for all our members"
        },
        {
            icon: <FaChalkboardTeacher />,
            text: "Providing access to world-class training programs to ensure members are globally competitive."
        },
        {
            icon: <MdSecurity />,
            text: "Promoting and upholding the highest safety standards across the Nigerian aviation industry."
        },
        {
            icon: <MdTrendingUp />,
            text: "Creating opportunities for career growth, networking, and continuous learning."
        }
    ];

    return (
        <motion.section
            className="relative w-full max-w-full py-12 h-full px-6 md:px-6 flex flex-col md:flex-row items-center justify-center min-h-[34rem] gap-8 bg-white"
            variants={containerVariants as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.div
                className="flex-1 flex flex-col justify-center items-start gap-6 max-w-xl h-fit w-full"
                variants={containerVariants as any}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.span
                    className="inline-block bg-[#FFF6E0] text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase rounded-full px-4 py-1 mb-1 md:mb-0 shadow-sm"
                    variants={fadeInUp as any}
                >
                    WHY JOIN NAAPE
                </motion.span>
                <motion.h2
                    className="text-[#232835] text-[1.4rem] md:text-[2rem] font-extrabold leading-tight"
                    variants={fadeInUp as any}
                >
                    Championing Excellence And Integrity Across Aviation’s Four Pillars.
                </motion.h2>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full my-2"
                    variants={containerVariants as any}
                >
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            className="flex flex-col gap-3"
                            custom={idx}
                            variants={pillarItemVariants as any}
                        >
                            <span className="w-10 h-10 flex items-center justify-center bg-[#F5F7FA] rounded-lg text-[#2852B4] text-2xl mb-1">
                                {pillar.icon}
                            </span>
                            <p className="text-[#363749] text-sm font-medium">
                                {pillar.text}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div variants={fadeInUp as any}>
                    <NaapButton
                        className="bg-[#2852B4] hover:bg-[#2347A0] text-white font-semibold px-7 py-3 text-base shadow w-fit transition mt-2"
                    >
                        Become A Member
                    </NaapButton>
                </motion.div>
            </motion.div>
            <motion.div
                className="flex-1 w-full h-full flex items-center justify-center mt-10 md:mt-0"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 55, damping: 14, duration: 0.7 }}
                viewport={{ once: true, amount: 0.25 }}
            >
                <motion.div
                    className="rounded-xl overflow-hidden shadow-2xl border border-[#E6EAF1] bg-white w-full max-w-full relative"
                    whileHover={{ scale: 1.025, boxShadow: "0 8px 32px 0 rgba(40, 82, 180, 0.11)" }}
                    transition={{ type: "spring", stiffness: 160, damping: 20 }}
                >
                    <Image
                        src="/images/plane.jpg"
                        alt="Jet airplane at sunrise"
                        width={440}
                        height={440}
                        className="object-cover w-full h-full"
                        priority
                        style={{ borderRadius: "16px" }}
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
