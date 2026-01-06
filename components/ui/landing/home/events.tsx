
"use client";

import { useState, useEffect, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import EventCard from "@/components/member/component/event.card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEvents, usePayForEvent, useVerifyPayment } from "@/hooks/useEvents";
import type { EventCardProps } from "@/app/api/events/type";

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.13,
        },
    },
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 66, damping: 16, duration: 0.55 },
    },
};

const fadeCardVariants = {
    hidden: { opacity: 0, scale: 0.93, y: 24 },
    show: (i: number) => ({
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            delay: i * 0.09 + 0.18,
            type: "spring",
            stiffness: 72,
            damping: 18,
            duration: 0.46,
        },
    }),
};

// --- MOBILE SLIDER COMPONENT ---

function EventsMobileSlider(props: { events: EventCardProps[] }) {
    const { events } = props;
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const prev = () => {
        setDirection(-1);
        setActive((a) => (a - 1 + events.length) % events.length);
    };
    const next = () => {
        setDirection(1);
        setActive((a) => (a + 1) % events.length);
    };

    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (events.length > 1) {
            intervalRef.current = setInterval(() => {
                setDirection(1);
                setActive((a) => (a + 1) % events.length);
            }, 3700);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [events.length]);

    const handlePrev = () => {
        prev();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setDirection(1);
                setActive((a) => (a + 1) % events.length);
            }, 3700);
        }
    };

    const handleNext = () => {
        next();
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setDirection(1);
                setActive((a) => (a + 1) % events.length);
            }, 3700);
        }
    };

    const swipeVariants = {
        enter: (dir: number) => ({
            x: typeof dir === "number" ? (dir > 0 ? 60 : -60) : 0,
            opacity: 0,
            scale: 0.97,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 75,
                damping: 18,
                duration: 0.45,
            },
        },
    };

    if (!events.length) return null;

    return (
        <div className="sm:hidden relative flex items-center justify-center w-full">
            <button
                type="button"
                className="absolute left-0 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-50 active:bg-gray-100"
                aria-label="Previous event"
                onClick={handlePrev}
                style={{ top: "40%" }}
            >
                <FaChevronLeft size={20} className="text-primary" />
            </button>
            <div className="w-full flex justify-center px-6" style={{ minHeight: 350 }}>
                <motion.div
                    key={active}
                    custom={direction}
                    variants={swipeVariants as any}
                    initial="enter"
                    animate="center"
                    transition={{ type: "spring", stiffness: 80, damping: 19 }}
                    className="w-full flex justify-center"
                >
                    <EventCard {...events[active]} />
                </motion.div>
            </div>
            <button
                type="button"
                className="absolute right-0 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-50 active:bg-gray-100"
                aria-label="Next event"
                onClick={handleNext}
                style={{ top: "40%" }}
            >
                <FaChevronRight size={20} className="text-primary" />
            </button>
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {events.map((_, i) => (
                    <motion.span
                        key={i}
                        className={`inline-block w-2 h-2 rounded-full ${
                            i === active ? "bg-primary" : "bg-gray-300"
                        }`}
                        layoutId="event-slider-dot"
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    />
                ))}
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---

export default function UpcomingEvents() {
    // Fetch events via react-query hook
    const { data, isLoading, isError } = useEvents();
    const payForEvent = usePayForEvent();
    const verifyPayment = useVerifyPayment();

    // Normalization: Ensure data is an array and matches EventCardProps shape
    let eventsList: EventCardProps[] = [];
    if (Array.isArray(data)) {
        eventsList = data.map((e: any): EventCardProps => ({
            ...e,
            id: e.id ?? e._id ?? "",
            // Clean up createdBy, registeredUsers and payments based on interface shape
            createdBy: e.createdBy ?? "",
            registeredUsers: Array.isArray(e.registeredUsers)
                ? e.registeredUsers
                : typeof e.registeredUsers === "number"
                ? Array(e.registeredUsers)
                      .fill("")
                      .map((_, idx) => `User${idx + 1}`)
                : [],
            payments: Array.isArray(e.payments)
                ? e.payments.map((p: any, i: number) => ({
                      user: p.user ?? "",
                      transactionId: p.transactionId ?? p.id ?? `txn_${e.id}_${i + 1}`,
                      amount: p.amount ?? 0,
                      status: p.status ?? "successful",
                      date: p.date ?? "",
                  }))
                : [],
        }));
    }

    return (
        <motion.section
            className="relative w-full max-w-full mx-auto min-h-full p-6 my-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px 0px" }}
        >
            <motion.div className="mb-8 flex flex-col items-center" variants={fadeUpVariants as any}>
                <span className="text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                    EVENTS & CONFERENCES
                </span>
                <motion.h2
                    className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-1 text-center"
                    variants={fadeUpVariants as any}
                >
                    Connect with peers, learn from experts, and shape the future of aviation at our upcoming events
                </motion.h2>
            </motion.div>
            {/* Mobile: Slideshow */}
            {isLoading ? (
                <div className="flex justify-center items-center h-48 w-full">Loading events...</div>
            ) : isError ? (
                <div className="flex justify-center items-center h-48 w-full text-red-500">
                    Failed to load events.
                </div>
            ) : (
                <EventsMobileSlider events={eventsList} />
            )}

            {/* Desktop: Grid */}
            <motion.div
                className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={containerVariants}
            >
                {isLoading ? (
                    Array(4)
                        .fill(0)
                        .map((_, i) => (
                            <motion.div
                                key={i}
                                variants={fadeCardVariants as any}
                                className="w-full h-[325px] bg-gray-100 animate-pulse rounded-lg"
                            />
                        ))
                ) : isError ? (
                    <div className="col-span-4 text-center text-red-500 py-12">Failed to load events.</div>
                ) : (
                    eventsList.map((event, index) => (
                        <motion.div
                            key={event.id || event._id || index}
                            custom={index}
                            variants={fadeCardVariants as any}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-60px" }}
                        >
                            <EventCard {...event} />
                        </motion.div>
                    ))
                )}
            </motion.div>
            <motion.div
                className="flex pointer-cursor justify-center mt-10"
                variants={fadeUpVariants as any}
            >
                <a href="/login">
                    <NaapButton className="bg-[color:var(--primary)] pointer-cursor hover:bg-[color:var(--primary)]/90 text-white font-semibold px-8 py-3.5 text-[1.08rem] w-fit rounded-full transition mt-4">
                        View All Events
                    </NaapButton>
                </a>
            </motion.div>
        </motion.section>
    );
}

