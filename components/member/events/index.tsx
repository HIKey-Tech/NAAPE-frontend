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
    // For navigation purpose
    const isMember = user?.role === "member";

    const handleCreateEvent = useCallback(() => {
        if (typeof window !== "undefined") {
            window.location.href = "/admin/events/new";
        }
    }, []);

    // Handle event card click - open modal
    const handleEventClick = async (event: any) => {
        // For admins, navigate to manage page instead of modal
        if (isAdmin) {
            const evId = event.id ?? event._id;
            router.push(`/admin/events/${evId}`);
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
                        icon={<span className="text-lg font-bold leading-none">+</span>}
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
                                isAdmin
                                    ? "Manage"
                                    : isMember
                                    ? "View & Register"
                                    : "View & Register"
                            }
                            className="cursor-pointer"
                            disabled={false}
                            registeredUsers={event.registeredUsers}
                            createdBy={event.createdBy}
                            payments={event.payments}
                            onCardClick={() => handleEventClick(event)}
                        />
                    ))
                )}
            </div>

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
