"use client";

import Link from "next/link";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e7edf8] via-[#f6fafe] to-[#d1e3fa] px-6 relative overflow-hidden">
            {/* Decorative blurred shape */}
            <div
                aria-hidden
                className="absolute top-0 left-0 w-72 h-72 bg-[#21409a33] rounded-full blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"
            />
            <div
                aria-hidden
                className="absolute bottom-0 right-0 w-80 h-80 bg-[#92b2eb33] rounded-full blur-2xl opacity-50 translate-x-1/3 translate-y-1/3"
            />
            <motion.div
                className="max-w-md w-full text-center z-10"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, type: "spring", stiffness: 70 }}
            >
                <motion.h1
                    className="text-8xl md:text-9xl font-extrabold text-[#21409a] mb-4 drop-shadow-xl tracking-tight"
                    initial={{ scale: 1.2, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: 0.15, stiffness: 120 }}
                >
                    404
                </motion.h1>
                <motion.h2
                    className="text-2xl md:text-3xl font-semibold text-[#1b2232] mb-3"
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.27, duration: 0.55, type: "spring" }}
                >
                    Lost in the Skies
                </motion.h2>
                <motion.p
                    className="text-[#6380b6] mb-8 text-base md:text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.37, duration: 0.4 }}
                >
                    The page you&apos;re searching for can&apos;t be located.<br />
                    It might have been moved or never existed.<br />
                    <span className="inline-flex items-center gap-1 mt-1 text-sm text-[#21409a]/90 font-medium">
                        <FaSearch className="inline-block text-base" />
                        Try checking the URL or explore our homepage.
                    </span>
                </motion.p>
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.46, duration: 0.5, type: "spring" }}
                >
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white bg-[#21409a] px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-[#1b2d5e] hover:scale-[1.04] transition-all"
                    >
                        <FaArrowLeft className="text-lg" />
                        Return to Home
                    </Link>
                    <Link
                        href="/news/naape"
                        className="text-[#21409a] underline hover:text-[#174081] transition mt-1 text-sm"
                    >
                        Browse Latest News
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
