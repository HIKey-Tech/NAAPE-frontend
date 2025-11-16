"use client";

import {
    FaHome,
    FaSearch,
    FaNewspaper,
    FaBook,
    FaPlusSquare,
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaBriefcase,
    FaComments,
    FaCog,
    FaSignOutAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo, useState, useRef } from "react";
import { usePathname } from "next/navigation";

// Add animation styles for icons & dropdown
const iconAnimationStyles = `
@keyframes icon-bounce {
  0%, 100% { transform: translateY(0);}
  15% { transform: translateY(-4px);}
  30% { transform: translateY(2px);}
  45% { transform: translateY(-2px);}
  60% { transform: translateY(1px);}
  75% { transform: translateY(-1px);}
}
.animated-sidebar-icon, .animated-dropdown-icon {
  transition: color 0.2s;
}
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon {
  animation: icon-bounce 0.5s;
  color: #357AA8 !important;
}
.sidebar-navitem-active .animated-sidebar-icon {
  animation: icon-bounce 0.7s;
  color: #357AA8 !important;
}

/* Dropdown submenu icon animation */
.dropdown-navitem:hover .animated-dropdown-icon,
.dropdown-navitem:focus .animated-dropdown-icon {
  animation: icon-bounce 0.5s;
  color: #357AA8 !important;
}
.dropdown-active .animated-dropdown-icon {
  animation: icon-bounce 0.7s;
  color: #357AA8 !important;
}
`;

type User = {
    name: string;
    email: string;
    avatarUrl: string;
};

type NavLink = {
    label: string;
    icon: React.ElementType;
    href?: string;
};

const user: User = {
    name: "Engr. Aksem",
    email: "engr.aksem@gmail.com",
    avatarUrl: "/user-avatar.jpg",
};

const navLinksMain: NavLink[] = [
    {
        label: "Home",
        icon: FaHome,
        href: "/dashboard"
    },
    // News & Publications will now be handled as a dropdown.
    {
        label: "Create Publication",
        icon: FaPlusSquare,
        href: "/publications/new"
    },
    {
        label: "Training & Certifications",
        icon: FaChalkboardTeacher,
        href: "/training"
    },
    {
        label: "Events",
        icon: FaCalendarAlt,
        href: "/events"
    },
    // {
    //     label: "Job Board",
    //     icon: FaBriefcase,
    //     href: "/jobs"
    // },
    {
        label: "Forum",
        icon: FaComments,
        href: "/forum"
    }
];

// Sub-links for the News & Publications dropdown
const publicationsDropdownLinks: NavLink[] = [
    {
        label: "Publications",
        icon: FaBook,
        href: "/publications"
    },
    {
        label: "News",
        icon: FaNewspaper,
        href: "/news"
    }
];

const navLinksSecondary: NavLink[] = [
    {
        label: "Settings",
        icon: FaCog,
        href: "/settings"
    }
];

