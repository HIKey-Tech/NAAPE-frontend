"use client";
import React, { useState } from "react";
import PublicationCard from "../component/publication.card";
import { FilterHeader } from "../component/header";

const ALL_PUBLICATIONS = Array.from({ length: 99 }).map((_, i) => ({
    imageUrl: "/images/plane.jpg",
    title: `Aero Certification ${i + 1}`,
    author: "Engr. Jane Smith",
    date: "Mar 22, 2024",
    status: "published",
}));

type PublicationStatus = "pending" | "published" | "rejected";

export default function AllPublicationsPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    const filteredPublications = ALL_PUBLICATIONS.filter(pub =>
        pub.title.toLowerCase().includes(search.toLowerCase())
    );

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
                searchPlaceholder="Search Publication..."
                sortLabel="Newest"
            />
            <div className="grid gap-y-9 px-6 gap-x-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPublications.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        No publications found.
                    </div>
                ) : (
                    filteredPublications.map((pub, idx) => (
                        <PublicationCard
                            key={idx}
                            imageUrl={pub.imageUrl}
                            title={pub.title}
                            author={pub.author}
                            date={pub.date}
                            status={pub.status as PublicationStatus}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
