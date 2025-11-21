"use client";
import { useState, useMemo } from "react";
import PublicationCard from "../component/publication.card";
import { FilterHeader } from "../component/header";
import { usePublications } from "@/hooks/usePublications";

// Improved status filter values including more user-friendly labels if needed
const PUBLICATION_STATUSES = [
    { label: "All", value: undefined },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Pending Review", value: "pending" },
    { label: "Rejected", value: "rejected" },
];

export default function AllPublicationsPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const [status, setStatus] = useState<string | undefined>(undefined);

    // Main data load
    const { data: publications, isLoading, isError } = usePublications(status);

    // --- Enhanced filtering logic ---

    // Helper: Test if a pub publication date is in the current date range
    function isInRange(pubDateStr: string, from?: Date, to?: Date) {
        if (!from && !to) return true;
        const pubDate = new Date(pubDateStr);
        if (from && pubDate < from) return false;
        if (to && pubDate > to) return false;
        return true;
    }

    // Memoized filter for performance
    const filteredPublications = useMemo(() => {
        let pubs = publications ?? [];

        // Filter by search text (in title or possibly author)
        if (search.trim()) {
            const searchLower = search.trim().toLowerCase();
            pubs = pubs.filter(pub => 
                (pub.title?.toLowerCase().includes(searchLower) ||
                pub.author?.name.toLowerCase()?.includes(searchLower) ||
                pub.content?.toLowerCase?.().includes(searchLower))
            );
        }

        // Filter by date range (assuming publicationDate; fallback to createdAt)
        if (dateRange.from || dateRange.to) {
            pubs = pubs.filter(pub => {
                // Try pub.publicationDate then fall back to pub.createdAt then none
                const dateStr = pub.updatedAt || pub.createdAt || "";
                if (!dateStr) return false;
                return isInRange(dateStr, dateRange.from, dateRange.to);
            });
        }

        return pubs;
    }, [publications, search, dateRange]);

    // ----

    return (
        <div className="px-4 sm:px-0 py-4 bg-white w-full">
            <FilterHeader
                title="Publications"
                search={search}
                setSearch={setSearch}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
                searchPlaceholder="Search by title, author, or summary..."
                sortLabel="Newest"
                // Improved: clear filter button & status
                extraFilters={
                    <div className="mb-2 flex flex-wrap gap-2 items-center">
                        {PUBLICATION_STATUSES.map((s) => (
                            <button
                                key={s.label}
                                className={`px-3 py-1 rounded-full border text-xs transition-colors duration-100 ${
                                    status === s.value || (!status && !s.value)
                                        ? "bg-[#4267E7] text-white border-[#4267E7]"
                                        : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-[#f0f4fa]"
                                }`}
                                onClick={() => setStatus(s.value)}
                                type="button"
                            >
                                {s.label}
                            </button>
                        ))}
                        {(search || dateRange.from || dateRange.to || status) && (
                            <button
                                type="button"
                                className="px-3 py-1 rounded-full border text-xs bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200 ml-1"
                                onClick={() => {
                                    setSearch("");
                                    setDateRange({ from: undefined, to: undefined });
                                    setStatus(undefined);
                                }}
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                }
            />
            <div className="grid gap-y-9 px-6 gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Loading...
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center text-red-500 text-[16px] py-16 font-medium">
                        Failed to load publications.
                    </div>
                ) : filteredPublications.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        No publications found.<br/>
                        <span className="text-xs text-gray-400">
                            Try adjusting your search, status, or date filters.
                        </span>
                    </div>
                ) : (
                    filteredPublications.map((pub) => (
                        <PublicationCard
                            key={pub._id}
                            publication={pub}
                            isAdmin={true}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
