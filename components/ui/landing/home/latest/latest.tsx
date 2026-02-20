"use client";

import { NewsCard } from "@/components/ui/custom/news.card";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const newsList = [
    {
        imageUrl: "/home/news1.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices.",
        publishedAt: "2024-05-05T10:00:00Z",
        authorName: "Samuel Ajayi",
        authorRole: "Member",
        linkUrl: "/latest/tenants-of-safety-in-nigerian-aviation-industry",
        category: "Publication",
    },
    {
        imageUrl: "/home/minister.jpeg",
        title: "Meet the New Aviation Minister: A Vision for Safer Skies",
        summary: "NAAPE meets with the new Minister of Aviation to discuss future prospects and collaborative growth.",
        publishedAt: "2024-05-07T10:00:00Z",
        authorName: "NAAPE",
        authorRole: "Admin",
        linkUrl: "/latest/meet-the-new-aviation-minister-a-vision-for-safer-skies",
        category: "News",
    },
    {
        imageUrl: "/logo.png",
        title: "NAAPE Quarterly Magazine now out!",
        summary: "The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers.",
        publishedAt: "2024-05-11T10:00:00Z",
        authorName: "NAAPE",
        authorRole: "Admin",
        linkUrl: "/latest/naape-quarterly-magazine-now-out",
        category: "Publication",
    },
    {
        imageUrl: "/images/event1.jpg",
        title: "Aviation Safety Workshop: Best Practices Highlighted",
        summary: "Industry leaders gathered at NAAPE's national workshop to discuss effective safety protocols.",
        publishedAt: "2024-04-28T09:00:00Z",
        authorName: "Fatima Balogun",
        authorRole: "Member",
        linkUrl: "/latest/aviation-safety-workshop-best-practices-highlighted",
        category: "Publication",
    },
];

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } },
};

export default function LatestNews() {
    return (
        <section className="w-full max-w-6xl mx-auto py-24 px-6">
            <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <span className="text-sm font-bold text-accent tracking-widest uppercase mb-2 block">
                    What's New?
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                    Latest News & Publications
                </h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Stay up to date with the latest developments, insights, and publications from NAAPE and its partners.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
            >
                {newsList.map((news, index) => (
                    <motion.div key={index} variants={itemVariants}>
                        <NewsCard {...news} />
                    </motion.div>
                ))}
            </motion.div>

            <div className="flex justify-center mt-12">
                <Link href="/login">
                    <NaapButton className="bg-white border-2 border-slate-200 text-slate-900 hover:border-primary hover:text-primary font-bold px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-all hover:-translate-y-1 min-w-[280px]">
                        Submit Your Publication <ArrowRight size={18} />
                    </NaapButton>
                </Link>
            </div>
        </section>
    );
}
