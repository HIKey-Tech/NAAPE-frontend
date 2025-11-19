"use client";
import React, { useState } from "react";
import EventCard from "../component/event.card";
import { FilterHeader } from "../component/header";

// Sample events - in a real app, fetch from API
const EVENTS = Array.from({ length: 9 }).map((_, i) => ({
    imageUrl: "/images/plane.jpg",
    title: "Naape New Conference event " + (i + 1),
    author: "Engr. Jane Smith",
    date: "Mar 22, 2024",
    status: "published",
}));

export default function EventsComponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    // For UI simplicity, don't apply real date or filter logic (yet)
    const filteredEvents = EVENTS.filter((evt) =>
        evt.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="px-4 sm:px-0 py-4 bg-white w-full">
            <FilterHeader
                title="Events"
                search={search}
                setSearch={setSearch}
                filterOpen={filterOpen}
                setFilterOpen={setFilterOpen}
                dateRange={dateRange}
                setDateRange={setDateRange}
                searchPlaceholder="Search for events..."
                sortLabel="Newest"
            />
            <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Nothing New
                    </div>
                ) : (
                    filteredEvents.map((event, idx) => (
                        <EventCard
                            key={idx}
                            title={event.title}
                            date={event.date}
                            location="Life Camp, Abuja"
                            imageUrl={event.imageUrl}
                            disabled={false}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
