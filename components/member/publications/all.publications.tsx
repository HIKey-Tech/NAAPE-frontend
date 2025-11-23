"use client";
import { useState, useMemo, useCallback } from "react";
import PublicationCard from "../component/publication.card";
import { FilterHeader } from "../component/header";
import { useMyPublications } from "@/hooks/usePublications";
import { IPublication } from "@/app/api/publication/types";



const PUBLICATION_STATUSES: { label: string; value?: string }[] = [
    { label: "All", value: undefined },
    { label: "Published", value: "published" },
    { label: "Draft", value: "draft" },
    { label: "Pending Review", value: "pending" },
    { label: "Rejected", value: "rejected" },
];

interface PubProps {
    isAdmin: boolean;
}

export default function AllPublicationsPage({ isAdmin }: PubProps) {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const [status, setStatus] = useState<string | undefined>();

    // Fetch publications (admin may want all, but this is for user's own publications)
    const { data: publications = [], isLoading, isError } = useMyPublications(status);

    // Utility to normalize search target (handles missing values, case folding, etc)
    const normalize = (v: unknown) =>
        typeof v === "string" ? v.toLowerCase() : typeof v === "object" && v && "name" in v && typeof (v as any).name === "string"
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
        }, []
    );

    // Filtering is now stricter/clearer for edge cases, search is wider, lint types are enforced
    const filteredPublications: IPublication[] = useMemo(() => {
        let pubs = publications as IPublication[];

        // Filter by search (title, author, content)
        if (search.trim()) {
            const searchTerm = search.trim().toLowerCase();
            pubs = pubs.filter(pub =>
                matches(pub.title, searchTerm) ||
                matches(pub.author.name, searchTerm) ||
                matches(pub.content, searchTerm)
            );
        }

        // Filter by date range using updatedAt (prefer), then createdAt
        if (dateRange.from || dateRange.to) {
            pubs = pubs.filter(pub => {
                const dateStr = pub.updatedAt || pub.createdAt;
                return isInRange(dateStr, dateRange.from, dateRange.to);
            });
        }

        return pubs;
    }, [publications, search, dateRange, isInRange]);

    // Extra filter rendering is now abstracted and more readable
    const renderStatusFilters = () => (
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
                        setDateRange({});
                        setStatus(undefined);
                    }}
                >
                    Clear filters
                </button>
            )}
        </div>
    );

    // Enhanced messages for status
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                    Loading...
                </div>
            );
        }
        if (isError) {
            return (
                <div className="col-span-full text-center text-red-500 text-[16px] py-16 font-medium">
                    Failed to load publications.
                </div>
            );
        }
        if (!filteredPublications.length) {
            return (
                <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                    No publications found.<br />
                    <span className="text-xs text-gray-400">
                        Try adjusting your search, status, or date filters.
                    </span>
                </div>
            );
        }
        return filteredPublications.map((pub) => (
            <PublicationCard
                key={pub._id}
                publication={pub}
                isAdmin={isAdmin}
            />
        ));
    };

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
                extraFilters={renderStatusFilters()}
            />
            <div className="grid gap-y-9 px-6 gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
                {renderContent()}
            </div>
        </div>
    );
}
