"use client";
import React, { useMemo, useRef } from "react";
import PublicationCard from "@/components/member/component/publication.card";
import { usePublications } from "@/hooks/usePublications";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdInfoOutline } from "react-icons/md";

// Micro-animations and layout tweaks
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
    exit: { opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.28, ease: [0.45, 0.45, 0.15, 1] } }
};

// Micro-animated shimmer for skeletons
const shimmer = "bg-[#ecf2fa] animate-pulse";

const PublicationCardSkeleton = () => (
    <motion.div
        className="rounded-xl bg-white border border-[#e0e5ef] p-4 flex flex-col gap-4 min-h-[220px] shadow-xs"
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        transition={{ duration: 0.35, ease: [0.3, 0.5, 0.2, 1] }}
    >
        <div className={`h-40 w-full rounded-lg ${shimmer}`}></div>
        <div className={`h-5 w-3/4 rounded ${shimmer}`}></div>
        <div className={`h-4 w-1/2 rounded ${shimmer}`}></div>
        <div className={`h-4 w-5/6 rounded ${shimmer}`}></div>
    </motion.div>
);

const InfoStrip = ({ icon, title, text, color, bg }: { icon: React.ReactNode; title: string; text?: string; color?: string; bg?: string }) => (
    <motion.div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-3 font-medium text-sm ${
            bg ? bg : "bg-[#f0f3fa]"
        }`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.33 }}
    >
        <span className="flex items-center text-xl animate-[pulse_1.2s_ease-in-out_infinite]" style={color ? { color } : {}}>
            {icon}
        </span>
        <span className="font-semibold text-[#143063]">{title}</span>
        {text && <span className="text-[#51607a] text-xs font-normal ml-2">{text}</span>}
    </motion.div>
);

const Forum: React.FC = () => {
    const { data: publications, isPending: loading, error } = usePublications("approved");
    const [search, setSearch] = React.useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    const pubList = useMemo(() => {
        return (publications ?? []).filter((pub) =>
            pub.title?.toLowerCase().includes(search.toLowerCase()) ||
            pub.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
            pub.content?.toLowerCase().includes(search.toLowerCase())
        );
    }, [publications, search]);

    // Micro-animation: wiggle + focus ring for search input on focus/tap
    const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
        const el = e.currentTarget;
        el.classList.add("ring-2", "ring-[#5db1fd]", "animate-jiggle");
        setTimeout(() => {
            el.classList.remove("ring-2", "ring-[#5db1fd]", "animate-jiggle");
        }, 200);
    };

    return (
        <section className="max-w-full mx-auto w-full px-2 md:px-6 py-7">
            {/* Improved Visual Hierarchy Header */}
            <motion.div
                className="w-full max-w-5xl mx-auto flex flex-col gap-0 mb-8"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.43 }}
            >
                <motion.h1
                    className="text-[2.1rem] md:text-[2.7rem] font-black text-[#15406E] leading-tight tracking-tight mb-[2px]"
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.04, duration: 0.32 }}
                >
                    Forum Discussions
                </motion.h1>
                <InfoStrip
                    icon={<MdInfoOutline aria-hidden="true" />}
                    title="Community Q&A"
                    text="Share knowledge, ask questions, and engage with other members about publications."
                    color="#3186d1"
                />
                <div className="flex flex-col md:flex-row md:items-end gap-3 mt-2 mb-1">
                    <div className="flex-1 flex items-end gap-3">
                        <label
                            htmlFor="forum-search"
                            className="font-semibold text-[#4062AD] mr-2 text-sm flex items-center gap-1"
                            style={{ minWidth: 72 }}
                        >
                            <MdSearch className="inline-block text-[#a7b4ce] align-middle mr-1 -mt-1 animate-[pulse_2s_ease-in-out_infinite]" />
                            Search
                        </label>
                        <input
                            id="forum-search"
                            ref={searchInputRef}
                            type="text"
                            className="flex-1 text-[15px] rounded-lg border border-[#aac6ef] px-3 py-2 bg-white focus:ring-2 focus:ring-[#207de0] focus:border-[#2b373f] text-[#20344D] placeholder-[#93a5be] font-medium transition-all duration-200 outline-none shadow-sm will-change-transform"
                            style={{ minWidth: 0 }}
                            placeholder="Search publications, topics, authors..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onPointerDown={handlePointerDown}
                            onFocus={e => e.currentTarget.classList.add("scale-[1.03]")}
                            onBlur={e => e.currentTarget.classList.remove("scale-[1.03]")}
                            aria-label="Search publications, topics, authors"
                        />
                    </div>
                    <AnimatePresence>
                        {pubList.length > 0 && (
                            <motion.span
                                className="ml-auto px-2 py-1 text-xs rounded font-bold bg-[#e8f2fc] text-[#1d4b83] border border-[#cbe3fa] shadow-sm items-center justify-center flex animate-fade-in"
                                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                                transition={{ duration: 0.24 }}
                            >
                                {pubList.length} publication{pubList.length > 1 ? "s" : ""} found
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Publication Cards */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-10 min-h-[420px]">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PublicationCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <motion.div
                    className="max-w-2xl mx-auto text-center py-20"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex flex-col items-center">
                        <motion.svg width="48" height="48" aria-hidden className="mb-4 animate-bounce" initial={{ scale: 0.97 }} animate={{ scale: 1 }} transition={{ duration: 0.23 }}>
                            <circle cx="24" cy="24" r="24" fill="#fdeaea" />
                            <path d="M16 16l16 16M32 16l-16 16" stroke="#e35353" strokeWidth="2" strokeLinecap="round" />
                        </motion.svg>
                        <div className="text-lg font-extrabold text-[#C33732] mb-1 animate-fade-in">Unable to load publications</div>
                        <div className="text-[#af4a48] text-sm mb-2 animate-fade-in">There was a problem retrieving forum publications and posts.</div>
                        <div className="text-xs text-[#bfa5a5] animate-fade-in">Please refresh your browser or try again later. Contact support if the problem persists.</div>
                    </div>
                </motion.div>
            ) : pubList.length === 0 ? (
                <motion.div
                    className="max-w-2xl mx-auto text-center py-16 flex flex-col items-center bg-[#f7fafd] rounded-xl border border-[#e6eaf3]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.svg width="56" height="56" fill="none" className="mb-3 animate-fade-in-up" initial={{ scale: 0.96 }} animate={{ scale: 1 }} transition={{ duration: 0.18 }}>
                        <ellipse cx="28" cy="28" rx="27" ry="22" fill="#f2f5fc" />
                        <path d="M19 30c1-3 4-6 9-6s8 3 9 6" stroke="#b5bedd" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="22.5" cy="25.5" r="2.5" fill="#c9d4eb" />
                        <circle cx="33.5" cy="25.5" r="2.5" fill="#c9d4eb" />
                        <rect x="18" y="36" width="20" height="2.5" rx="1" fill="#dde9fa" />
                    </motion.svg>
                    <div className="text-lg font-extrabold text-[#222E45] mb-1 animate-fade-in">No Publications Found</div>
                    <div className="text-sm text-[#5976a5] mb-2 animate-fade-in">
                        We didn't find any results.
                    </div>
                    <div className="text-xs text-[#8c97a7] animate-fade-in">
                        Tip: Try a different search term, clear your filter, or check back later for new discussions.
                    </div>
                </motion.div>
            ) : (
                <AnimatePresence>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                    >
                        {pubList.map((pub, i) => (
                            <motion.div
                                key={pub._id || pub.title}
                                variants={cardEffect as any}
                                whileHover={{
                                    scale: 1.032,
                                    borderColor: "#2990e4",
                                    background: "#f6fafd",
                                    boxShadow: "0 2px 24px -6px rgba(36,98,181,0.10), 0 1px 0px #f5fbff"
                                }}
                                whileTap={{ scale: 0.985 }}
                                layout
                                className="bg-white rounded-2xl border border-[#e0eaf7] transition-all duration-200 p-0 cursor-pointer relative will-change-transform group"
                                aria-label={`Publication: ${pub.title}${pub.author ? " by " + pub.author.name : ""}`}
                                tabIndex={0}
                                onPointerDown={e => {
                                    e.currentTarget.classList.add("ring-2", "ring-[#a9cdfd]");
                                    setTimeout(() => { e.currentTarget.classList.remove("ring-2", "ring-[#a9cdfd]"); }, 170);
                                }}
                            >
                                {/* Micro-animation: subtle pulse icon on hover */}
                                <motion.div
                                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200"
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    whileHover={{ opacity: 1, scale: 1.07 }}
                                    transition={{ duration: 0.23 }}
                                    aria-hidden="true"
                                >
                                    <MdInfoOutline className="text-[#b3c8f2] animate-pulse pointer-events-none" size={16} />
                                </motion.div>
                                <PublicationCard publication={pub} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}
            {/* Micro-animation: page fade-in */}
            <style jsx global>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1 }
                    50% { opacity: 0.65 }
                }
                .animate-pulse {
                    animation: pulse 1.4s cubic-bezier(.4,0,.6,1) infinite;
                }
                .animate-jiggle {
                    animation: jiggle 0.16s linear 1;
                }
                @keyframes jiggle {
                    0% { transform: scale(1) rotate(-2deg);}
                    30% { transform: scale(1.0305) rotate(2deg);}
                    60% { transform: scale(1.025) rotate(-1deg);}
                    100% { transform: scale(1) rotate(0deg);}
                }
                .animate-fade-in {
                    animation: fadeIn 0.48s cubic-bezier(.4,0,.2,1);
                }
                @keyframes fadeIn {
                    from { opacity: 0 }
                    to { opacity: 1 }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.42s cubic-bezier(.4,0,.2,1);
                }
                @keyframes fadeInUp {
                    0% { opacity: 0; transform: translateY(24px);}
                    100% { opacity: 1; transform: translateY(0);}
                }
            `}</style>
        </section>
    );
};

export default Forum;
