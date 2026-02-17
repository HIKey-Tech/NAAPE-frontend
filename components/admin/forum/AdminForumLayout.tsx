"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    FaChartLine,
    FaList,
    FaGavel,
    FaUsers,
    FaFlag,
    FaChartBar,
    FaChevronDown,
    FaChevronUp
} from "react-icons/fa";
import ErrorBoundary from "../../ui/error-boundary";

export enum ForumSection {
    DASHBOARD = 'dashboard',
    CATEGORIES = 'categories',
    MODERATION = 'moderation',
    USERS = 'users',
    REPORTS = 'reports',
    ANALYTICS = 'analytics'
}

interface AdminForumLayoutProps {
    children: React.ReactNode;
    activeSection: ForumSection;
    onSectionChange: (section: ForumSection) => void;
}

interface ForumNavItem {
    section: ForumSection;
    label: string;
    icon: React.ElementType;
    href: string;
}

const forumNavItems: ForumNavItem[] = [
    {
        section: ForumSection.DASHBOARD,
        label: "Dashboard",
        icon: FaChartLine,
        href: "/admin/forum/dashboard"
    },
    {
        section: ForumSection.CATEGORIES,
        label: "Categories",
        icon: FaList,
        href: "/admin/forum/categories"
    },
    {
        section: ForumSection.MODERATION,
        label: "Moderation",
        icon: FaGavel,
        href: "/admin/forum/moderation"
    },
    {
        section: ForumSection.USERS,
        label: "Users",
        icon: FaUsers,
        href: "/admin/forum/users"
    },
    {
        section: ForumSection.REPORTS,
        label: "Reports",
        icon: FaFlag,
        href: "/admin/forum/reports"
    },
    {
        section: ForumSection.ANALYTICS,
        label: "Analytics",
        icon: FaChartBar,
        href: "/admin/forum/analytics"
    }
];

function ForumDropdown({ pathname, activeSection, onSectionChange }: {
    pathname: string | null;
    activeSection: ForumSection;
    onSectionChange: (section: ForumSection) => void;
}) {
    // Check if any forum section is active
    const isForumActive = pathname?.startsWith("/admin/forum") || false;
    const [open, setOpen] = useState(isForumActive);
    const router = useRouter();

    useEffect(() => {
        if (isForumActive) setOpen(true);
    }, [isForumActive]);

    const handleItemClick = (item: ForumNavItem) => {
        onSectionChange(item.section);
        router.push(item.href);
    };

    return (
        <div className="mb-1">
            <button
                type="button"
                className={`
                    flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium gap-3 transition-all duration-200 group
                    ${isForumActive ? "text-primary bg-primary/5 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                `}
                onClick={() => setOpen(!open)}
            >
                <FaChartLine className={`w-5 h-5 flex-shrink-0 transition-colors ${isForumActive ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
                <span className="flex-1 text-left truncate">
                    Forum
                </span>
                <span className="text-slate-400">
                    {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                </span>
            </button>

            {open && (
                <ul className="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 ml-6 animate-in slide-in-from-top-1 duration-200">
                    {forumNavItems.map((item) => {
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

export function AdminForumLayout({ children, activeSection, onSectionChange }: AdminForumLayoutProps) {
    return (
        <ErrorBoundary>
            <div className="flex flex-col min-h-screen bg-white">
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </ErrorBoundary>
    );
}

export { ForumDropdown };