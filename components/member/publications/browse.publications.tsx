"use client";
import { useState, useMemo, useCallback } from "react";
import { PublicationCard } from "../component/publication.card";
import { FilterHeader } from "../component/header";
import { useAllPublications } from "@/hooks/usePublications";
import { IPublication } from "@/app/api/publication/types";
import { FaBookOpen, FaLayerGroup, FaHourglassHalf, FaTimesCircle, FaStar } from "react-icons/fa";
import { useAuth } from "@/context/authcontext";

export default function BrowsePublicationsPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const { user } = useAuth();

    const { data: publications = [], isLoading, isError } = useAllPublications("approved");

    const normalize = (v: unknown) =>
        typeof v === "string"
            ? v.toLowerCase()
            : typeof v === "object" && v && "name" in v && typeof (v as any).name === "string"
                ? ((v as any).name as string).toLowerCase()
                : "";

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

    const filteredPublications: IPublication[] = useMemo(() => {
        let pubs = publications as IPublication[];

        if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            pubs = pubs.filter(
                (pub) =>
                    matches(pub.title, searchTerm) ||
                    matches(pub.author.name, searchTerm) ||
                    matches(pub.content, searchTerm)
            );
        }

        if (dateRange.from || dateRange.to) {
            pubs = pubs.filter((pub) => {
                const dateStr = pub.updatedAt || pub.createdAt;
                return isInRange(dateStr, dateRange.from, dateRange.to);
            });
        }

        return pubs;
    }, [publications, search, dateRange, isInRange]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="col-span-full flex justify-center items-center py-20 sm:py-28">
                    <div className="inline-flex items-center gap-3 px-7 py-4 bg-primary/5 rounded-2xl border border-primary/10 animate-pulse transition-all duration-200">
                        <FaHourglassHalf className="text-2xl text-primary/40 animate-spin" />
                        <span className="text-primary/60 text-lg font-bold tracking-wide text-center">Loading publications...</span>
                    </div>
                </div>
            );
        }
        if (isError) {
            return (
                <div className="col-span-full flex justify-center items-center py-20">
                    <div className="inline-flex flex-col items-center px-8 py-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl transition-all duration-200">
                        <FaTimesCircle className="text-3xl text-red-500" />
                        <span className="text-red-600 dark:text-red-400 text-lg font-bold mt-2 text-center">Failed to load publications.</span>
                        <span className="text-sm text-red-400 mt-1 text-center">Please try again or refresh the page.</span>
                    </div>
                </div>
            );
        }
        if (!filteredPublications.length) {
            return (
                <div className="col-span-full flex justify-center items-center py-20">
                    <div className="inline-flex flex-col items-center px-8 py-8 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl gap-2 transition-all duration-200">
                        <FaBookOpen className="text-4xl text-slate-300 dark:text-slate-600" />
                        <span className="font-bold text-lg text-slate-400 dark:text-slate-500 text-center">No publications found.</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 max-w-[260px] leading-relaxed mt-1 text-center">
                            Try adjusting your search or date filters.
                        </span>
                    </div>
                </div>
            );
        }
        return (
            <div className="grid gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-3 pt-4">
                {filteredPublications.map((pub) => (
                    <div
                        key={pub._id}
                        className="relative flex flex-col group transition-transform duration-200 ease-out hover:scale-[1.03] hover:z-10"
                        style={{
                            transitionProperty: "box-shadow,transform",
                            transitionDuration: "200ms",
                            height: "100%",
                        }}
                    >
                        <div
                            className="absolute inset-0 z-[-1] bg-gradient-to-br from-slate-50 dark:from-[#0a0d14]/50 to-white dark:to-transparent rounded-2xl opacity-80 group-hover:opacity-100 scale-[1.02] blur-[2.5px] pointer-events-none transition-all duration-200"
                            aria-hidden="true"
                        />
                        <div className="h-full flex items-stretch">
                            <PublicationCard
                                publication={pub}
                                isAdmin={false}
                                baseRoute="/publications/browse"
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-slate-50/50 dark:bg-transparent w-full min-h-screen">
            <div className="w-full pt-10 pb-8 bg-white dark:bg-[#0f121b] border-b border-slate-100 dark:border-slate-800 px-6 sm:px-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-y-4">
                <div className="w-full sm:w-auto flex flex-col items-start text-left">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                        Browse <span className="text-primary dark:text-blue-400">Publications</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
                        Explore scholarly work from NAAPE members.
                    </p>
                </div>
                <div className="shrink-0 flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary border border-primary/10 transition-all duration-200">
                        {filteredPublications?.length ?? 0} shown
                    </span>
                </div>
            </div>

            <div className="px-6 sm:px-10 py-6 max-w-[1400px] mx-auto w-full">
                <div className="mb-6 relative z-30">
                    <FilterHeader
                        title={undefined}
                        search={search}
                        setSearch={setSearch}
                        filterOpen={filterOpen}
                        setFilterOpen={setFilterOpen}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        searchPlaceholder="Search by title, author, or content..."
                        sortLabel="Newest"
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
}
