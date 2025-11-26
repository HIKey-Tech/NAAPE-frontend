"use client";

import { useState, useEffect } from "react";
import EventCard from "../component/event.card";
import { FilterHeader } from "../component/header";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/authcontext";
import { NaapButton } from "@/components/ui/custom/button.naap"; // Use NAAP styled button

function getArrayFromEvents(events: any): any[] {
    if (Array.isArray(events)) return events;
    if (events && Array.isArray(events.data)) return events.data;
    if (events && Array.isArray(events.events)) return events.events;
    return [];
}

// ---------- Hook: reactive admin check ----------
function useAdmin() {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const role = user?.role;
            setIsAdmin(role === "admin");
            // Optionally: console.log("tony role", role?.toString());
        }
        // Only run when user changes
    }, [user]);

    return isAdmin;
}

export default function EventsComponent() {
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);

    const { data: events, isPending: isLoading, isError } = useEvents();
    const eventsArr = getArrayFromEvents(events);
    const filteredEvents = eventsArr.filter((evt: any) =>
        evt?.title?.toLowerCase().includes(search.toLowerCase())
    );

    const isAdmin = useAdmin(); // will be null until checked

    const handleCreateEvent = () => {
        if (typeof window !== "undefined") {
            window.location.href = "/admin/events/new";
        }
    };

    // === Render ===
    // Don't show Create button until we know if admin
    if (isAdmin === null) return null; // optional: show loader instead

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

            {isAdmin && (
                <div className="flex justify-end px-6 mt-1 mb-4">
                    <NaapButton
                        variant="primary"
                        onClick={handleCreateEvent}
                        iconPosition="left"
                        icon={
                            <span className="text-lg font-bold leading-none">+</span>
                        }
                        type="button"
                    >
                        Create an event
                    </NaapButton>
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
                    <>
                        <div className="col-span-full text-center text-[#96A6BF] text-[16px] py-16 font-medium">
                            Nothing New
                            {isAdmin && (
                                <>
                                    <br />
                                    <span className="text-[#274fb7]">
                                        You can <strong>create a new event</strong> to get started!
                                    </span>
                                </>
                            )}
                        </div>
                        
                    </>
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
