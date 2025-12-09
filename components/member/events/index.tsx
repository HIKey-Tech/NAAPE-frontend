"use client";

import { useState, useEffect, useCallback } from "react";
import EventCard from "../component/event.card";
import { FilterHeader } from "../component/header";
import { useEvents } from "@/hooks/useEvents";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/proxy";
import { EventCardProps } from "@/app/api/events/type";

function getArrayFromEvents(events: any): any[] {
    if (Array.isArray(events)) return events;
    if (events && Array.isArray(events.data)) return events.data;
    if (events && Array.isArray(events.events)) return events.events;
    return [];
}

export default function EventsComponent() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const getUserFromToken = () => {
            const token = localStorage.getItem("token");
            if (!token) return null;
            try {
                const userObj = parseJwt(token);
                return userObj;
            } catch (e) {
                console.error("Invalid token", e);
                return null;
            }
        };

        const userObj = getUserFromToken();
        setUser(userObj);
        setRole(userObj?.role ?? null);
    }, []);

    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const router = useRouter();

    const { data: events, isPending: isLoading, isError } = useEvents();
    const eventsArr = getArrayFromEvents(events);

    const filteredEvents = eventsArr.filter((evt: any) =>
        evt?.title?.toLowerCase().includes(search.toLowerCase())
    );

    // Only admins should see the create button
    const isAdmin = user?.role === "admin";
    // Only needed for event navigation, not for showing create button
    const isMember = user?.role === "member";

    const handleCreateEvent = useCallback(() => {
        if (typeof window !== "undefined") {
            window.location.href = "/admin/events/new";
        }
    }, []);

    // Patch: ensure isPaid is strictly boolean for EventCardProps usage
    function eventCardProps(event: any): EventCardProps {
        let isPaid: boolean;
        if (typeof event.isPaid === "boolean") {
            isPaid = event.isPaid;
        } else if (typeof event.isPaid === "number") {
            // interpret 1 or >0 as true, 0 or falsy as false
            isPaid = !!event.isPaid;
        } else if (typeof event.price === "number") {
            isPaid = event.price > 0;
        } else {
            isPaid = false;
        }
        return {
            id: event.id,
            title: event.title ?? "Untitled",
            date: event.date ?? new Date().toISOString(),
            location: event.location ?? "Life Camp, Abuja",
            imageUrl: event.imageUrl ?? "/images/plane.jpg",
            description: event.description ?? "",
            price:
                typeof event.price !== "undefined"
                    ? event.price
                    : isPaid
                    ? (event.price ?? 1000)
                    : 0,
            currency: event.currency ?? "NGN",
            isPaid: isPaid,
            registerLabel: "View Details",
            className: "cursor-pointer",
            disabled: false,
            registeredUsers: event.registeredUsers,
            createdBy: event.createdBy,
            payments: event.payments,
        };
    }

    // Render
    if (user?.role === null) return null;

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

            {/* Only admin can see the create event button */}
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
                            {...eventCardProps(event)}
                            registerLabel={isAdmin ? "Manage" : "View & Register"}
                            {...((isAdmin || isMember)
                                ? {
                                    onClick: () => {
                                        if (!event.id) return;
                                        if (isAdmin) router.push(`/admin/events/${event.id}`);
                                        else if (isMember) router.push(`/events/${event.id}`);
                                        else router.push(`/events/${event.id}`);
                                    },
                                }
                                : {})}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
