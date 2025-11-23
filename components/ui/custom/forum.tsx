"use client";
import React, { useMemo } from "react";
import PublicationCard from "@/components/member/component/publication.card";
import { usePublications } from "@/hooks/usePublications";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdInfoOutline } from "react-icons/md";

// Animate entrance/exit and layout
const staggerContainer = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.09 },
    },
};

const cardEffect = {
    hidden: { opacity: 0, y: 32, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.37, ease: [0.3, 0.5, 0.2, 1] } },
};

const shimmer =
    "bg-gradient-to-r from-[#e3e8f0] via-[#f5f7fa] to-[#e3e8f0] animate-pulse";

const PublicationCardSkeleton = () => (
    <div className="rounded-xl bg-white/80 border p-4 flex flex-col gap-4 shadow-sm min-h-[220px]">
        <div className={`h-40 w-full rounded-lg ${shimmer}`}></div>
        <div className={`h-5 w-3/4 rounded ${shimmer}`}></div>
        <div className={`h-4 w-1/2 rounded ${shimmer}`}></div>
        <div className={`h-4 w-5/6 rounded ${shimmer}`}></div>
    </div>
);

const Forum: React.FC = () => {
    const { data: publications, isPending: loading, error } = usePublications('approved');
    const [search, setSearch] = React.useState("");
    const pubList = useMemo(() => {
        return (publications ?? []).filter((pub) =>
            pub.title?.toLowerCase().includes(search.toLowerCase()) ||
            pub.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
            pub.content?.toLowerCase().includes(search.toLowerCase())
        );
    }, [publications, search]);

    return (
        <section className="max-w-full mx-auto w-full px-2 md:px-6 py-7">
            {/* Modernized Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#20345D] via-[#5286f6] to-[#41c2ec] drop-shadow-sm">
                        Forum Discussions
                    </h1>
                    <p className="text-base text-[#3d4f6e] mt-1 flex items-center gap-1">
                        <MdInfoOutline className="inline text-[#5795ec]" />
                        Community insights, Q&A and member publications.
                    </p>
                </div>
                {/* Modern search box */}
                <div className="flex items-center rounded-xl bg-[#f4f6fb] border border-[#d0e1f7] px-3 py-1.5 shadow-sm max-w-xs w-full">
                    <MdSearch className="mr-2 text-xl text-[#a7b4ce]" />
                    <input
                        type="text"
                        className="bg-transparent outline-none flex-1 text-sm text-[#234]"
                        placeholder="Search publications, topics, authors..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Publication Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10 min-h-[420px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PublicationCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="py-16 flex flex-col items-center justify-center text-red-600 text-lg font-medium">
                    <svg width="56" height="56" fill="none" className="mb-5 text-red-300">
                        <circle cx="28" cy="28" r="28" fill="#fbeaea" />
                        <path d="M18 18l20 20M38 18l-20 20" stroke="#e35353" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Failed to load publications. Please try refreshing or check back later.
                </div>
            ) : pubList.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center text-[#a0adbb]">
                    <svg width="56" height="56" fill="none" className="mb-4">
                        <ellipse cx="28" cy="28" rx="27" ry="22" fill="#f5f7fa" />
                        <path d="M19 30c1-3 4-6 9-6s8 3 9 6" stroke="#c1cbe2" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="22.5" cy="25.5" r="2.5" fill="#d2deee" />
                        <circle cx="33.5" cy="25.5" r="2.5" fill="#d2deee" />
                        <rect x="18" y="36" width="20" height="2.5" rx="1" fill="#e8effb" />
                    </svg>
                    <div className="text-xl font-semibold mb-1">No results found</div>
                    <div className="text-sm">Try adjusting your search, or check back for new publications.</div>
                </div>
            ) : (
                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    >
                        {pubList.map((pub) => (
                            <motion.div
                                key={pub._id || pub.title}
                                variants={cardEffect as any}
                                whileHover={{
                                    scale: 1.035,
                                    boxShadow: "0 8px 32px 0 rgba(41,87,230,.08), 0 0 0 1px #77b6ff66",
                                }}
                                whileTap={{ scale: 0.98 }}
                                layout
                                className="bg-gradient-to-br from-[#f5f7fa] via-white to-[#f0f2f8] rounded-2xl border border-[#e3e8f0] shadow-md/20 hover:shadow-lg transition-shadow duration-200"
                            >
                                <PublicationCard publication={pub} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
        </section>
    );
};

export default Forum;
