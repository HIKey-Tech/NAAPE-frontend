"use client"

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function BirthSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-white w-full">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative"
                >
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 lg:rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="/gallery/1.jpeg"
                            alt="Historic photo: Early Nigerian pilots and engineers"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                    </div>
                    {/* Floating Caption */}
                    <div className="absolute -bottom-6 -right-6 md:right-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-xs">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-accent/10 rounded-full text-accent">
                                <Calendar size={18} />
                            </div>
                            <span className="font-bold text-slate-900 text-sm">April 1984</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Delegates of APFEAN and NAAATE, Lagos – the merging of legacies.</p>
                    </div>
                </motion.div>

                {/* Right: Content */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="space-y-8"
                >
                    <motion.div variants={fadeUpVariants as any}>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Founding Milestone</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            The Birth of <span className="text-primary">NAAPE</span>
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            NAAPE was established exclusively to champion the interests of Aircraft Pilots and Engineers. For decades, it has been a beacon for unity and progress.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUpVariants as any} className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-col items-center hidden md:flex">
                                <div className="w-4 h-4 rounded-full bg-accent ring-4 ring-white shadow-lg z-10" />
                                <div className="w-0.5 h-full bg-slate-100 -mt-2" />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-lg mb-2">
                                    <span className="text-accent">April 16, 1984</span>
                                    <span className="text-slate-300 mx-2">|</span>
                                    The Union
                                </h4>
                                <p className="text-slate-500">Leaders of APFEAN and NAAATE unite to form a single, new association.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-col items-center hidden md:flex">
                                <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-white shadow-lg z-10" />
                                <div className="w-0.5 h-full bg-slate-100 -mt-2" />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-lg mb-2">
                                    <span className="text-primary">Adoption of NAAPE</span>
                                </h4>
                                <p className="text-slate-500">The name "National Association of Aircraft Pilots and Engineers" is officially adopted.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-col items-center hidden md:flex">
                                <div className="w-4 h-4 rounded-full bg-secondary ring-4 ring-white shadow-lg z-10" />
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex-1">
                                <h4 className="flex items-center gap-2 font-bold text-slate-900 text-lg mb-2">
                                    <span className="text-secondary">August 16, 1985</span>
                                    <span className="text-slate-300 mx-2">|</span>
                                    Official Registration
                                </h4>
                                <p className="text-slate-500">NAAPE is formally registered as a trade union (certificate #008).</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
