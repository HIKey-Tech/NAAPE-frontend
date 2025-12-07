"use client";
import { useState, useMemo, useCallback } from "react";
import PublicationCard from "../component/publication.card";
import { FilterHeader } from "../component/header";
import { useMyPublications } from "@/hooks/usePublications";
import { IPublication } from "@/app/api/publication/types";
import { FaBookOpen, FaLayerGroup, FaEdit, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";

// No change to statuses
const PUBLICATION_STATUSES: { label: string; value?: string; icon?: React.ReactNode; highlight?: string }[] = [
    { label: "All", value: undefined, icon: <FaLayerGroup className="inline mr-1" />, highlight: "bg-gradient-to-r from-[#FAFBFF] to-[#F2F7FB]" },
    { label: "Published", value: "published", icon: <FaBookOpen className="inline mr-1 text-[#2c6ed4]" />, highlight: "bg-[#eaf4ff]" },
    { label: "Draft", value: "draft", icon: <FaEdit className="inline mr-1 text-[#9E63C3]" />, highlight: "bg-[#f3e9fb]" },
    { label: "Pending Review", value: "pending", icon: <FaHourglassHalf className="inline mr-1 text-[#E8B900]" />, highlight: "bg-[#fff9e5]" },
    { label: "Rejected", value: "rejected", icon: <FaTimesCircle className="inline mr-1 text-[#D33A2C]" />, highlight: "bg-[#fdeaea]" },
];

interface PubProps {
    isAdmin: boolean;
}

export default function AllPublicationsPage({ isAdmin }: PubProps) {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [status, setStatus] = useState<string | undefined>();

    const { data: publications = [], isLoading, isError } = useMyPublications(status);

    // Utility to normalize search target (handles missing values, case folding, etc)
    const normalize = (v: unknown) =>
        typeof v === "string"
            ? v.toLowerCase()
            : typeof v === "object" && v && "name" in v && typeof (v as any).name === "string"
            ? ((v as any).name as string).toLowerCase()
            : "";

    // Robustly compare string match, handling undefined/empty
    const matches = (value: unknown, term: string) =>
        normalize(value).includes(term);

    const isInRange = useCallback(
        (dateStr: string | undefined, from?: Date, to?: Date) => {
            if (!dateStr) return false;
            const pubDate = new Date(dateStr);
            if (Number.isNaN(pubDate.getTime())) return false;
            if (from && pubDate < from) return false;
            if (to && pubDate > to) return false;
            return true;
        },
        []
    );

    // Filtering is now stricter/clearer for edge cases, search is wider, lint types are enforced
    const filteredPublications: IPublication[] = useMemo(() => {
        let pubs = publications as IPublication[];

        // Filter by search (title, author, content)
        if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            pubs = pubs.filter(
                (pub) =>
                    matches(pub.title, searchTerm) ||
                    matches(pub.author.name, searchTerm) ||
                    matches(pub.content, searchTerm)
            );
        }

        // Filter by date range using updatedAt (prefer), then createdAt
        if (dateRange.from || dateRange.to) {
            pubs = pubs.filter((pub) => {
                const dateStr = pub.updatedAt || pub.createdAt;
                return isInRange(dateStr, dateRange.from, dateRange.to);
            });
        }

        return pubs;
    }, [publications, search, dateRange, isInRange]);

    // Add micro-animations, remove shadow classes/styles from buttons
    const renderStatusFilters = () => (
        <div className="mb-4 flex flex-wrap gap-x-2 gap-y-3 items-center w-full">
            {PUBLICATION_STATUSES.map((s) => (
                <button
                    key={s.label}
                    className={[
                        "flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border",
                        "transition-all duration-200 font-semibold text-base sm:text-[15px]",
                        "focus:outline-none",
                        // micro-animations: use focus-visible:ring & transform and color transitions
                        "transition-transform transition-colors",
                        status === s.value || (!status && !s.value)
                            ? s.highlight +
                              " border-[#2C6ED4] text-[#194287] ring-2 ring-[#2c6ed4]/30 scale-105"
                            : "bg-white border-gray-200 text-[#5B6D95] hover:bg-[#f6f9fc] hover:scale-105",
                        "hover:ring-1 hover:ring-[#2c6ed4]/15",
                        // Micro-animations: wiggle + bounce on tap/active, subtle fade on hover
                        "active:scale-98 transition-transform"
                    ].join(" ")}
                    style={{
                        // Remove boxShadow!
                        minWidth: 120,
                        justifyContent: "center",
                        // Add subtle transform on tap for micro animation (handled above with active:scale-98)
                    }}
                    onClick={() => setStatus(s.value)}
                    type="button"
                    tabIndex={0}
                    // Add touch micro-animation with JS in case of mobile tap (not required but progressive enhancement)
                    onPointerDown={e => {
                        e.currentTarget.classList.add("ring-4", "ring-blue-200");
                        setTimeout(() => {
                            e.currentTarget.classList.remove("ring-4", "ring-blue-200");
                        }, 150);
                    }}
                >
                    <span className="text-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110">{s.icon}</span>
                    <span className="leading-none transition-colors duration-200">{s.label}</span>
                </button>
            ))}
            {(search || dateRange.from || dateRange.to || status) && (
                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm bg-gradient-to-r from-gray-50 to-[#f5f7fa] text-gray-500 hover:bg-gray-100 border-gray-200 ml-1 transition-all duration-200 active:scale-98"
                    // Remove shadow
                    style={{ marginTop: 1.5 }}
                    onClick={() => {
                        setSearch("");
                        setDateRange({});
                        setStatus(undefined);
                    }}
                >
                    <FaTimesCircle className="inline text-red-400 opacity-70 transition-transform duration-200 group-hover:rotate-12" />
                    Clear filters
                </button>
            )}
        </div>
    );

    // Micro animations (pulse, fade, transform); remove shadow classes
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="col-span-full flex justify-center items-center py-20 sm:py-28">
                    <div className="inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-[#f7faff] to-[#e7f4ff] rounded-xl border border-blue-100 animate-pulse transition-all duration-200">
                        <FaHourglassHalf className="text-2xl text-blue-300 animate-spin-slow" />
                        <span className="text-[#86a3ce] text-lg font-semibold tracking-wide text-center animate-fade-in">Loading publications...</span>
                    </div>
                </div>
            );
        }
        if (isError) {
            return (
                <div className="col-span-full flex justify-center items-center py-20">
                    <div className="inline-flex flex-col items-center px-8 py-6 bg-[#fff6f6] border border-red-200 rounded-xl transition-all duration-200">
                        <FaTimesCircle className="text-3xl text-[#D33A2C] animate-jump" />
                        <span className="text-red-600 text-lg font-bold mt-2 text-center animate-fade-in">Failed to load publications.</span>
                        <span className="text-sm text-red-400 mt-1 text-center animate-fade-in">Please try again or refresh the page.</span>
                    </div>
                </div>
            );
        }
        if (!filteredPublications.length) {
            return (
                <div className="col-span-full flex justify-center items-center py-20">
                    <div className="inline-flex flex-col items-center px-8 py-8 bg-gradient-to-br from-[#f1f5fe] to-[#fcfcfd] border border-[#e1e9f7] rounded-xl gap-2 transition-all duration-200">
                        <FaBookOpen className="text-4xl text-[#bdd3f2] animate-bounce-slow" />
                        <span className="font-bold text-lg text-[#8ca4cd] text-center animate-fade-in">No publications found.</span>
                        <span className="text-xs text-gray-400 max-w-[260px] leading-relaxed mt-1 text-center animate-fade-in">
                            Try adjusting your <span className="font-semibold text-[#6280b1]">search</span>, <span className="font-semibold text-[#6280b1]">status</span>, or <span className="font-semibold text-[#6280b1]">date filters</span>.
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="grid gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
                {filteredPublications.map((pub, i) => (
                    <div
                        key={pub._id}
                        className="relative flex flex-col group transition-transform duration-200 ease-out hover:scale-105 hover:z-10"
                        style={{
                            transitionProperty: "box-shadow,transform",
                            transitionDuration: "200ms",
                            // Encourage cards to stretch equal height by using flex
                            height: "100%",
                        }}
                    >
                        <div
                            className="absolute inset-0 z-[-1] bg-gradient-to-br from-[#eaf1fb] to-white rounded-3xl opacity-80 group-hover:opacity-100 scale-[1.02] blur-[2.5px] pointer-events-none transition-all duration-200"
                            aria-hidden="true"
                            // Removed shadow-2xl
                        />
                        <div className="h-full flex items-stretch">
                            <PublicationCard
                                publication={pub}
                                isAdmin={isAdmin}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full min-h-[75vh] bg-gradient-to-b from-[#f7faff] to-[#fcfcff] pt-0 pb-28 sm:pb-12 relative flex flex-col">
            <div className="max-w-7xl mx-auto px-2 sm:px-7 w-full">
                {/* Hero / Showcase header */}
                <div className="pt-2 pb-3 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-y-2">
                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h1 className="text-[2.25rem] sm:text-4xl font-bold tracking-tight text-[#234174] leading-tight mb-2 drop-shadow-sm">
                            Publications
                        </h1>
                        <p className="text-[#6e7991] text-base sm:text-lg font-medium mb-1">
                            Discover and manage your scholarly work.
                        </p>
                    </div>
                    <div className="flex-shrink-0 mt-2 sm:mt-0 sm:ml-4 flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#e9f1ff] text-[#3074e5] border border-[#cfe2fc] transition-all duration-200">
                            {filteredPublications?.length ?? 0} shown
                        </span>
                    </div>
                </div>
                <div className="mb-4 sm:mb-6">
                    <FilterHeader
                        title={undefined}
                        search={search}
                        setSearch={setSearch}
                        filterOpen={filterOpen}
                        setFilterOpen={setFilterOpen}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        searchPlaceholder="Search by title, author, or summary..."
                        sortLabel="Newest"
                        extraFilters={renderStatusFilters()}
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

// Extra micro-animation utility classes: 
// Add these to your global styles or Tailwind config if needed:
// .animate-fade-in { animation: fadeIn 0.5s both; }
// .animate-spin-slow { animation: spin 1.6s linear infinite; }
// .animate-bounce-slow { animation: bounce 1.4s infinite both; }
// .animate-jump { animation: jump 0.55s cubic-bezier(.36,1.38,.54,1.02) both; }
// @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
// @keyframes jump { 0%{transform:translateY(0);} 40%{transform:translateY(-12px);} 100%{transform:translateY(0);} }
// .active\:scale-98:active { transform: scale(0.98); }

