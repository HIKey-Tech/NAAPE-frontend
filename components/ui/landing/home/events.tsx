
"use client";

import { useState, useEffect, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import EventCard from "@/components/member/component/event.card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- EVENT DATA: Ensure compatibility with EventCardProps ---

const eventsListRaw = [
    {
        id: "1",
        imageUrl: "/events/event2.jpg",
        title: "Annual Aviation Safety Summit",
        date: "2025-10-31T09:00:00+01:00",
        location: "Eko Hotel & Suites, Victoria Island, Lagos",
        description: "Join aviation leaders to discuss safety and best practices for the industry.",
        price: 0,
        currency: "NGN",
        isPaid: false,
        createdBy: { name: "Naap", email: "info@naap.org" },
        registeredUsers: 42,
        createdAt: "2025-08-21T10:00:00+01:00",
        updatedAt: "2025-08-23T10:00:00+01:00",
        registerLabel: "Register",
        payments: [],
    },
    {
        id: "2",
        imageUrl: "/events/event1.jpg",
        title: "Aviation Executives Roundtable",
        date: "2025-10-31T09:00:00+01:00",
        location: "Eko Hotel & Suites, Victoria Island, Lagos",
        description: "A closed-door session for executives shaping West African skies.",
        price: 20000,
        currency: "NGN",
        isPaid: true,
        createdBy: { name: "Naap", email: "info@naap.org" },
        registeredUsers: 38,
        createdAt: "2025-08-28T12:00:00+01:00",
        updatedAt: "2025-08-30T12:00:00+01:00",
        registerLabel: "Register",
        payments: [
            {
                id: "pay1",
                user: { name: "Ada O.", email: "ada@example.com" },
                amount: 20000,
                currency: "NGN",
                date: "2025-09-01T10:00:00+01:00",
            },
        ],
    },
    {
        id: "3",
        imageUrl: "/events/event3.jpg",
        title: "Cabin Crew Innovations Workshop",
        date: "2025-10-31T09:00:00+01:00",
        location: "Eko Hotel & Suites, Victoria Island, Lagos",
        description: "Explore the latest trends in cabin crew training and technology.",
        price: 0,
        currency: "NGN",
        isPaid: true,
        createdBy: { name: "Naap", email: "info@naap.org" },
        registeredUsers: 55,
        createdAt: "2025-09-05T08:30:00+01:00",
        updatedAt: "2025-09-07T08:30:00+01:00",
        registerLabel: "Register",
        payments: [],
    },
    {
        id: "4",
        imageUrl: "/events/inspiring.jpg",
        title: "Digital Transformation in Aviation",
        date: "2025-10-31T09:00:00+01:00",
        location: "Eko Hotel & Suites, Victoria Island, Lagos",
        description: "Harness the power of digital tools for safe and efficient operations.",
        price: 15000,
        currency: "NGN",
        isPaid: true,
        createdBy: { name: "Naap", email: "info@naap.org" },
        registeredUsers: 61,
        createdAt: "2025-09-12T14:00:00+01:00",
        updatedAt: "2025-09-15T14:00:00+01:00",
        registerLabel: "Register",
        payments: [
            {
                id: "pay2",
                user: { name: "Yusuf A.", email: "yusuf@aviation.com" },
                amount: 15000,
                currency: "NGN",
                date: "2025-09-15T09:00:00+01:00",
            },
            {
                id: "pay3",
                user: { name: "Ngozi N.", email: "ngozi@pilot.africa" },
                amount: 15000,
                currency: "NGN",
                date: "2025-09-15T10:30:00+01:00",
            },
        ],
    },
];

const eventsList = eventsListRaw.map((e) => ({
    ...e,
    createdBy:
        typeof e.createdBy === "object" && e.createdBy !== null && "name" in e.createdBy
            ? e.createdBy.name
            : typeof e.createdBy === "string"
            ? e.createdBy
            : "",
    registeredUsers:
        Array.isArray(e.registeredUsers)
            ? e.registeredUsers
            : typeof e.registeredUsers === "number"
            ? Array(e.registeredUsers).fill("").map((_, idx) => `User${idx + 1}`)
            : [],
    payments: Array.isArray(e.payments)
        ? e.payments.map((p: any, i: number) => ({
            user:
                p && p.user && typeof p.user === "object" && "name" in p.user
                    ? p.user.name
                    : typeof p.user === "string"
                    ? p.user
                    : "",
            transactionId: p.id || `txn_${e.id}_${i + 1}`,
            amount: p.amount || 0,
            status: "successful",
            date: p.date || "",
        }))
        : [],
}));

// --- ANIMATION variants ---

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
    // REMOVE exit variant so card does not disappear on click or animate on exit:
    // exit: { opacity: 0, scale: 0.93, y: 24, transition: { duration: 0.26 } },
};

// --- MOBILE SLIDER COMPONENT ---

function EventsMobileSlider({ events }: { events: typeof eventsList }) {
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
        intervalRef.current = setInterval(() => {
            setDirection(1);
            setActive((a) => (a + 1) % events.length);
        }, 3700);
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
            x: dir > 0 ? 60 : -60,
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
        // REMOVE exit for the same reason—card shouldn't disappear when clicked
        // exit: (dir: number) => ({
        //     x: dir > 0 ? -60 : 60,
        //     opacity: 0,
        //     scale: 0.97,
        //     transition: { duration: 0.22 },
        // }),
    };

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
                {/* Remove AnimatePresence to prevent disappearance on click (exit animation triggers remount) */}
                <motion.div
                    key={active}
                    custom={direction}
                    variants={swipeVariants as any}
                    initial="enter"
                    animate="center"
                    // Don't set exit prop or use AnimatePresence, just simple animate in
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
            <EventsMobileSlider events={eventsList} />
            {/* Desktop: Grid */}
            <motion.div
                className="hidden sm:grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={containerVariants}
            >
                {eventsList.map((event, index) => (
                    <motion.div
                        key={event.id || index}
                        custom={index}
                        variants={fadeCardVariants as any}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-60px" }}
                        // exit prop removed for grid cards as well
                    >
                        <EventCard {...event} />
                    </motion.div>
                ))}
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

