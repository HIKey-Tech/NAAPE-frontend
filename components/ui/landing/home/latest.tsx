"use client";

import { useState, useEffect, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { NewsCard } from "@/components/ui/custom/news.card";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";

// Dynamically import NewsDetails for client-side routing to NewsDetails
const NewsDetails = dynamic(() => import("@/components/ui/custom/news.details"), { ssr: false });

// Dummy Latest News Data, with minimal example 'content' for NewsDetails. In reality this should come from the backend.
const newsList = [
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        content: `<p>Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.</p>`,
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        date: "2024-05-05T10:00:00Z",
        author: {
            name: "Samuel Ajayi",
            role: "Aviation Analyst",
        },
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Tenants of Safety in Nigerian Aviation Industry",
        content: `<p>Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.</p>`,
        summary: "Discover the central principles driving safety across Nigerian skies. Our experts weigh in on best practices, cutting-edge procedures, and regulatory milestones.",
        date: "2024-05-05T10:00:00Z",
        author: {
            name: "Samuel Ajayi",
            role: "Aviation Analyst",
        },
        category: "Insight",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Meet the New Aviation Minister: A Vision for Safer Skies",
        content: `<p>NAAPE meets with the new Minister of Aviation ... future prospects and collaborative growth to ensure Nigerian skies remain among Africa's safest.</p>`,
        summary: "NAAPE meets with the new Minister of Aviation to discuss future prospects and collaborative growth to ensure Nigerian skies remain among Africa's safest.",
        date: "2024-05-07T10:00:00Z",
        author: {
            name: "Ngozi Okoronkwo",
            role: "NAAPE Correspondent",
        },
        category: "Leadership",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "NAAPE Quarterly Magazine now out!",
        content: `<p>The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers, and news from the association’s leadership.</p>`,
        summary: "The latest NAAPE magazine features sector trends, regulatory updates, interviews with top engineers, and news from the association’s leadership.",
        date: "2024-05-11T10:00:00Z",
        author: {
            name: "Editorial Board",
            role: "NAAPE",
        },
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

// Maintain local state for whether to show NewsDetails (modal-style in this demo)
export default function LatestNews() {
    const [active, setActive] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // State for showing full news details (as pop-in modal/popup, or you could handle navigation)
    const [showDetails, setShowDetails] = useState<null | { index: number }>(null);

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

    // Util to map home news data to NewsDetails props for the modal/detail
    function getNewsDetailsProps(index: number) {
        const news = newsList[index];
        return {
            imageUrl: news.imageUrl,
            title: news.title,
            content: news.content,
            date: news.date,
            author: {
                name: news.author?.name || "",
                // avatarUrl: news.author?.avatarUrl || undefined, // removed because not on type
                role: news.author?.role || undefined,
            },
            category: news.category,
            backHref: "#",
            className: "",
        };
    }

    return (
        <motion.section
            className="w-full max-w-full mx-auto min-h-full p-6 my-6"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
            variants={containerVariants}
        >
            {/* NewsDetails popup using NewsDetails component */}
            <AnimatePresence>
                {showDetails !== null && (
                    <motion.div
                        key="detail-modal"
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ overflowY: "auto" }}
                        onClick={() => setShowDetails(null)}
                    >
                        <div
                            className="max-w-2xl mx-auto w-full p-2 sm:p-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <NewsDetails {...getNewsDetailsProps(showDetails.index)} />
                            <div className="flex justify-end mt-2">
                                <NaapButton onClick={() => setShowDetails(null)} variant="ghost" className="mt-2">Close</NaapButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <button
                                    style={{ display: "block", width: "100%", border: "none", background: "none", padding: 0, cursor: "pointer" }}
                                    onClick={() => setShowDetails({ index: active })}
                                    aria-label={`Read more about ${newsList[active].title}`}
                                >
                                    <NewsCard
                                        {...newsList[active]}
                                        authorName={newsList[active].author?.name || ""}
                                        linkUrl={`/news/naape/${encodeURIComponent(newsList[active].title.replace(/\s+/g, "-").toLowerCase())}`}
                                    />
                                </button>
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
                            <button
                                style={{ display: "block", width: "100%", border: "none", background: "none", padding: 0, cursor: "pointer" }}
                                onClick={() => setShowDetails({ index })}
                                aria-label={`Read more about ${news.title}`}
                            >
                                <NewsCard
                                    {...news}
                                    authorName={news.author?.name || ""}
                                    authorRole={news.author?.role || ""}
                                    linkUrl={`/news/naape/${encodeURIComponent(news.title.replace(/\s+/g, "-").toLowerCase())}`}
                                />
                            </button>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                className="flex justify-center mt-10"
                variants={buttonVariants as any}
            >
                <Link href="/news/naape" passHref >
                    <a>
                        <NaapButton
                            className="bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 text-base shadow transition"
                        >
                            View All
                        </NaapButton>
                    </a>
                </Link>
            </motion.div>
        </motion.section>
    );
}
