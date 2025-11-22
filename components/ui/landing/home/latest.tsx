"use client";

import { useState, useEffect, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { NewsCard } from "@/components/ui/custom/news.card";
import { motion, AnimatePresence } from "framer-motion";

// Dummy Latest News Data
const newsList = [
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        authorName: "Samuel Ajayi",
        authorRole: "Aviation Analyst",
        authorAvatarUrl: "",
        linkUrl: "/news/safety-nigerian-aviation",
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        authorName: "Samuel Ajayi",
        authorRole: "Aviation Analyst",
        authorAvatarUrl: "",
        linkUrl: "/news/safety-nigerian-aviation",
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Meet the New Aviation Minister: A Vision for Safer Skies",
        summary: "NAAPE meets with the new Minister of Aviation to discuss future prospects and collaborative growth to ensure Nigerian skies remain among Africa's safest.",
        authorName: "Ngozi Okoronkwo",
        authorRole: "NAAPE Correspondent",
        authorAvatarUrl: "",
        linkUrl: "/news/new-aviation-minister",
        category: "Leadership",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "NAAPE Quarterly Magazine now out!",
        summary: "The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers, and news from the association’s leadership.",
        authorName: "Editorial Board",
        authorRole: "NAAPE",
        authorAvatarUrl: "",
        linkUrl: "/news/naape-magazine-issue",
        category: "Publication",
    },
];

// Framer Motion variants

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.08,
        },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 65, damping: 17, duration: 0.48 },
    },
};

const staggerCards = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.15,
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 32, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 75, damping: 14, duration: 0.38 }
    },
};

const buttonVariants = {
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 65, damping: 12, delay: 0.23, duration: 0.33 },
    },
};

// Slideshow arrows
function SlideArrows({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            <button
                type="button"
                aria-label="Previous"
                onClick={onPrev}
                className="text-primary bg-white border border-[#D6DBEA] rounded-full p-1 shadow hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={current === 0}
            >
                <svg width="28" height="28" fill="none"><path d="M17 20l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span className="text-xs text-[#233]">{current + 1} / {total}</span>
            <button
                type="button"
                aria-label="Next"
                onClick={onNext}
                className="text-primary bg-white border border-[#D6DBEA] rounded-full p-1 shadow hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={current === total - 1}
            >
                <svg width="28" height="28" fill="none"><path d="M11 8l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
        </div>
    )
}

export default function LatestNews() {
    // State for slideshow (mobile)
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up interval if component unmounts (prevent memory leaks)
    useEffect(() => {
        // Only run auto-slide on mobile (<640px)
        const checkMobile = () =>
            typeof window !== "undefined" && window.innerWidth < 640;

        if (checkMobile()) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActive((v) => (v + 1) % newsList.length);
            }, 4000);
        }

        // Clean up interval on unmount or when viewport changes
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    // Manual navigation (reset timer when arrows used)
    const handlePrev = () => {
        setActive((v) => (v > 0 ? v - 1 : 0));
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActive((v) => (v + 1) % newsList.length);
            }, 4000);
        }
    };
    const handleNext = () => {
        setActive((v) => (v < newsList.length - 1 ? v + 1 : 0));
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActive((v) => (v + 1) % newsList.length);
            }, 4000);
        }
    };

    return (
        <motion.section
            className="w-full max-w-full mx-auto min-h-full p-6 my-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
            variants={containerVariants}
        >
            <motion.div className="mb-8 flex flex-col items-center ">
                <motion.span
                    className="text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase mb-2"
                    variants={fadeUp as any}
                >
                    WHAT&apos;S NEW?
                </motion.span>
                <motion.h2
                    className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-1 text-center"
                    variants={fadeUp as any}
                >
                    Latest News &amp; Publications
                </motion.h2>
                <motion.p
                    className="text-[#5B6170] text-base md:text-lg font-normal mt-2 text-center max-w-2xl"
                    variants={fadeUp as any}
                >
                    Stay up to date with the latest developments, insights, and publications from NAAPE and its partners.
                </motion.p>
            </motion.div>

            {/* Slideshow on mobile, grid on sm+ */}
            <div>
                {/* Mobile: show slideshow */}
                <div className="block sm:hidden">
                    <div className="relative min-h-[370px]">
                        <AnimatePresence initial={false} mode="wait">
                            <motion.div
                                key={active}
                                className="w-full"
                                initial={{ opacity: 0, x: 60 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -60 }}
                                transition={{ type: "spring", stiffness: 55, damping: 16, duration: 0.34 }}
                            >
                                <NewsCard {...newsList[active]} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <SlideArrows
                        current={active}
                        total={newsList.length}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                </div>

                {/* Grid on bigger screens */}
                <motion.div
                    className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4"
                    variants={staggerCards}
                >
                    {newsList.map((news, index) => (
                        <motion.div key={index} variants={cardVariants as any}>
                            <NewsCard {...news} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="flex justify-center mt-10"
                variants={buttonVariants as any}
            >
                <a href="/news">
                    <NaapButton
                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 text-base shadow transition"
                    >
                        View All
                    </NaapButton>
                </a>
            </motion.div>
        </motion.section>
    );
}
