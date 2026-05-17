"use client";

import { LeaderCard } from "@/components/ui/custom/leadercard";
import { motion } from "framer-motion";

const leaders = [
    {
        name: "Captain Bunmi Gindeh",
        title: "National President",
        photoSrc: "/members/captain bunmi.png",
        socials: { twitter: "#", linkedin: "#" },
    },
    {
        name: "Engr. Adebayo Oluyemi",
        title: "Deputy National President",
        photoSrc: "/members/Adebayo.jpg",
        socials: { linkedin: "#" },
    },
    {
        name: "Engr. Richard Allison",
        title: "Vice President, Engineers",
        photoSrc: "/members/richard.jpg",
        socials: { twitter: "#" },
    },
    {
        name: "Capt. Yakubu Ducas",
        title: "Vice President, Pilots",
        photoSrc: "/members/yakubu.jpg",
        socials: { linkedin: "#" },
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

export default function LeadershipTimelineSection() {
    return (
        <section className="py-24 px-6 md:px-12 bg-slate-50 w-full text-center">
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                className="max-w-4xl mx-auto mb-16"
            >
                <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Leadership</span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                    Meet Our Leaders
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    Our leaders are custodians of excellence, history and service in Nigerian aviation.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {leaders.map((leader, index) => (
                    <motion.div key={index} variants={fadeUpVariants as any}>
                        <LeaderCard
                            {...leader}
                            className="bg-white border text-left border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all hover:-translate-y-1 duration-300 rounded-3xl overflow-hidden"
                        />
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
