"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RightsAndResponsibilitiesPage() {
    return (
        <section className="py-24 pt-32 md:pt-40 px-6 md:px-12 bg-white w-full min-h-screen">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 order-last lg:order-first"
                >
                    <Image
                        src="/rightsnresponsibilities.jpg"
                        alt="Rights and Responsibilities"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">NAAPE Constitution</span>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            Rights & <span className="text-primary">Responsibilities</span>
                        </h1>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium mb-6">
                            The Constitution spells out the main rights and responsibilities of all NAAPE members. Below are some of the fundamental provisions:
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Every member of the Association shall have both right and duty to fully and freely participate in all activities of the Association as relevant sections of the Constitution permit.",
                                "Every member shall have the right to vote and be voted for at Branch and National levels, and at other organs of the Association without hindrance.",
                                "Voting shall be by person or by proxy. If by proxy, the proxy shall be a person who is entitled to vote, and shall have a written permission of the member given in the format approved by NAC.",
                                "Every member shall be entitled to be treated fairly by all organs and offices of the Association and in the case of disciplinary procedure shall be entitled to fair hearing.",
                                "Every member shall be entitled to be heard at all meetings which the member is entitled to attend by the Constitution."
                            ].map((item, index) => (
                                <li key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex-col items-center flex mt-1">
                                        <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-white shadow-sm" />
                                    </div>
                                    <p className="text-slate-700 text-sm md:text-base font-medium">{item}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}