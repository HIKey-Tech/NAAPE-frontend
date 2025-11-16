"use client";
import React from "react";
import DashboardCard from "../component/dashboardcard";
import PublicationCard from "../component/publication.card";
import EventCard from "../component/event.card";
import CertCard from "../component/cert.card";
import {
    MdAttachMoney,
    MdLibraryBooks,
    MdAssignmentTurnedIn,
    MdWork,
} from "react-icons/md";

// More robust TypeScript types for clarity
type DashboardCardData = {
    icon: React.ReactNode;
    value: number;
    label: string;
};

type PublicationStatus = "pending" | "published" | "rejected";
type PublicationData = {
    imageUrl: string;
    title: string;
    author: string;
    date: string;
    status: PublicationStatus;
};

type CertificationStatus = "pending" | "ongoing" | "completed";
type CertificationData = {
    title: string;
    startDate: string;
    description: string;
    status: CertificationStatus;
    progress?: number;
};

type EventData = {
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    onRegister: () => void;
    registerLabel: string;
};

// Demo data arrays
const dashboardCardsData: DashboardCardData[] = [
    {
        icon: <MdAttachMoney className="text-[#4267E7] text-2xl" />,
        value: 12,
        label: "Publications Submitted",
    },
    {
        icon: <MdLibraryBooks className="text-[#41B079] text-2xl" />,
        value: 4,
        label: "Trainings Enrolled",
    },
    {
        icon: <MdAssignmentTurnedIn className="text-[#F4B645] text-2xl" />,
        value: 5,
        label: "Events Registered",
    },
    {
        icon: <MdWork className="text-[#748095] text-2xl" />,
        value: 3,
        label: "Job Matches",
    },
];

const publicationsData: PublicationData[] = [
    {
        imageUrl: "/images/plane.jpg",
        title: "Next Generation Avionics Systems",
        author: "Emeka Okezie",
        date: "Jan 31, 2023",
        status: "published",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Next Generation Avionics Systems",
        author: "Emeka Okezie",
        date: "Jan 31, 2023",
        status: "pending",
    },
    {
        imageUrl: "/images/plane.jpg",
        title: "Next Generation Avionics Systems",
        author: "Emeka Okezie",
        date: "Jan 31, 2023",
        status: "pending",
    },
];

const certificationsData: CertificationData[] = [
    {
        title: "Advanced CRM for Flight Crews",
        startDate: "Nov 27, 2025",
        description:
            "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
        status: "ongoing",
        progress: 75,
    },
    {
        title: "Advanced CRM for Flight Crews",
        startDate: "Nov 27, 2025",
        description:
            "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
        status: "pending",
    },
    {
        title: "Advanced CRM for Flight Crews",
        startDate: "Nov 27, 2025",
        description:
            "Enhance crew resource management, decision-making, and communication skills in high-stress situations.",
        status: "completed",
    },
];

const eventsData: EventData[] = [
    {
        title: "Annual Aviation Safety",
        date: "Nov 27, 2025",
        location: "Abuja International Conference Center",
        imageUrl: "/images/plane.jpg",
        onRegister: () => alert("Register for Aviation Safety Event!"),
        registerLabel: "Register",
    },
    {
        title: "Annual Aviation Safety",
        date: "Nov 27, 2025",
        location: "Abuja International Conference Center",
        imageUrl: "/images/plane.jpg",
        onRegister: () => alert("Register for Aviation Safety Event!"),
        registerLabel: "Register",
    },
    {
        title: "Annual Aviation Safety",
        date: "Nov 27, 2025",
        location: "Abuja International Conference Center",
        imageUrl: "/images/plane.jpg",
        onRegister: () => alert("Register for Aviation Safety Event!"),
        registerLabel: "Register",
    },
    {
        title: "Annual Aviation Safety",
        date: "Nov 27, 2025",
        location: "Abuja International Conference Center",
        imageUrl: "/images/plane.jpg",
        onRegister: () => alert("Register for Aviation Safety Event!"),
        registerLabel: "Register",
    },
];

type SectionHeaderProps = {
    title: string;
    linkLabel?: string;
    href?: string;
    hideLink?: boolean;
    onLinkClick?: () => void;
    className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    linkLabel = "View All",
    href = "",
    hideLink = false,
    onLinkClick,
    className = "",
}) => (
    <div className={`flex justify-between items-center mb-3 mt-2 ${className}`}>
        <h2 className="text-[17px] sm:text-lg font-semibold text-[#222F43] tracking-tight">
            {title}
        </h2>
        {!hideLink && (
            href ? (
                <a
                    href={href}
                    onClick={onLinkClick}
                    className="text-[#4267E7] text-[13px] font-medium hover:underline focus:outline-none focus:text-[#2143B7] transition-colors"
                    tabIndex={0}
                    aria-label={typeof linkLabel === "string" ? linkLabel : "Section navigation"}
                >
                    {linkLabel}
                </a>
            ) : (
                <button
                    type="button"
                    onClick={onLinkClick}
                    className="text-[#4267E7] text-[13px] font-medium hover:underline focus:outline-none focus:text-[#2143B7] transition-colors bg-transparent"
                    tabIndex={0}
                >
                    {linkLabel}
                </button>
            )
        )}
    </div>
);

const MemberDashboardHome: React.FC = () => {
    return (
        <section className="w-full max-w-full px-4  py-8">
            {/* Welcome Header */}
            <div className="mb-6">
                <div className="text-[16px] font-medium text-[#212B36]">
                    Good Morning, Engr. Akeem!
                </div>
                <div className="text-[13px] text-[#919EAB] mt-0.5">
                    Here’s what’s happening in your aviation network today.
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 w-full gap-5 mb-8">
                {dashboardCardsData.map((card, idx) => (
                    <DashboardCard
                        key={idx}
                        icon={card.icon}
                        value={card.value}
                        label={card.label}
                    />
                ))}
            </div>

            {/* News & Publications */}
            <section className="mb-10">
                <SectionHeader title="News & Publications" href="/publications" />
                <div className="grid grid-cols-1 sm:grid-cols-2 w-full md:grid-cols-3 gap-4 ">
                    {publicationsData.map((pub, idx) => (
                        <PublicationCard
                            key={idx}
                            imageUrl={pub.imageUrl}
                            title={pub.title}
                            author={pub.author}
                            date={pub.date}
                            status={pub.status}
                        />
                    ))}
                </div>
            </section>

            {/* Training & Certifications */}
            <section className="mb-10">
                <SectionHeader title="Training & Certifications" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {certificationsData.map((cert, idx) => (
                        <CertCard
                            key={idx}
                            title={cert.title}
                            startDate={cert.startDate}
                            description={cert.description}
                            status={cert.status}
                            progress={cert.progress}
                        />
                    ))}
                </div>
            </section>

            {/* Upcoming Events */}
            <section>
                <SectionHeader title="Upcoming Events" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {eventsData.map((ev, idx) => (
                        <EventCard
                            key={idx}
                            title={ev.title}
                            date={ev.date}
                            location={ev.location}
                            imageUrl={ev.imageUrl}
                            onRegister={ev.onRegister}
                            registerLabel={ev.registerLabel}
                        />
                    ))}
                </div>
            </section>
        </section>
    );
};

export default MemberDashboardHome;
