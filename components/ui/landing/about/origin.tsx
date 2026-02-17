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

export default function OriginSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-slate-50 w-full relative overflow-hidden">
            {/* Background date subtle */}
            <span className="absolute -left-10 top-20 text-[10rem] md:text-[15rem] font-black text-slate-200/40 -rotate-12 select-none pointer-events-none z-0">
                1984
            </span>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left: Content */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={containerVariants}
                    className="space-y-8 order-2 lg:order-1"
                >
                    <motion.div variants={fadeUpVariants as any}>
                        <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Origins</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            Laying the <span className="text-primary">Foundation</span>
                        </h2>
                    </motion.div>

                    <motion.div variants={fadeUpVariants as any} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            <span className="text-primary font-bold">Subsequently,</span> NAAPE held its maiden delegates Conference (May 17–18, 1984) at the Nigeria Airways Sports Club, C.I.A., Ikeja, Lagos.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            The Conference elected the first National Executive Council (NEC) – now National Administrative Council (NAC) – with <span className="text-slate-900 font-bold">Capt. Ade Olubadewo</span> (Aero Contractors) as first National President of NAAPE.
                        </p>
                        <div className="pt-4 border-t border-slate-100">
                            <p className="text-sm text-slate-500 italic">
                                The NEC appointed Comrade Michael Ekujumi as first General Secretary in June 1984.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right: Image */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative order-1 lg:order-2"
                >
                    <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 lg:-rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white">
                        <Image
                            src="/logo.png"
                            alt="NAAPE Early Days"
                            fill
                            className="object-contain p-8 bg-slate-100" // Logo usually needs contain if it's the logo
                        />
                        <div className="absolute inset-0 bg-primary/5 mix-blend-multiply" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
