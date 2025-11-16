"use client";
import React, { useState } from "react";
import PublicationCard from "../component/publication.card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { FaFilter } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

// Sample publications - in a real app, fetch from API
const ALL_PUBLICATIONS = Array.from({ length: 9 }).map((_, i) => ({
    imageUrl: "/images/plane.jpg",
    title: "Aero Certification " + (i + 1),
    author: "Engr. Jane Smith",
    date: "Mar 22, 2024",
    status: "published",
}));

type PublicationStatus = "pending" | "published" | "rejected";

export default function AllPublicationsPage() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    // For UI simplicity, don't apply real date or filter logic
    const filteredPublications = ALL_PUBLICATIONS.filter((pub) =>
        pub.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-8 py-8">
            {/* Header */}
            <h1 className="text-[19px] md:text-xl font-semibold text-[#233256] mb-2">
                Publications
            </h1>
            <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
                <div className="flex gap-2 flex-1 min-w-0">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search Publication..."
                        className="w-full max-w-xs text-[15px] rounded-md"
                    />
                </div>
                <div className="flex gap-2 items-center shrink-0">
                    <Button
                        variant="secondary"
                        className="rounded-md px-4 text-[14px] font-medium shadow-sm"
                    >
                        <span>Newest</span>
                        <ChevronDown className="ml-1 w-4 h-4" />
                    </Button>
                    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-md px-3 text-[14px] font-medium flex items-center gap-1 border-[#E3E9F0]"
                            >
                                <FaFilter size={14} className="mr-1" />
                                <span>Filter</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4" align="end">
                            <div className="flex flex-col gap-2">
                                <span className="text-[14px] font-medium text-[#233256] mb-1">
                                    Date Range
                                </span>
                                <Calendar
                                    mode="range"
                                    selected={{
                                        from: dateRange.from,
                                        to: dateRange.to,
                                    }}
                                    onSelect={(range: any) =>
                                        setDateRange({
                                            from: range?.from,
                                            to: range?.to,
                                        })
                                    }
                                    initialFocus
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                        setDateRange({ from: undefined, to: undefined });
                                        setFilterOpen(false);
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <div className="bg-[#F3F6FA] flex items-center gap-1 rounded-md px-2 py-1 border border-[#E3E9F0] text-[#475569] text-[13px] font-medium">
                        {dateRange.from && dateRange.to
                            ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(
                                dateRange.to,
                                "MMM d, yyyy"
                            )}`
                            : "No Date Selected"}
                    </div>
                </div>
            </div>
            {/* Publications Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
