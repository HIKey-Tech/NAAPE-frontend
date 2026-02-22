"use client";

import { useState, useEffect, useCallback } from "react";
import EventCard from "../component/event.card";
import { EventDetailsModal } from "@/components/ui/custom/event.details.modal";
import { FilterHeader } from "../component/header";
import { useEvents } from "@/hooks/useEvents";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/proxy";
import { payForEvent, verifyPayment, getStatus } from "@/app/api/events/events";
import type { EventCardProps } from "@/app/api/events/type";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Utility to normalize events array structure
function getArrayFromEvents(events: any): any[] {
    if (Array.isArray(events)) return events;
    if (events && Array.isArray(events.data)) return events.data;
    if (events && Array.isArray(events.events)) return events.events;
    return [];
}

export default function EventsComponent() {
    const [user, setUser] = useState<any>(null);
    const [role, setRole] = useState<string | null>(null);

    // Modal state
    const [selectedEvent, setSelectedEvent] = useState<EventCardProps | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<any>(null);
    const [showVerify, setShowVerify] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("token");
        let userObj = null;
        if (token) {
            try {
                userObj = parseJwt(token);
            } catch (e) {
                userObj = null;
            }
        }
        setUser(userObj);
        setRole(userObj?.role ?? null);
    }, []);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
    const [filterOpen, setFilterOpen] = useState(false);
    const router = useRouter();

    const { data: events, isPending: isLoading, isError } = useEvents({ page, limit: 12, search: search || undefined });
    const eventsArr = getArrayFromEvents(events);
    const totalPages = events?.pagination?.pages || 1;

    // The backend now filters, so we just pass the array
    const filteredEvents = eventsArr;

    // Only admins should see the create button
    const isAdmin = user?.role === "admin";
    // For navigation purpose
    const isMember = user?.role === "member";

    // Handle event card click - open modal
    const handleEventClick = async (event: any) => {
        // For admins, navigate to management interface instead of modal
        if (isAdmin) {
            router.push("/admin/events/management");
            return;
        }

        // For members, show modal
        setSelectedEvent(event);
        setIsModalOpen(true);
        setShowVerify(false);

        // Fetch payment status
        try {
            const status = await getStatus(event.id || event._id || "");
            setPaymentStatus(status);
        } catch (err) {
            setPaymentStatus(null);
        }
    };

    // Handle registration from modal
    const handleRegister = async (eventId: string) => {
        setIsRegistering(true);
        try {
            const result = await payForEvent(eventId);
            if (result?.link) {
                setShowVerify(true);
                window.open(result.link, "_blank");
            } else {
                const status = await getStatus(eventId);
                setPaymentStatus(status);
            }
        } catch (error) {
            console.error("Registration error:", error);
        } finally {
            setIsRegistering(false);
        }
    };
    //check
    // Handle payment verification
    const handleVerifyPayment = async (txId: string) => {
        try {
            await verifyPayment(txId);
            if (selectedEvent) {
                const status = await getStatus(selectedEvent.id || selectedEvent._id || "");
                setPaymentStatus(status);
                setShowVerify(false);
            }
        } catch (error) {
            console.error("Verification error:", error);
        }
    };

    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setPaymentStatus(null);
        setShowVerify(false);
    };

    // Render early exit if user role isn't known
    if (user?.role === null) return null;

    return (
        <div className="px-4 sm:px-8 max-w-7xl mx-auto py-4 bg-white dark:bg-transparent w-full min-h-screen">
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full text-center text-slate-400 text-base py-16 font-medium">
                        Loading...
                    </div>
                ) : isError ? (
                    <div className="col-span-full text-center text-red-500 text-base py-16 font-medium">
                        Failed to load events.
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="col-span-full text-center text-slate-400 text-base py-16 font-medium">
                        Nothing New
                        {isAdmin && (
                            <>
                                <br />
                                <span className="text-primary">
                                    You can <strong>create a new event</strong> to get started!
                                </span>
                            </>
                        )}
                    </div>
                ) : (
                    filteredEvents.map((event: any, idx: number) => (
                        <EventCard
                            key={event.id ?? idx}
                            id={event.id ?? event._id ?? idx}
                            _id={event._id}
                            title={event.title ?? "Untitled"}
                            date={event.date ?? new Date().toISOString()}
                            location={event.location ?? "Life Camp, Abuja"}
                            imageUrl={event.imageUrl ?? "/images/plane.jpg"}
                            description={event.description ?? ""}
                            price={
                                typeof event.price !== "undefined"
                                    ? event.price
                                    : event.isPaid
                                        ? event.price ?? 1000
                                        : 0
                            }
                            currency={event.currency ?? "NGN"}
                            isPaid={
                                typeof event.isPaid === "boolean"
                                    ? event.isPaid
                                    : typeof event.isPaid === "number"
                                        ? !!event.isPaid
                                        : typeof event.price === "number"
                                            ? event.price > 0
                                            : false
                            }
                            registerLabel={
                                isMember
                                    ? "View & Register"
                                    : "View & Register"
                            }
                            className="cursor-pointer"
                            disabled={false}
                            registeredUsers={event.registeredUsers}
                            createdBy={event.createdBy}
                            payments={event.payments}
                            isAdmin={isAdmin}
                            onCardClick={() => handleEventClick(event)}
                        />
                    ))
                )}
            </div>

            {!isLoading && totalPages > 1 && (
                <div className="mt-8 mb-6 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page > 1) setPage(page - 1);
                                    }}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        isActive={page === i + 1}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(i + 1);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (page < totalPages) setPage(page + 1);
                                    }}
                                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onRegister={handleRegister}
                isRegistering={isRegistering}
                paymentStatus={paymentStatus}
                showVerify={showVerify}
                onVerifyPayment={handleVerifyPayment}
            />
        </div>
    );
}
