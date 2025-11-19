"use client"

import { useState, useRef, useEffect } from "react";
import { FaHandshake, FaLayerGroup } from "react-icons/fa";
import { HiOutlineLightBulb } from "react-icons/hi2";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CARD_DATA = [
    {
        icon: <FaHandshake size={28} />,
        title: "Vibrant Community",
        description:
            "Belong to a strong, collaborative network of Nigerian pilots and engineers sharing a passion for safety, growth, and advancement.",
        bg: "bg-gradient-to-br from-[#ebf1fc] to-white",
    },
    {
        icon: <HiOutlineLightBulb size={28} />,
        title: "Professional Growth",
        description:
            "Access members-only networking events, industry advocacy, leadership development, and career resources.",
        bg: "bg-gradient-to-br from-[#f1f7ef] to-white",
    },
    {
        icon: <FaLayerGroup size={28} />,
        title: "Membership for Every Stage",
        description:
            "Whether you’re a Student, Associate, or Full Member, our tailored tiers support every step of your aviation career.",
        bg: "bg-gradient-to-br from-[#e6f3fa] to-white",
    },
];

// Framer Motion animation variants
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.19,
            delayChildren: 0.14,
        },
    },
};

const cardVariants = {
    enter: { opacity: 0, y: 48, scale: 0.96 },
    center: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 18,
            duration: 0.5,
        }
    },
    exit: { opacity: 0, y: -42, scale: 0.98, transition: { duration: 0.3 } },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.12, duration: 0.6, type: "spring", stiffness: 60 },
    },
};

export default function WhyJoinSection() {
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Automatic slide logic
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % CARD_DATA.length);
        }, 3700);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Manual control (for dot navigation)
    const handleDot = (idx: number) => {
        setActive(idx);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActive((a) => (a + 1) % CARD_DATA.length);
            }, 3700);
        }
    };

    return (
        <section className="relative w-full bg-[#222836] py-20 px-4 flex items-center justify-center overflow-hidden">
            {/* Soft-pattern overlay background for subtle aviation theme */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/plane.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-10"
                    priority={false}
                />
                <div
                    aria-hidden
                    className="absolute inset-0 bg-[#222836] opacity-70"
                    style={{ mixBlendMode: "multiply" }}
                ></div>
            </div>
            <motion.div
                className="relative z-10 mx-auto w-full max-w-6xl flex flex-col items-center"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.36 }}
            >
                <motion.h2
                    className="text-3xl md:text-4xl font-extrabold text-white text-center mb-4 tracking-tight drop-shadow-md"
                    variants={fadeUpVariants as any}
                >
                    Why Join <span className="text-[#42A5F5] underline underline-offset-4">NAAPE?</span>
                </motion.h2>
                <motion.p
                    className="text-[#bfc8de] text-base max-w-2xl text-center mb-11 mx-auto font-medium"
                    variants={fadeUpVariants as any}
                    transition={{ delay: 0.22, duration: 0.6, type: "spring" }}
                >
                    Join Nigeria’s premier organization for aviation professionals. Membership with NAAPE connects you to a powerful community, unlocks exclusive opportunities, and supports your journey from student to leader.
                </motion.p>
                {/* Mobile: Slideshow */}
                <div className="w-full flex flex-col items-center md:hidden">
                    <div className="w-full flex justify-center mb-3" style={{ minHeight: 290 }}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                variants={cardVariants as any}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className={`flex-1 w-full ${CARD_DATA[active].bg} rounded-2xl shadow-xl px-8 py-10 max-w-xs flex flex-col items-center text-center gap-4 border border-[#e6eaf3]/60`}
                            >
                                <span className="text-[#2852B4] bg-white shadow-md rounded-full p-3 mb-1">
                                    {CARD_DATA[active].icon}
                                </span>
                                <div className="font-semibold text-xl md:text-[1.35rem] text-[#1A2340]">
                                    {CARD_DATA[active].title}
                                </div>
                                <div className="text-[#485669] text-[1rem] md:text-[1.08rem] font-medium">
                                    {CARD_DATA[active].description}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex gap-2 mt-1 justify-center items-center">
                        {CARD_DATA.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to card ${i + 1}`}
                                className={`
                                    h-2.5 w-2.5 rounded-full 
                                    ${i === active ? "bg-[#2852B4] scale-110" : "bg-[#D7DDF1]"}
                                    transition-all
                                `}
                                style={{ transition: "background .2s, transform .2s" }}
                                onClick={() => handleDot(i)}
                                type="button"
                            />
                        ))}
                    </div>
                </div>
                {/* Desktop: Show all cards */}
                <motion.div
                    className="w-full hidden md:flex flex-row md:items-stretch gap-8 md:gap-7 justify-center items-center"
                    variants={containerVariants}
                >
                    {CARD_DATA.map((card, idx) => (
                        <motion.div
                            key={card.title}
                            className={`flex-1 w-full ${card.bg} rounded-2xl shadow-xl px-8 py-10 max-w-xs flex flex-col items-center text-center gap-4 border border-[#e6eaf3]/60`}
                            variants={cardVariants as any}
                            whileHover={{
                                scale: 1.045,
                                boxShadow: "0 8px 32px 0 rgba(66,165,245,0.13)",
                            }}
                            transition={{ type: "spring", stiffness: 250, damping: 19 }}
                        >
                            <span className="text-[#2852B4] bg-white shadow-md rounded-full p-3 mb-1">
                                {card.icon}
                            </span>
                            <div className="font-semibold text-xl md:text-[1.35rem] text-[#1A2340]">
                                {card.title}
                            </div>
                            <div className="text-[#485669] text-[1rem] md:text-[1.08rem] font-medium">
                                {card.description}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