// Improved: strict props and memo for user avatar
function UserAvatar({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-3 px-3 py-3">
            <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-[#D9E7F5] object-cover"
                priority
            />
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-sm font-semibold text-[#16355D] truncate">
                    {user.name}
                </span>
                <span className="text-xs text-[#96A6BF] truncate">
                    {user.email}
                </span>
            </div>
        </div>
    );
}

type NavItemProps = {
    icon: React.ElementType;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    ariaExpanded?: boolean;
    asButton?: boolean;
};

// Animated and accessible NavItem
function NavItem({
    icon: Icon,
    label,
    href,
    active = false,
    onClick,
    children,
    ariaExpanded,
    asButton = false,
}: NavItemProps) {
    const baseClass =
        "sidebar-navitem flex items-center w-full px-5 py-2.5 rounded-lg text-sm font-medium gap-3 mb-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#357AA8]";
    const activeClass = "sidebar-navitem-active bg-[#D8F3FF] text-[#357AA8]";
    const hoverInactive = "hover:bg-[#F5F7FA] text-[#203040]";
    const iconActive = "animated-sidebar-icon text-[#357AA8]";
    const iconInactive = "animated-sidebar-icon text-[#8CA1B6]";

    if (asButton) {
        return (
            <li className="relative">
                <button
                    type="button"
                    className={`${baseClass} ${hoverInactive} ${active ? activeClass : ""}`}
                    tabIndex={0}
                    aria-haspopup={children ? "menu" : undefined}
                    aria-expanded={ariaExpanded}
                    onClick={onClick}
                >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
                    <span className="flex-1 text-left">{label}</span>
                    {children ? (
                        <svg
                            className={`ml-auto h-3 w-3 transition-transform ${ariaExpanded ? "rotate-90" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <polyline points="6 8 10 12 14 8" />
                        </svg>
                    ) : null}
                </button>
                {children}
            </li>
        );
    }

    const content = (
        <>
            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
            <span>{label}</span>
        </>
    );

    if (href) {
        return (
            <li>
                <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`${baseClass} ${active ? activeClass : hoverInactive}`}
                    tabIndex={0}
                >
                    {content}
                </Link>
            </li>
        );
    }
    return (
        <li>
            <button
                type="button"
                className={`${baseClass} ${hoverInactive} ${active ? activeClass : ""}`}
                onClick={onClick}
                tabIndex={0}
            >
                {content}
            </button>
        </li>
    );
}

// Dropdown NavItem for News & Publications
function PublicationsDropdown({ pathname }: { pathname: string | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Determine active state
    const isChildActive = publicationsDropdownLinks.some(
        (link) => pathname === link.href || (link.href && pathname?.startsWith(link.href))
    );

    // Close dropdown when focus leaves the group
    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLUListElement>) => {
        // Only close if new focused element is outside the dropdown
        if (
            dropdownRef.current &&
            e.relatedTarget &&
            !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
            setOpen(false);
        }
    };

    return (
        <NavItem
            icon={FaSearch}
            label="News & Publications"
            active={isChildActive}
            asButton
            ariaExpanded={open}
            onClick={() => setOpen((v) => !v)}
        >
            <ul
                ref={dropdownRef}
                onBlur={handleBlur}
                className={`${open ? "block" : "hidden"
                    } absolute left-0 right-0 top-full z-40 bg-white border border-[#E6EFFA] rounded shadow
                    mt-1 ml-3 mr-3 py-1 sm:min-w-[198px] max-w-xs
                `}
                tabIndex={-1}
                role="menu"
                aria-label="News & Publications submenu"
            >
                {publicationsDropdownLinks.map((sublink) => {
                    // Dropdown icon animation: determine if current navitem is hovered/focused/active
                    const isActive = pathname === sublink.href;
                    // Use dropdown specific animation/hover/active classes for icon
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors
                                    hover:bg-[#F5F7FA]
                                    ${isActive ? "text-[#357AA8] font-semibold bg-[#D8F3FF]" : "text-[#203040]"}
                                `}
                                role="menuitem"
                                tabIndex={0}
                            >
                                <sublink.icon
                                    className={`w-4 h-4 flex-shrink-0 animated-dropdown-icon ${isActive ? "text-[#357AA8]" : "text-[#8CA1B6]"
                                        }`}
                                    aria-hidden="true"
                                />
                                <span>{sublink.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

// Lines 81-85 are the following block in navLinksMain:
/*
    {
        label: "Create Publication",
        icon: FaPlusSquare,
        href: "/publications/new"
    },
*/

// We want this link to be *visibly rendered* as part of the sidebar nav,
// so we need to actually render it in the menu. 
// Previously, navItemsMain[1] was skipped (return null). Now, always show it!

export function AppSidebar() {
    const pathname = usePathname();

    const handleSignOut = useCallback(() => {
        // TODO: Implement real sign out logic (redirect, API call, etc)
        alert("Signed out!");
    }, []);

    // Memoize nav item rendering; improves performance on navigation updates
    // Now INCLUDE "Create Publication" at index 1!
    const navItemsMain = useMemo(() =>
        navLinksMain.map((link, idx) => {
            // Do NOT skip index 1 anymore
            const isActive = link.href
                ? pathname === link.href ||
                (idx !== 0 && pathname?.startsWith(link.href))
                : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    active={isActive}
                />
            );
        })
        , [pathname]);

    const navItemsSecondary = useMemo(() =>
        navLinksSecondary.map((link) => {
            const isActive = link.href
                ? pathname === link.href
                : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    active={isActive}
                />
            );
        }),
        [pathname]
    );

    return (
        <>
            {/* Inject animation styles into the page */}
            <style>{iconAnimationStyles}</style>
            <nav
                className="sticky top-0 w-[92px] sm:w-[228px] min-w-full sm:min-w-[228px] max-w-full border-none bg-[#FAFCFE] h-screen flex flex-col justify-between shadow-none z-30"
                aria-label="Sidebar Navigation"
                role="navigation"
                style={{ /* fallback for sticky if customizations needed */ }}
            >
                {/* Logo and collapse button */}
                <header className="flex flex-col border-b border-[#E6EFFA] pb-2">
                    <div className="flex justify-between items-center px-4 pt-3 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Link href="/" aria-label="Home" className="block shrink-0 focus:outline-none focus:ring-2 focus:ring-[#357AA8]">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={65}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                    priority
                                />
                            </Link>
                            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-[#16355D] leading-tight truncate max-w-[114px]">
                                NAAPE, Nigeria association of aircraft pilots & engineers
                            </span>
                        </div>
                        <button
                            type="button"
                            aria-label="Collapse sidebar (not yet implemented)"
                            className="ml-1 flex items-center justify-center rounded-md hover:bg-[#E5F0FB] transition-colors p-[5px] focus:outline-none focus:ring-2 focus:ring-[#357AA8]"
                            tabIndex={0}
                            style={{ border: "1px solid #D7E2ED" }}
                            disabled
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#768EA6]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#AEBFD3" strokeWidth="1.5" fill="#fff" />
                                <path d="M13.5 9l-3 3 3 3" stroke="#768EA6" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                </header>
                {/* Navigation */}
                <ul className="flex-1 w-full flex flex-col py-2 px-0 overflow-y-auto">
                    {/* Home */}
                    {navItemsMain[0]}
                    {/* News & Publications Dropdown */}
                    <PublicationsDropdown pathname={pathname} />
                    {/* Create Publication (now visible) */}
                    {navItemsMain[1]}
                    {/* rest */}
                    {navItemsMain.slice(2)}
                </ul>
                <div className="border-t border-[#E6EFFA] bg-transparent">
                    <ul className="flex flex-col py-2 px-0">
                        {navItemsSecondary}
                        <NavItem
                            icon={FaSignOutAlt}
                            label="Sign Out"
                            onClick={handleSignOut}
                        />
                    </ul>
                </div>
                {/* User Profile Footer */}
                <footer className="w-full border-t border-[#E6EFFA] bg-[#F6FAFF]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <UserAvatar user={user} />
                        <div className="hidden sm:flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-[#16355D] truncate">{user.name}</span>
                            <span className="text-xs text-[#768EA6] truncate">{user.email}</span>
                        </div>
                    </div>
                </footer>
            </nav>
        </>
    );
}