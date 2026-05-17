"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function FutureSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white w-full">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
                {/* Left: Content */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="flex-1 space-y-8"
                >
                    <motion.div variants={fadeUpVariants as any}>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Vision</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            Flying the Future of <br />
                            <span className="text-primary">Nigerian Aviation</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeUpVariants as any} className="space-y-6">
                        <div className="flex gap-4 items-start">
                            <Quote className="text-accent shrink-0 rotate-180" size={32} />
                            <p className="text-xl font-bold text-slate-900 italic">
                                "We Do Right For Safety"
                            </p>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Since its inception, NAAPE has stood as the home and hub for Nigeria's frontline aviation professionals. In every era, NAAPE’s steadfast voice has championed safe flight operations and the full autonomy of the sector’s regulator.
                        </p>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="font-bold text-slate-900 mb-2">Current Leadership</h4>
                            <p className="text-slate-600 mb-1"><span className="font-bold text-primary">President:</span> Captain Bunmi Gindeh</p>
                            <p className="text-slate-600"><span className="font-bold text-primary">Affiliation:</span> Nigeria Labour Congress (NLC)</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right: Grid of Images */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {[2, 3, 4, 5, 6, 7].map((num) => (
                        <div key={num} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300">
                            <Image
                                src={`/gallery/${num}.jpeg`}
                                alt={`Historic Gallery ${num}`}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
