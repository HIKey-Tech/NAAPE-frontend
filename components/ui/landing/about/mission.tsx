"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Users2 } from "lucide-react";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 50,
            damping: 15,
            duration: 0.6,
        },
    },
};

// Micro animation for icon "wobble"
const iconMicroAnim = {
    rest: { scale: 1, rotate: 0 },
    hover: {
        scale: 1.1,
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.4 }
    }
};

export default function MissionSection() {
    return (
        <motion.section
            className="relative w-full bg-slate-900 py-24 px-6 flex flex-col items-center overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
        >
            {/* Visual Motif: subtle faded icons */}
            <span aria-hidden="true" className="pointer-events-none opacity-[0.03] absolute left-10 top-10 hidden md:block">
                <Users2 size={200} className="text-white" />
            </span>
            <span aria-hidden="true" className="pointer-events-none opacity-[0.03] absolute -right-20 bottom-0 hidden md:block">
                <Eye size={250} className="text-white" />
            </span>

            <motion.div variants={fadeUpVariants as any} className="z-10 text-center mb-16 max-w-3xl">
                <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-6">
                    Our <span className="text-accent">Guiding Principles</span>
                </h2>
                <p className="text-slate-400 text-lg md:text-xl font-medium">
                    Guiding the future of Nigerian aviation through unwavering commitment to our core principles.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-stretch z-10"
                variants={containerVariants}
            >
                {/* Mission Card */}
                <motion.div
                    className="relative flex flex-col items-center text-center p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    variants={fadeUpVariants as any}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                >
                    <motion.div
                        className="bg-accent/20 p-4 rounded-2xl mb-6 group-hover:bg-accent/30 transition-colors"
                        variants={iconMicroAnim as any}
                    >
                        <ArrowUpRight size={32} className="text-accent" />
                    </motion.div>
                    <h3 className="font-bold text-white text-2xl mb-4">Mission</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Championing safety, skill, and solidarity, advocating broadly, protecting our own, and nurturing aviation’s future.
                    </p>
                </motion.div>

                {/* Vision Card */}
                <motion.div
                    className="relative flex flex-col items-center text-center p-10 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    variants={fadeUpVariants as any}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                >
                    <motion.div
                        className="bg-accent/20 p-4 rounded-2xl mb-6 group-hover:bg-accent/30 transition-colors"
                        variants={iconMicroAnim as any}
                    >
                        <Eye size={32} className="text-accent" />
                    </motion.div>
                    <h3 className="font-bold text-white text-2xl mb-4">Vision</h3>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Together, pilots, engineers, stories, we are the horizon where tomorrow’s possibilities take flight.
                    </p>
                </motion.div>
            </motion.div>
        </motion.section>
    );
}
