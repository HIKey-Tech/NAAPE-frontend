"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    FaCalendarAlt,
    FaMoneyBillAlt,
    FaUsers,
    FaCog,
    FaEnvelope,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";
import Link from "next/link"; // Use Link for better navigation if possible, but router.push is fine for maintaining existing logic

export enum EventSection {
    MANAGEMENT = 'management',
    PAYMENTS = 'payments',
    ATTENDEES = 'attendees',
    SETTINGS = 'settings',
    COMMUNICATIONS = 'communications'
}

interface AdminEventsLayoutProps {
    children: React.ReactNode;
    activeSection: EventSection;
    onSectionChange: (section: EventSection) => void;
}

interface EventNavItem {
    section: EventSection;
    label: string;
    icon: React.ElementType;
    href: string;
}

const eventNavItems: EventNavItem[] = [
    {
        section: EventSection.MANAGEMENT,
        label: "Event Management",
        icon: FaCalendarAlt,
        href: "/admin/events/management"
    },
    {
        section: EventSection.PAYMENTS,
        label: "Payment Oversight",
        icon: FaMoneyBillAlt,
        href: "/admin/events/payments"
    },
    {
        section: EventSection.ATTENDEES,
        label: "Attendee Management",
        icon: FaUsers,
        href: "/admin/events/attendees"
    },
    {
        section: EventSection.SETTINGS,
        label: "Event Settings",
        icon: FaCog,
        href: "/admin/events/settings"
    },
    {
        section: EventSection.COMMUNICATIONS,
        label: "Event Communications",
        icon: FaEnvelope,
        href: "/admin/events/communications"
    }
];

function EventsDropdown({ pathname, activeSection, onSectionChange }: {
    pathname: string | null;
    activeSection: EventSection;
    onSectionChange: (section: EventSection) => void;
}) {
    // Check if any events section is active
    const isEventsActive = pathname?.startsWith("/admin/events") || false;
    const [open, setOpen] = useState(isEventsActive);
    const router = useRouter();

    useEffect(() => {
        // Auto-open if active, but allow toggling
        if (isEventsActive) setOpen(true);
    }, [isEventsActive]);

    const handleItemClick = (item: EventNavItem) => {
        onSectionChange(item.section);
        router.push(item.href);
    };

    return (
        <div className="mb-1">
            <button
                type="button"
                className={`
                    flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium gap-3 transition-all duration-200 group
                    ${isEventsActive ? "text-primary bg-primary/5 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                `}
                onClick={() => setOpen(!open)}
            >
                <FaCalendarAlt className={`w-5 h-5 flex-shrink-0 transition-colors ${isEventsActive ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
                <span className="flex-1 text-left truncate">
                    Events
                </span>
                <span className="text-slate-400">
                    {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
            </button>

            {open && (
                <ul className="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 ml-6 animate-in slide-in-from-top-1 duration-200">
                    {eventNavItems.map((item) => {
                        const isActive = item.section === activeSection;
                        return (
                            <li key={item.section}>
                                <button
                                    onClick={() => handleItemClick(item)}
                                    className={`
                                        flex items-center w-full px-3 py-2 rounded-lg text-sm transition-colors text-left
                                        ${isActive ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                                    `}
                                >
                                    <span className="truncate">{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export function AdminEventsLayout({ children, activeSection, onSectionChange }: AdminEventsLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

export { EventsDropdown };