"use client"

import { Briefcase, ShieldCheck, BarChart2, Handshake } from "lucide-react";
import { motion } from "framer-motion";

// Less literal, more suggestive storytelling; less explanatory copy
const whatWeDoItems = [
    {
        icon: Briefcase,
        title: "Representation",
    },
    {
        icon: ShieldCheck,
        title: "Safety",
    },
    {
        icon: BarChart2,
        title: "Growth",
    },
    {
        icon: Handshake,
        title: "Integrity",
    },
];

// Animation variant for the cards
const cardVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.13,
            duration: 0.66,
            type: "spring",
            stiffness: 48,
            damping: 12,
        },
    }),
};

export default function WhatWeDoSection() {
    return (
        <motion.section
            className="w-full py-20 px-4 md:px-0 flex flex-col items-center bg-white"
            aria-labelledby="whatwedo-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.22 }}
            transition={{ staggerChildren: 0.14 }}
        >
            <motion.h2
                id="whatwedo-title"
                className="text-neutral-900 text-3xl md:text-4xl font-black tracking-tight mb-14 text-center uppercase"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.60, delay: 0.01, type: "spring", stiffness: 64, damping: 13 }}
                viewport={{ once: true }}
            >
                What We Do
            </motion.h2>
            <div
                className="
                    w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-10
                "
                role="list"
                aria-label="Ambiguous Focus Areas"
            >
                {whatWeDoItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.title}
                            className="
                                group flex flex-col items-center text-center
                                border-2 border-neutral-900/70 bg-white
                                rounded-xl transition
                                px-0 py-8 md:py-10 h-full
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                            tabIndex={0}
                            role="listitem"
                            aria-label={item.title}
                            initial="hidden"
                            whileInView="visible"
                            custom={idx}
                            variants={cardVariants as any}
                            viewport={{ once: true, amount: 0.18 }}
                        >
                            <span
                                className="
                                    flex items-center justify-center
                                    w-16 h-16 mb-6 rounded-full border-2
                                    border-blue-500 bg-blue-50
                                    group-hover:border-neutral-900/80
                                    transition
                                "
                                aria-hidden="true"
                            >
                                <Icon
                                    size={36}
                                    strokeWidth={2.1}
                                    className="text-blue-500"
                                />
                            </span>
                            <h3 className="text-xl md:text-2xl font-bold uppercase text-neutral-900 tracking-wide mb-0">
                                {item.title}
                            </h3>
                        </motion.div>
                    );
                })}
            </div>
        </motion.section>
    );
}
