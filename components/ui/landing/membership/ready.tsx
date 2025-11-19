"use client"

import { NaapButton } from "@/components/ui/custom/button.naap";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.10,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 36 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 60,
            damping: 15,
            duration: 0.55,
        },
    },
};

export default function ReadySection() {
    return (
        <section className="relative w-full py-28 bg-gradient-to-br from-[#2047a5] to-[#2852b4] flex items-center justify-center overflow-hidden">
            {/* Decorative, subtle overlay for extra visual depth */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1600 400"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute inset-0 w-full h-full opacity-15"
                    aria-hidden
                >
                    <ellipse cx="1300" cy="230" rx="400" ry="120" fill="#ffffff" />
                    <ellipse cx="400" cy="170" rx="600" ry="90" fill="#bedafc" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#2047a5]/70" />
            </div>

            <motion.div
                className="relative z-10 flex flex-col items-center justify-center w-full px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
            >
                <motion.h2
                    className="text-3xl md:text-5xl font-extrabold text-white mb-3 text-center drop-shadow-xl"
                    variants={fadeUpVariants as any}
                >
                    Ready to <span className="text-[#ffce3c]">Take Flight</span> with NAAPE?
                </motion.h2>
                <motion.p
                    className="text-white/90 text-lg md:text-xl mb-9 text-center max-w-2xl font-medium"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.18, duration: 0.65, type: "spring", stiffness: 55 }}
                >
                    Elevate your career and join a community of passionate Nigerian pilots and engineers shaping the future of aviation excellence.
                </motion.p>
                <motion.div
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.27, duration: 0.6, type: "spring", stiffness: 55 }}
                >
                    <Link href="/register" passHref >
                        <NaapButton
                            className="bg-white text-[#2047a5] hover:bg-[#e6eaf3] px-9 py-3 font-semibold text-lg shadow-lg transition-all duration-200"
                            variant="primary"
                            icon={<FaArrowRight />}
                            iconPosition="right"
                        >
                            Join Now
                        </NaapButton>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
