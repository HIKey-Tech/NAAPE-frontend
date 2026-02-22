"use client";

import { useState, useEffect } from "react";
import EventCard from "@/components/ui/custom/events.card";
import { useEvents } from "@/hooks/useEvents";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { EventDetailsModal } from "@/components/ui/custom/event.details.modal";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 9;

    const { data: qData, isLoading, isError } = useEvents({ page, limit, search: searchTerm || undefined });

    // Fallback parsing just in case
    let eventsList = [];
    let totalPages = 1;
    if (qData) {
        eventsList = qData.events || (Array.isArray(qData) ? qData : []);
        if (qData.pagination) {
            totalPages = qData.pagination.pages;
        }
    }

    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Debounce search effect on page
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    const handleEventClick = (event: any) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 w-full flex flex-col items-center">
            {/* Simple Hero Section */}
            <div className="w-full pt-32 pb-16 bg-white border-b border-slate-100 text-center px-4">
                <span className="text-sm font-bold text-accent tracking-widest uppercase mb-2 block">
                    Events & Conferences
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                    Upcoming <span className="text-primary">Events</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Connect with peers, learn from experts, and shape the future of aviation.
                </p>
                <div className="mt-8 flex justify-center max-w-md mx-auto relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        className="pl-10 h-12 rounded-full border-slate-200 bg-slate-50 focus-visible:ring-primary shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <section className="w-full max-w-6xl mx-auto px-4 py-16">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="py-20 text-center text-red-500 bg-white rounded-3xl border border-red-50 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">Failed to load events.</p>
                    </div>
                ) : eventsList.length === 0 ? (
                    <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto">
                        <p className="text-lg font-medium">No events found.</p>
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="mt-4 text-primary hover:underline font-bold">
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {eventsList.map((event: any, idx: number) => {
                            // Ensure properties expected by EventCard are present
                            const normEvent = {
                                ...event,
                                id: event.id ?? event._id ?? "",
                                createdBy: event.createdBy ?? "",
                                registeredUsers: [],
                                payments: [],
                            };
                            return (
                                <div key={idx}>
                                    <EventCard {...normEvent} onCardClick={() => handleEventClick(normEvent)} />
                                </div>
                            );
                        })}
                    </div>
                )}

                {!isLoading && totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
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
            </section>

            <EventDetailsModal
                event={selectedEvent}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRegister={async (id) => { }}
                isRegistering={false}
                paymentStatus={null}
                showVerify={false}
                onVerifyPayment={async () => { }}
            />
        </div>
    );
}
