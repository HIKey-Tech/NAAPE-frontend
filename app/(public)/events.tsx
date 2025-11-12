"use client";

import { NaapButton } from "@/components/ui/custom/button.naap";
import { EventCard } from "@/components/ui/custom/events.card";

const eventsList = [
    {
        imageUrl: "/images/event1.jpg",
        title: "Annual Aviation Safety Summit",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/images/event2.jpg",
        title: "Aviation Executives Roundtable",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/images/event1.jpg",
        title: "Cabin Crew Innovations Workshop",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
    {
        imageUrl: "/images/event2.jpg",
        title: "Digital Transformation in Aviation",
        date: "October 31, 2025",
        time: "9:00AM WAT",
        venue: "Eko Hotel & Suites, Victoria Island, Lagos",
        registerUrl: "#",
    },
];

export default function UpcomingEvents() {
    return (
        <section className="relative w-full max-w-full mx-auto min-h-full p-6 my-6">
            <div className="mb-8 flex flex-col items-center">
                <span className="text-[#CA9414] font-bold text-xs md:text-sm tracking-widest uppercase mb-2">
                    EVENTS & CONFERENCES
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#232835] mb-1 text-center">
                    Connect with peers, learn from experts, and shape the future of aviation at our upcoming events
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {eventsList.map((event, index) => (
                    <EventCard key={index} {...event} />
                ))}
            </div>
            <div className="flex justify-center mt-10">
                <a href="/events">
                    <NaapButton
                        className="bg-[#2852B4] hover:bg-[#2347A0] text-white font-semibold px-7 py-3 text-base shadow transition"
                    >
                        View All Events
                    </NaapButton>
                </a>
            </div>
        </section>
    );
}
