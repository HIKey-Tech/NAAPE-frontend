"use client"

import Image from "next/image";
import { FaRegCalendarCheck, FaChalkboardTeacher } from "react-icons/fa";
import { MdSecurity, MdTrendingUp } from "react-icons/md";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 50, damping: 15 }
    }
};

export default function WhyJoinSection() {
    const pillars = [
        {
            icon: <FaRegCalendarCheck />,
            title: "Advocacy & Welfare",
            text: "Advocating the rights and improving the working conditions for all our members",
            color: "text-primary",
            bg: "bg-primary/5"
        },
        {
            icon: <FaChalkboardTeacher />,
            title: "World-Class Training",
            text: "Providing access to world-class training programs to ensure members are globally competitive.",
            color: "text-indigo-500",
            bg: "bg-indigo-50"
        },
        {
            icon: <MdSecurity />,
            title: "Safety Standards",
            text: "Promoting and upholding the highest safety standards across the Nigerian aviation industry.",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            icon: <MdTrendingUp />,
            title: "Growth & Networking",
            text: "Creating opportunities for career growth, networking, and continuous learning.",
            color: "text-amber-500",
            bg: "bg-amber-50"
        }
    ];

    return (
        <section className="py-24 px-6 md:px-12 bg-white w-full">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                {/* Left Content */}
                <motion.div
                    className="flex-1 w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.div variants={itemVariants} className="inline-block bg-primary/10 text-primary font-bold text-xs tracking-widest uppercase rounded-full px-4 py-1.5 mb-6">
                        Why Join NAAPE
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                        Championing <span className="text-primary">Excellence</span>, <span className="text-primary">Integrity</span> & <span className="text-primary">Growth</span>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-lg text-slate-600 font-medium mb-10 max-w-xl leading-relaxed">
                        NAAPE empowers pilots and engineers through advocacy, access to global opportunities, and a commitment to the highest safety and professional standards.
                    </motion.p>

                    <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        {pillars.map((pillar, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                            >
                                <div className={`w-12 h-12 shrink-0 flex items-center justify-center rounded-xl text-xl ${pillar.bg} ${pillar.color}`}>
                                    {pillar.icon}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{pillar.title}</h3>
                                    <p className="text-slate-500 text-sm leading-snug">{pillar.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Link href="/membership">
                            <NaapButton className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                                Become A Member
                            </NaapButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    className="flex-1 w-full"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-[4/5] lg:aspect-square">
                        <Image
                            src="/images/event1.jpg"
                            alt="Jet airplane"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
