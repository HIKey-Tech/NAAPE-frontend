"use client";

import React, { useState, useRef, useEffect } from "react";
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
    description: string;
}

const forumNavItems: ForumNavItem[] = [
    {
        section: ForumSection.DASHBOARD,
        label: "Forum Dashboard",
        icon: FaChartLine,
        href: "/admin/forum/dashboard",
        description: "Overview & key metrics"
    },
    {
        section: ForumSection.CATEGORIES,
        label: "Forum Categories",
        icon: FaList,
        href: "/admin/forum/categories",
        description: "Manage forum categories"
    },
    {
        section: ForumSection.MODERATION,
        label: "Forum Moderation",
        icon: FaGavel,
        href: "/admin/forum/moderation",
        description: "Moderate threads & replies"
    },
    {
        section: ForumSection.USERS,
        label: "Forum Users",
        icon: FaUsers,
        href: "/admin/forum/users",
        description: "Manage forum users"
    },
    {
        section: ForumSection.REPORTS,
        label: "Forum Reports",
        icon: FaFlag,
        href: "/admin/forum/reports",
        description: "Handle user reports"
    },
    {
        section: ForumSection.ANALYTICS,
        label: "Forum Analytics",
        icon: FaChartBar,
        href: "/admin/forum/analytics",
        description: "Statistics & insights"
    }
];

function ForumDropdown({ pathname, activeSection, onSectionChange }: { 
    pathname: string | null; 
    activeSection: ForumSection;
    onSectionChange: (section: ForumSection) => void;
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const router = useRouter();

    // Check if any forum section is active
    const isForumActive = pathname?.startsWith("/admin/forum") || false;
    const activeItem = forumNavItems.find(item => item.section === activeSection);

    useEffect(() => { 
        setOpen(false); 
    }, [pathname]);

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLUListElement>) => {
        if (
            dropdownRef.current &&
            e.relatedTarget &&
            !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
            setOpen(false);
        }
    };

    const handleItemClick = (item: ForumNavItem) => {
        onSectionChange(item.section);
        router.push(item.href);
        setOpen(false);
    };

    return (
        <li className="relative">
            <button
                type="button"
                className={`sidebar-navitem flex items-center w-full px-5 py-2.5 rounded-lg text-[15px] font-medium gap-3 mb-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary ${
                    isForumActive 
                        ? "sidebar-navitem-active text-primary bg-[#e5effa] border-l-4 border-primary font-bold" 
                        : "hover:bg-[#edf3fa] text-[#1a2332]"
                }`}
                tabIndex={0}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen(v => !v)}
                onBlur={handleBlur}
                style={isForumActive ? { color: "var(--color-primary)", fontWeight: 700 } : undefined}
            >
                <FaChartLine 
                    className={`w-5 h-5 shrink-0 animated-sidebar-icon ${
                        isForumActive ? "text-primary" : "text-[#96a3b9]"
                    }`} 
                    style={isForumActive ? { color: "var(--color-primary)" } : undefined} 
                />
                <span className="flex-1 text-left hidden sm:inline">
                    Forum
                </span>
                <span className="ml-auto text-xs text-[#a4adc3] font-normal hidden sm:inline">
                    Management
                </span>
                {open ? (
                    <FaChevronUp className="ml-auto h-3 w-3 transition-transform" />
                ) : (
                    <FaChevronDown className="ml-auto h-3 w-3 transition-transform" />
                )}
            </button>
            
            <ul
                ref={dropdownRef}
                onBlur={handleBlur}
                className={`${
                    open ? "block" : "hidden"
                } absolute left-0 right-0 top-full z-40 bg-[#f5f8fa] border-2 border-[#b8d2f0] rounded mt-1 ml-3 mr-3 py-1 sm:min-w-[280px] max-w-sm`}
                tabIndex={-1}
                role="menu"
                aria-label="Forum Management submenu"
                style={{ boxShadow: "none" }}
            >
                {forumNavItems.map((item) => {
                    const isActive = item.section === activeSection;
                    return (
                        <li key={item.section} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`flex items-center gap-3 px-4 py-3 rounded text-[15px] font-medium transition-colors hover:bg-[#eaf3fd] w-full text-left ${
                                    isActive 
                                        ? "font-bold bg-[#def0fc] text-primary border-l-4 border-primary" 
                                        : "text-[#243050]"
                                }`}
                                role="menuitem"
                                tabIndex={0}
                                style={isActive ? { color: "var(--color-primary)" } : undefined}
                            >
                                <item.icon 
                                    className={`w-4 h-4 shrink-0 animated-dropdown-icon${
                                        isActive ? " text-primary" : " text-[#7d8daa]"
                                    }`}
                                    style={isActive ? { color: "var(--color-primary)" } : undefined} 
                                    aria-hidden="true" 
                                />
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="hidden sm:inline font-medium">{item.label}</span>
                                    <span className="hidden sm:inline text-xs text-[#9ca9c7] font-normal">
                                        {item.description}
                                    </span>
                                </div>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </li>
    );
}

export function AdminForumLayout({ children, activeSection, onSectionChange }: AdminForumLayoutProps) {
    const pathname = usePathname();

    return (
        <ErrorBoundary>
            <div className="flex flex-col min-h-screen bg-[#fafcfe]">
                {/* Main Content */}
                <div className="flex-1">
                    <ErrorBoundary>
                        {children}
                    </ErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    );
}

// Export the dropdown component for integration with the main admin sidebar
export { ForumDropdown };