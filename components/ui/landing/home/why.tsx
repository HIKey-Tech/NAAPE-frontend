"use client"

import Image from "next/image";
import { FaRegCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdSecurity, MdTrendingUp } from "react-icons/md";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion } from "framer-motion";
import Link from "next/link";

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
            title: "Advocacy & Welfare",
            text: "Advocating the rights and improving the working conditions for all our members"
        },
        {
            icon: <FaChalkboardTeacher />,
            title: "World-Class Training",
            text: "Providing access to world-class training programs to ensure members are globally competitive."
        },
        {
            icon: <MdSecurity />,
            title: "Safety Standards",
            text: "Promoting and upholding the highest safety standards across the Nigerian aviation industry."
        },
        {
            icon: <MdTrendingUp />,
            title: "Growth & Networking",
            text: "Creating opportunities for career growth, networking, and continuous learning."
        }
    ];

    return (
        <motion.section
            className="relative w-full max-w-full py-16 h-full px-6 md:px-8 flex flex-col md:flex-row items-center justify-center min-h-[36rem] gap-14 bg-white"
            variants={containerVariants as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
        >
            <motion.div
                // Set both sides to have FULL width
                className="flex flex-col justify-center items-start gap-6 h-fit w-full basis-full max-w-full"
                variants={containerVariants as any}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.span
                    className="inline-block bg-neutral-100 text-neutral-700 font-bold text-xs md:text-sm tracking-[.19em] uppercase rounded-full px-5 py-1 mb-1 md:mb-0"
                    variants={fadeInUp as any}
                >
                    Why Join NAAPE
                </motion.span>
                <motion.h2
                    className="text-neutral-900 text-[2rem] md:text-[2.6rem] font-extrabold leading-tight tracking-tight md:pr-6 max-w-2xl"
                    variants={fadeInUp as any}
                >
                    Championing{" "}
                    <span className="text-[color:var(--primary)]">Excellence</span>,{" "}
                    <span className="text-[color:var(--primary)]">Integrity</span>
                    {/* <br className="hidden md:inline" /> &amp;{" "} */} &amp; {" "}
                    <span className="text-[color:var(--primary)]"> Growth</span> across
                    <br className="hidden md:inline" /> Aviation’s Four Pillars
                </motion.h2>
                <motion.p
                    className="text-neutral-700 text-[1.12rem] md:text-lg font-medium leading-relaxed mb-1 md:mb-2 mt-0 tracking-normal max-w-2xl"
                    variants={fadeInUp as any}
                >
                    NAAPE empowers pilots and engineers through advocacy, access to global opportunities, and a commitment to the highest safety and professional standards in Nigerian aviation.
                </motion.p>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 w-full my-2"
                    variants={containerVariants as any}
                >
                    {pillars.map((pillar, idx) => (
                        <motion.div
                            key={idx}
                            className="flex flex-row items-start gap-4 bg-neutral-50 rounded-xl px-3.5 py-4 border border-neutral-200 min-h-[110px] transition"
                            custom={idx}
                            variants={pillarItemVariants as any}
                        >
                            <span
                                className="w-12 h-12 flex items-center justify-center bg-gradient-to-tr from-[#F2F6FE] to-[#FFF6EE] rounded-xl text-2xl text-[color:var(--primary)] border border-neutral-100"
                            >
                                {pillar.icon}
                            </span>
                            <div className="flex flex-col gap-1">
                                <span className="text-neutral-900 font-bold text-base md:text-[1.09rem] tracking-tight mb-0">
                                    {pillar.title}
                                </span>
                                <p className="text-neutral-700 text-sm md:text-[1rem] font-medium leading-snug">
                                    {pillar.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
                <motion.div variants={fadeInUp as any}>
                    <Link href="/membership" >
                        <NaapButton
                            className="bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white font-semibold px-8 py-3.5 text-[1.08rem] w-fit rounded-full transition mt-4"
                        >
                            Become A Member
                        </NaapButton>
                    </Link>
                </motion.div>
            </motion.div>
            <motion.div
                // Set both sides to have FULL width
                className="flex items-center justify-center w-full h-full mt-10 md:mt-0 basis-full max-w-full"
                initial={{ opacity: 0, x: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 55, damping: 14, duration: 0.7 }}
                viewport={{ once: true, amount: 0.25 }}
            >
                <motion.div
                    className="rounded-2xl overflow-hidden border border-neutral-200 bg-white w-full max-w-full relative"
                    whileHover={{ scale: 1.035 }}
                    transition={{ type: "spring", stiffness: 180, damping: 20 }}
                >
                    <Image
                        src="/images/plane.jpg"
                        alt="Jet airplane at sunrise"
                        width={460}
                        height={460}
                        className="object-cover w-full h-full"
                        priority
                        style={{ borderRadius: "18px" }}
                    />
                    {/* Decorative radial gradient overlay */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        aria-hidden
                        style={{
                            background: "radial-gradient(ellipse at 65% 80%, rgba(202,148,20,0.13) 0%, transparent 80%)",
                            zIndex: 6,
                        }}
                    />
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
