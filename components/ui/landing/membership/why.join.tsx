"use client"

import { useState, useRef, useEffect } from "react";
import { Users, Lightbulb, Layers } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const CARD_DATA = [
    {
        icon: Users,
        title: "Vibrant Community",
        description: "Belong to a strong, collaborative network of Nigerian pilots and engineers sharing a passion for safety, growth, and advancement.",
    },
    {
        icon: Lightbulb,
        title: "Professional Growth",
        description: "Access members-only networking events, industry advocacy, leadership development, and career resources.",
    },
    {
        icon: Layers,
        title: "Membership for Every Stage",
        description: "Whether you're a Student, Associate, or Full Member, our tailored tiers support every step of your aviation career.",
    },
];

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function WhyJoinSection() {
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setActive((prev) => (prev + 1) % CARD_DATA.length);
        }, 4000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, []);

    return (
        <section className="relative w-full py-24 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-slate-900" />
            <div className="absolute inset-0">
                <Image src="/images/plane.jpg" alt="" fill className="object-cover opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto text-center">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={fadeUpVariants}
                >
                    <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Benefits</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                        Why Join <span className="text-accent">NAAPE?</span>
                    </h2>
                    <p className="text-lg text-slate-300 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                        Join Nigeria's premier organization for aviation professionals. Membership connects you to a powerful community and unlocks exclusive opportunities.
                    </p>
                </motion.div>

                {/* Desktop: 3-column grid */}
                <div className="hidden md:grid grid-cols-3 gap-8">
                    {CARD_DATA.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 group text-left"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon size={28} className="text-accent" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-slate-300 font-medium leading-relaxed">{card.description}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Mobile: Slideshow */}
                <div className="md:hidden" style={{ minHeight: 280 }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-left"
                        >
                            {(() => {
                                const Icon = CARD_DATA[active].icon; return (
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                                        <Icon size={28} className="text-accent" />
                                    </div>
                                );
                            })()}
                            <h3 className="text-xl font-bold text-white mb-3">{CARD_DATA[active].title}</h3>
                            <p className="text-slate-300 font-medium leading-relaxed">{CARD_DATA[active].description}</p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex justify-center gap-2 mt-6">
                        {CARD_DATA.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-accent" : "w-2.5 bg-white/30"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
