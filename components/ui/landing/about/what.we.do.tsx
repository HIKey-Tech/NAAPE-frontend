"use client"

import { Briefcase, ShieldCheck, TrendingUp, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const whatWeDoItems = [
    {
        icon: Briefcase,
        title: "Representation",
        description: "Advocating for the rights and welfare of pilots and engineers across the industry."
    },
    {
        icon: ShieldCheck,
        title: "Safety",
        description: "Championing the highest safety standards in Nigerian aviation operations."
    },
    {
        icon: TrendingUp,
        title: "Growth",
        description: "Promoting professional development and career advancement for our members."
    },
    {
        icon: Handshake,
        title: "Integrity",
        description: "Upholding ethical practices and fostering trust within the aviation community."
    },
];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function WhatWeDoSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white w-full text-center">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                className="max-w-4xl mx-auto mb-16"
            >
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Mission</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                    What We Do
                </h2>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {whatWeDoItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.title}
                            variants={fadeUpVariants as any}
                            className="bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group text-left"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <Icon size={28} className="text-primary group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
