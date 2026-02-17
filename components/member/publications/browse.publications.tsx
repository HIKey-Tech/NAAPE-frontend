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
                    <div className="inline-flex flex-col items-center px-8 py-6 bg-red-50 border border-red-100 rounded-2xl transition-all duration-200">
                        <FaTimesCircle className="text-3xl text-red-500" />
                        <span className="text-red-600 text-lg font-bold mt-2 text-center">Failed to load publications.</span>
                        <span className="text-sm text-red-400 mt-1 text-center">Please try again or refresh the page.</span>
                    </div>
                </div>
            );
        }
        if (!filteredPublications.length) {
            return (
                <div className="col-span-full flex justify-center items-center py-20">
                    <div className="inline-flex flex-col items-center px-8 py-8 bg-slate-50 border border-slate-100 rounded-2xl gap-2 transition-all duration-200">
                        <FaBookOpen className="text-4xl text-slate-300" />
                        <span className="font-bold text-lg text-slate-400 text-center">No publications found.</span>
                        <span className="text-xs text-slate-400 max-w-[260px] leading-relaxed mt-1 text-center">
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
                            className="absolute inset-0 z-[-1] bg-gradient-to-br from-slate-50 to-white rounded-2xl opacity-80 group-hover:opacity-100 scale-[1.02] blur-[2.5px] pointer-events-none transition-all duration-200"
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
        <div className="w-full min-h-[75vh] bg-gradient-to-b from-slate-50/50 to-white pt-0 pb-28 sm:pb-12 relative flex flex-col">
            <div className="max-w-7xl mx-auto px-2 sm:px-7 w-full">
                {/* Premium Badge */}
                <div className="mt-4 mb-2 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full">
                        <FaStar className="text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">Premium Content</span>
                    </div>
                </div>

                {/* Hero / Showcase header */}
                <div className="pt-2 pb-3 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-y-2">
                    <div className="w-full sm:w-auto flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h1 className="text-[2.25rem] sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight mb-2">
                            Browse Publications
                        </h1>
                        <p className="text-slate-500 text-base sm:text-lg font-medium mb-1">
                            Explore scholarly work from NAAPE members.
                        </p>
                    </div>
                    <div className="shrink-0 mt-2 sm:mt-0 sm:ml-4 flex items-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/5 text-primary border border-primary/10 transition-all duration-200">
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
                        searchPlaceholder="Search by title, author, or content..."
                        sortLabel="Newest"
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
}
