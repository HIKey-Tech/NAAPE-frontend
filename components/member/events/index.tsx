"use client";

import { useState } from "react";
import EventCard from "../component/event.card";
import { FilterHeader } from "../component/header";
import { useEvents } from "@/hooks/useEvents";

// Restore admin check: button only shows if user is admin
function isAdmin() {
    if (typeof window !== "undefined") {
        return sessionStorage.getItem("role") === "admin";
    }
    return false;
}

function getArrayFromEvents(events: any): any[] {
    // Accept almost any backend response shape
    if (Array.isArray(events)) {
        return events;
    }
    // If API returns { data: [...] }
    if (events && Array.isArray(events.data)) {
        return events.data;
    }
    // If API returns an object with an 'events' array property
    if (events && Array.isArray(events.events)) {
        return events.events;
    }
    // Nothing found
    return [];
}

export default function EventsComponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: undefined,
        to: undefined,
    });
    const [filterOpen, setFilterOpen] = useState(false);

    const { data: events, isPending: isLoading, isError } = useEvents();

    // Robustly extract events array
    const eventsArr = getArrayFromEvents(events);

    // Filter fetched events by search, only if eventsArr is array
    const filteredEvents = eventsArr.filter((evt: any) =>
        evt?.title?.toLowerCase().includes(search.toLowerCase())
    );

    // Handler for "Create Event"
    const handleCreateEvent = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/admin/event/new";
        }
    };

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
            {/* Show Create Event button only if user is admin */}
            {isAdmin() && (
                <div className="flex justify-end px-6 mt-1 mb-4">
                    <button
                        onClick={handleCreateEvent}
                        className="bg-[#4267E7] px-5 py-2 rounded-lg text-white font-medium hover:bg-[#274fb7] focus:outline-none focus:ring-2 focus:ring-[#B2D7EF] transition"
                    >
                        + Create an event
                    </button>
                </div>
            )}
            <div className="grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Loading...
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center text-[#D14343] text-[16px] py-16 font-medium">
                        Failed to load events.
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                        Nothing New
                    </div>
                ) : (
                    filteredEvents.map((event: any, idx: number) => (
                        <EventCard
                            key={event.id ?? idx}
                            title={event.title}
                            date={event.date}
                            location={event.location || "Life Camp, Abuja"}
                            imageUrl={event.imageUrl || "/images/plane.jpg"}
                            disabled={false}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
