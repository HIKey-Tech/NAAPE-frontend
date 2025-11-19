"use client";
import React, { useState } from "react";
import { FilterHeader } from "../component/header";
import { NewsCard } from "@/components/ui/custom/news.card";

// Sample news items - in a real app, fetch from API
const NEWS = Array.from({ length: 9 }).map((_, i) => ({
    imageUrl: "/images/plane.jpg",
    title: "Aero Certification " + (i + 1),
    author: "Engr. Jane Smith",
    date: "Mar 22, 2024",
    status: "published",
}));

export default function NewsCpmponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    // For UI simplicity, don't apply real date or filter logic
    const filteredPublications = NEWS.filter((pub) =>
        pub.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-0 sm:px-0 py-4 bg-white w-full">
            <FilterHeader
                title="News"
                search={search}
                setSearch={setSearch}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
                searchPlaceholder="Search News..."
                sortLabel="Newest"
            />
            <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPublications.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Nothing New
                    </div>
                ) : (
                    filteredPublications.map((news, idx) => (
                        <NewsCard
                            key={idx}
                            imageUrl={news.imageUrl}
                            title={news.title}
                            summary={
                                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nec."
                            }
                            authorName={news.author}
                            authorRole={"Engineer"}
                            authorAvatarUrl={""}
                            linkUrl={"#"}
                            category={"Naape News"}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
