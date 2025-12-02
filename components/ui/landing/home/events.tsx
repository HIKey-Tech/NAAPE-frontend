
"use client"

import { useState, useEffect, useRef } from "react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { EventCard } from "@/components/ui/custom/events.card";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Use Tailwind primary color via bg-primary, text-primary, etc.
// Remove all hard-coded #2852B4 in favor of Tailwind's primary

const eventsList = [
    {
        imageUrl: "/events/event2.jpg",
        title: "Annual Aviation Safety Summit",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/events/event1.jpg",
        title: "Aviation Executives Roundtable",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/events/event3.jpg",
        title: "Cabin Crew Innovations Workshop",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/events/inspiring.jpg",
        title: "Digital Transformation in Aviation",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
];

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18,
            delayChildren: 0.13
        }
    }
};

const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 66, damping: 16, duration: 0.55 } }
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
            duration: 0.46
        }
    }),
    exit: { opacity: 0, scale: 0.93, y: 24, transition: { duration: 0.26 } }
};

function EventsMobileSlider({ events }: { events: typeof eventsList }) {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState(0); // for swipe animation
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const prev = () => {
        setDirection(-1);
        setActive((a) => (a - 1 + events.length) % events.length);
    };
    const next = () => {
        setDirection(1);
        setActive((a) => (a + 1) % events.length);
    };

    // Auto slide logic
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

    // Reset timer when user manually clicks
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

    // Animations for mobile slider
    const swipeVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 60 : -60,
            opacity: 0,
            scale: 0.97
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
                duration: 0.45
            }
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -60 : 60,
            opacity: 0,
            scale: 0.97,
            transition: { duration: 0.22 }
        }),
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
                <AnimatePresence custom={direction} mode="wait" initial={false}>
                    <motion.div
                        key={active}
                        custom={direction}
                        variants={swipeVariants as any}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 80, damping: 19 }}
                        className="w-full flex justify-center"
                    >
                        <EventCard {...events[active]} />
                    </motion.div>
                </AnimatePresence>
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
                        className={`inline-block w-2 h-2 rounded-full ${i === active ? "bg-primary" : "bg-gray-300"}`}
                        layoutId="event-slider-dot"
                        transition={{ type: "spring", stiffness: 380, damping: 22 }}
                    />
                ))}
            </div>
        </div>
    );
}

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
                        key={index}
                        custom={index}
                        variants={fadeCardVariants as any}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-60px" }}
                    >
                        <EventCard {...event} />
                    </motion.div>
                ))}
            </motion.div>
            <motion.div
                className="flex justify-center mt-10"
                variants={fadeUpVariants as any}
            >
                <a href="/login">
                    <NaapButton
                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3 text-base shadow transition"
                    >
                        View All Events
                    </NaapButton>
                </a>
            </motion.div>
        </motion.section>
    );
}

