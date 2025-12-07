"use client";

import {
    FaHome,
    FaSearch,
    FaBookOpen,
    FaPlus,
    FaUserGraduate,
    FaRegCalendarCheck,
    FaBriefcase,
    FaRegComments,
    FaSignOutAlt,
    FaUserFriends,
    FaMoneyBillAlt,
    FaRegIdBadge,
    FaNewspaper
} from "react-icons/fa";
import {
    FaUsers,
    FaMoneyCheckAlt,
    FaIdBadge,
    FaCalendarAlt,
    FaComments,
    FaBook,
    FaPlusSquare,
    FaChalkboardTeacher
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";

// Improved and more detailed hierarchy: Group/category definitions ===================

type NavLink = {
    label: string;
    icon: React.ElementType;
    href?: string;
    group?: string; // e.g. "Content", "User Management"
    description?: string;
    subcategory?: string; // for category-specific grouping
};

// --- Visual Contrast & Hierarchy: CSS ---
const iconAnimationStyles = `
/* ... same as before ... */
@keyframes icon-bounce {
  0%, 100% { transform: translateY(0);}
  15% { transform: translateY(-4px);}
  30% { transform: translateY(2px);}
  45% { transform: translateY(-2px);}
  60% { transform: translateY(1px);}
  75% { transform: translateY(-1px);}
}
.animated-sidebar-icon, .animated-bottomnav-icon, .animated-dropdown-icon {
  transition: color 0.2s;
}
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon,
.bottomnav-item:hover .animated-bottomnav-icon,
.bottomnav-item:focus .animated-bottomnav-icon {
  animation: icon-bounce 0.5s;
  color: var(--color-primary) !important;
}
.sidebar-navitem-active .animated-sidebar-icon,
.bottomnav-item-active .animated-bottomnav-icon {
  animation: icon-bounce 0.7s;
  color: var(--color-primary) !important;
}
.dropdown-navitem:hover .animated-dropdown-icon,
.dropdown-navitem:focus .animated-dropdown-icon {
  animation: icon-bounce 0.5s;
  color: var(--color-primary) !important;
}
.dropdown-active .animated-dropdown-icon {
  animation: icon-bounce 0.7s;
  color: var(--color-primary) !important;
}
/* Remove all shadow/background gradient for clear flat look */
@media (max-width: 639px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 58px;
    z-index: 50;
    background: #f7f9fb;
    border-top: 2px solid #d9e7f5;
    margin-top: 24px;
  }
  .mobile-bottom-nav ul {
    flex: 1 1 0;
    display: flex; width: 100%; height: 100%;
    padding: 0; margin: 0;
    align-items: stretch; justify-content: space-around;
    list-style: none;
  }
  .bottomnav-item {
    flex: 1 1 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-size: 11px; color: #17223b;
    gap: 4px;
    text-align: center;
    font-weight: 500;
    min-width: 0; min-height: 0;
    height: 58px;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    transition: background 0.13s;
    cursor: pointer;
    letter-spacing: 0.01em;
  }
  .bottomnav-item .animated-bottomnav-icon {
    width: 22px;
    height: 22px;
    display: block;
    margin: 0 auto 1px auto;
    color: #8E9BB5;
    transition: color 0.2s;
  }
  .bottomnav-item-active {
    background: #def0fc;
    color: var(--color-primary);
    font-weight: 700;
    border-left: 3px solid var(--color-primary);
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: var(--color-primary) !important;
  }
  .bottomnav-dropdown-panel {
    position: absolute;
    bottom: 62px;
    left: 8px; right: 8px;
    background: #fff;
    border-radius: 7px;
    border: 2px solid #c4d4e9;
    z-index: 51;
    padding: 5px 0 2px 0;
    animation: dropdown-fadein 0.18s cubic-bezier(0.42,0,0.58,1);
  }
  @keyframes dropdown-fadein {
    0% { transform: translateY(12px); opacity: 0;}
    100% { transform: translateY(0); opacity: 1;}
  }
  .bottomnav-label {
    font-size: 11.3px;
    font-weight: 500;
    line-height: 1.06;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
    margin-top: 0;
    color: #1a2440;
    transition: color 0.2s;
  }
  .sidebar-container,
  .mobile-topbar { display: none !important; }
}
@media (min-width: 640px) {
  .mobile-bottom-nav { display: none !important; }
}
`;

// --- Navigation structure grouped for deeper visual hierarchy ------------

// Section: Dashboard & Home
const homeLinks: NavLink[] = [
    {
        label: "Overview",
        icon: FaHome,
        href: "/admin/dashboard",
        group: "Dashboard",
        description: "Admin Home & Stats"
    },
];

// Section: User Management
const userManagementLinks: NavLink[] = [
    {
        label: "Members",
        icon: FaUsers,
        href: "/admin/members",
        group: "User Management",
        description: "View and manage members"
    },
    {
        label: "Payment History",
        icon: FaMoneyCheckAlt,
        href: "/admin/members/payment-history",
        group: "User Management",
        description: "Payments & transactions"
    },
    {
        label: "Member Status",
        icon: FaIdBadge,
        href: "/admin/members/status",
        group: "User Management",
        description: "Membership status overview"
    },
];

// Section: Content Management
const contentLinks: NavLink[] = [
    // Events & Forum NOW come after Member Status
    {
        label: "Events",
        icon: FaCalendarAlt,
        href: "/admin/events",
        group: "Content",
        subcategory: "Activities",
        description: "All association events"
    },
    {
        label: "Forum",
        icon: FaComments,
        href: "/admin/forum",
        group: "Content",
        subcategory: "Community",
        description: "Discussion board"
    },
];

// Section: Publications & News
const publicationsDropdownLinks: NavLink[] = [
    {
        label: "All Publications",
        icon: FaSearch,
        href: "/admin/publications/all-publications",
        group: "Publications",
        description: "All publications"
    },
    {
        label: "My Publications",
        icon: FaBook,
        href: "/admin/publications",
        group: "Publications",
        description: "My publications"
    },
    {
        label: "Create Publication",
        icon: FaPlusSquare,
        href: "/admin/publications/new",
        group: "Publications",
        description: "Add a new publication"
    },
];

const newsDropdownLinks: NavLink[] = [
    {
        label: "All News",
        icon: FaSearch,
        href: "/admin/news",
        group: "News",
        description: "All news"
    },
    {
        label: "Create News",
        icon: FaPlusSquare,
        href: "/admin/news/new",
        group: "News",
        description: "Create news"
    },
];

// Combine tabs for mobile bottom nav
const organizePublicationTabsForMobile = (list: NavLink[]) => [
    ...list.filter(l => l.group === "Publications"),
    ...list.filter(l => l.group === "News"),
];
const publicationsDropdownLinksMobile: NavLink[] = organizePublicationTabsForMobile([
    ...publicationsDropdownLinks,
    ...newsDropdownLinks
]);

// Section: System/Utility/Secondary (Settings removed)
const navLinksSecondary: NavLink[] = [
    // Add more utility links as needed...
];

// PROFILE/USER
function UserAvatar({ user }: { user: { name?: string, email?: string, avatarUrl?: string } }) {
    return (
        <div className="flex items-center gap-3 px-3 py-3">
            <Image
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-[#bbc9dc] object-cover"
                style={{ background: "#eaf0f7" }}
                priority
            />
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[14px] font-semibold text-[#16355D] truncate">{user.name ?? "-"}</span>
                <span className="text-xs text-[#8094bb] truncate">{user.email ?? ""}</span>
            </div>
        </div>
    );
}

// NAV ITEM (unchanged)
type NavItemProps = {
    icon: React.ElementType;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    ariaExpanded?: boolean;
    asButton?: boolean;
    hideLabelOnMobile?: boolean;
    description?: string;
};

function NavItem({
    icon: Icon,
    label,
    href,
    active = false,
    onClick,
    children,
    ariaExpanded,
    asButton = false,
    hideLabelOnMobile = false,
    description
}: NavItemProps) {
    const labelClass = hideLabelOnMobile ? "hidden sm:inline" : "inline";
    const baseClass =
        "sidebar-navitem flex items-center w-full px-5 py-2.5 rounded-lg text-[15px] font-medium gap-3 mb-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary";
    const activeClass =
        "sidebar-navitem-active text-primary bg-[#e5effa] border-l-4 border-primary font-bold";
    const hoverInactive =
        "hover:bg-[#edf3fa] text-[#1a2332]";
    const iconActive = "animated-sidebar-icon text-primary";
    const iconInactive = "animated-sidebar-icon text-[#96a3b9]";

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
                    style={active ? { color: "var(--color-primary)", fontWeight: 700 } : undefined}
                >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? iconActive : iconInactive}`} style={active ? { color: "var(--color-primary)" } : undefined} />
                    <span className={`flex-1 text-left ${labelClass}`}>{label}</span>
                    {description && (
                        <span className="ml-auto text-xs text-[#a4adc3] font-normal">{description}</span>
                    )}
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
            <Icon className={`w-5 h-5 flex-shrink-0 ${active ? iconActive : iconInactive}`} style={active ? { color: "var(--color-primary)" } : undefined} />
            <span className={labelClass}>{label}</span>
            {description && (
                <span className="ml-auto text-xs text-[#a4adc3] font-normal">{description}</span>
            )}
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
                    style={active ? { color: "var(--color-primary)", fontWeight: 700 } : undefined}
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
                style={active ? { color: "var(--color-primary)", fontWeight: 700 } : undefined}
            >
                {content}
            </button>
        </li>
    );
}

// Publications Dropdown for Sidebar (desktop)
function PublicationsDropdown({ pathname }: { pathname: string | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Determine if any child tab is active
    const isChildActive = publicationsDropdownLinks.some(
        (link) => pathname === link.href || (link.href && pathname?.startsWith(link.href))
    );

    useEffect(() => { setOpen(false); }, [pathname]);

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLUListElement>) => {
        if (
            dropdownRef.current &&
            e.relatedTarget &&
            !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
            setOpen(false);
        }
    };

    const labelClass = "hidden sm:inline";
    const publicationTabs = [
        ...publicationsDropdownLinks.filter(l => l.group === "Publications" && l.label !== "Create Publication"),
        ...publicationsDropdownLinks.filter(l => l.label === "Create Publication"),
    ];

    return (
        <NavItem
            icon={FaSearch}
            label="Publications"
            active={isChildActive}
            asButton
            ariaExpanded={open}
            onClick={() => setOpen(v => !v)}
        >
            <ul
                ref={dropdownRef}
                onBlur={handleBlur}
                className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-40 bg-[#f5f8fa] border-2 border-[#b8d2f0] rounded mt-1 ml-3 mr-3 py-1 sm:min-w-[208px] max-w-xs`}
                tabIndex={-1}
                role="menu"
                aria-label="News & Publications submenu"
                style={{ boxShadow: "none" }}
            >
                {publicationTabs.map((sublink, idx) => {
                    const isActive = pathname === sublink.href;
                    const isCreate = sublink.label === "Create Publication";
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            {isCreate && (
                                <div className="border-t border-[#e5edfa] my-1" />
                            )}
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2 rounded text-[15px] font-medium transition-colors hover:bg-[#eaf3fd] ${isActive ? "font-bold bg-[#def0fc] text-primary border-l-4 border-primary" : "text-[#243050]"
                                    }`}
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => setOpen(false)}
                                style={isActive ? { color: "var(--color-primary)" } : undefined}
                            >
                                <sublink.icon className={`w-4 h-4 flex-shrink-0 animated-dropdown-icon${isActive ? " text-primary" : " text-[#7d8daa]"}`
                                } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                <span className={labelClass}>{sublink.label}</span>
                                {sublink.description && (
                                    <span className="ml-auto text-xs text-[#9ca9c7] hidden sm:inline">{sublink.description}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

function NewsDropdown({ pathname }: { pathname: string | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const isChildActive = newsDropdownLinks.some(
        (link) => pathname === link.href || (link.href && pathname?.startsWith(link.href))
    );

    useEffect(() => { setOpen(false); }, [pathname]);

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLUListElement>) => {
        if (
            dropdownRef.current &&
            e.relatedTarget &&
            !dropdownRef.current.contains(e.relatedTarget as Node)
        ) {
            setOpen(false);
        }
    };

    const labelClass = "hidden sm:inline";
    const newsTabs = [
        ...newsDropdownLinks.filter(l => l.group === "News" && l.label !== "Create News"),
        ...newsDropdownLinks.filter(l => l.label === "Create News"),
    ];

    return (
        <NavItem
            icon={FaSearch}
            label="News"
            active={isChildActive}
            asButton
            ariaExpanded={open}
            onClick={() => setOpen(v => !v)}
        >
            <ul
                ref={dropdownRef}
                onBlur={handleBlur}
                className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-40 bg-[#f5f8fa] border-2 border-[#b8d2f0] rounded mt-1 ml-3 mr-3 py-1 sm:min-w-[208px] max-w-xs`}
                tabIndex={-1}
                role="menu"
                aria-label="News"
                style={{ boxShadow: "none" }}
            >
                {newsTabs.map((sublink, idx) => {
                    const isActive = pathname === sublink.href;
                    const isCreate = sublink.label === "Create News";
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            {isCreate && (
                                <div className="border-t border-[#e5edfa] my-1" />
                            )}
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2 rounded text-[15px] font-medium transition-colors hover:bg-[#eaf3fd] ${isActive ? "font-bold bg-[#def0fc] text-primary border-l-4 border-primary" : "text-[#243050]"
                                    }`}
                                role="menuitem"
                                tabIndex={0}
                                onClick={() => setOpen(false)}
                                style={isActive ? { color: "var(--color-primary)" } : undefined}
                            >
                                <sublink.icon className={`w-4 h-4 flex-shrink-0 animated-dropdown-icon${isActive ? " text-primary" : " text-[#7d8daa]"}`
                                } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                <span className={labelClass}>{sublink.label}</span>
                                {sublink.description && (
                                    <span className="ml-auto text-xs text-[#9ca9c7] hidden sm:inline">{sublink.description}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

// BottomNavDropdown: mobile dropdown
function BottomNavDropdown({
    open,
    onClose,
    items,
    activeHref
}: {
    open: boolean;
    onClose: () => void;
    items: NavLink[];
    activeHref: string | null;
}) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function listener(e: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        }
        document.addEventListener("mousedown", listener);
        return () => document.removeEventListener("mousedown", listener);
    }, [open, onClose]);

    useEffect(() => {
        if (!open) return;
        function keyHandler(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", keyHandler);
        return () => window.removeEventListener("keydown", keyHandler);
    }, [open, onClose]);

    useEffect(() => {
        onClose();
    }, [activeHref]);

    if (!open) return null;
    const createTab = items.find(link => link.label === "Create Publication");
    const nonCreateTabs = items.filter(link => link.label !== "Create Publication");
    return (
        <div
            ref={dropdownRef}
            className="bottomnav-dropdown-panel"
            tabIndex={-1}
            aria-label="News & Publications submenu"
            style={{
                minWidth: '180px',
                maxWidth: '90vw',
                background: "#f7fafe",
                boxShadow: "none",
                border: "2px solid #c4d4e9",
            }}
        >
            {nonCreateTabs.map(link => {
                const isActive = activeHref === link.href;
                return (
                    <Link
                        key={link.label}
                        href={link.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-[#eaf3fd] ${isActive ? "font-bold bg-[#def0fc] text-primary border-l-4 border-primary" : "text-[#1e2535]"}`}
                        tabIndex={0}
                        style={isActive ? { color: "var(--color-primary)" } : undefined}
                    >
                        <link.icon className={`w-5 h-5 mr-2 animated-dropdown-icon${isActive ? " text-primary" : " text-[#7d8daa]"}`
                        } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                        <span className="bottomnav-label">{link.label}</span>
                        {link.description && (
                            <span className="ml-auto text-xs text-[#97aac9] hidden sm:inline">{link.description}</span>
                        )}
                    </Link>
                );
            })}
            {createTab && (
                <>
                    <div className="border-t border-[#e5edfa] my-1" />
                    <Link
                        key={createTab.label}
                        href={createTab.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-[#eaf3fd] ${activeHref === createTab.href ? "font-bold bg-[#def0fc] text-primary border-l-4 border-primary" : "text-[#1e2535]"
                            }`}
                        tabIndex={0}
                        style={activeHref === createTab.href ? { color: "var(--color-primary)" } : undefined}
                    >
                        <createTab.icon className={`w-5 h-5 mr-2 animated-dropdown-icon${activeHref === createTab.href ? " text-primary" : " text-[#7d8daa]"}`
                        } style={activeHref === createTab.href ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                        <span className="bottomnav-label">{createTab.label}</span>
                        {createTab.description && (
                            <span className="ml-auto text-xs text-[#97aac9] hidden sm:inline">{createTab.description}</span>
                        )}
                    </Link>
                </>
            )}
        </div>
    );
}

// Sidebar container (unchanged)
function SidebarContainer({
    SidebarContent
}: { SidebarContent: React.ReactNode }) {
    return (
        <div className="hidden sm:block sidebar-container">
            <aside className="sticky top-0 h-screen">
                {SidebarContent}
            </aside>
        </div>
    );
}

// Mobile Bottom Nav: Grouped/categorized for mobile
function MobileBottomNavBar({
    pathname,
    onSignOut
}: {
    pathname: string | null;
    onSignOut: () => void;
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Mobile order: show high priority sections first, group as admins expect
    const bottomTabs = [
        {
            key: "home",
            icon: FaHome,
            label: "Home",
            href: "/admin/dashboard"
        },
        {
            key: "publications",
            icon: FaBook,
            label: "Publications",
            dropdown: publicationsDropdownLinksMobile,
            iconDropdown: FaSearch
        },
        {
            key: "news",
            icon: FaChalkboardTeacher,
            label: "News",
            href: "/admin/news"
        },
        {
            key: "members",
            icon: FaUsers,
            label: "Members",
            href: "/admin/members"
        },
        {
            key: "payment-history",
            icon: FaMoneyCheckAlt,
            label: "Payment History",
            href: "/admin/members/payment-history"
        },
        {
            key: "member-status",
            icon: FaIdBadge,
            label: "Member Status",
            href: "/admin/members/status"
        },
        {
            key: "events",
            icon: FaCalendarAlt,
            label: "Events",
            href: "/admin/events"
        },
        {
            key: "forum",
            icon: FaComments,
            label: "Forum",
            href: "/admin/forum"
        },
    ];

    const isPubActive = publicationsDropdownLinksMobile.some(l =>
        l.href && (pathname === l.href || pathname?.startsWith(l.href))
    );

    // Only display needed tabs, no settings
    const visibleTabKeys = [
        "home", "publications", "news", "members", "payment-history", "member-status", "events", "forum"
    ];
    const filteredTabs = bottomTabs.filter(tab => visibleTabKeys.includes(tab.key));

    useEffect(() => {
        setDropdownOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                className="mobile-bottom-nav"
                style={{ marginTop: 24 }}
                role="navigation"
                aria-label="Mobile bottom navigation"
            >
                <ul>
                    {filteredTabs.map((tab, idx) => {
                        if (tab.dropdown) {
                            return (
                                <li key={tab.key} style={{ position: "relative", zIndex: dropdownOpen ? 100 : undefined }}>
                                    <button
                                        type="button"
                                        className={`bottomnav-item ${isPubActive ? "bottomnav-item-active" : ""}`}
                                        aria-haspopup="true"
                                        aria-expanded={dropdownOpen}
                                        aria-label="News & Publications"
                                        onClick={() => setDropdownOpen((v) => !v)}
                                        tabIndex={0}
                                        style={{
                                            position: "relative",
                                            zIndex: dropdownOpen ? 100 : undefined,
                                            color: isPubActive ? "var(--color-primary)" : undefined,
                                            fontWeight: isPubActive ? 700 : undefined
                                        }}
                                    >
                                        <tab.iconDropdown className={`animated-bottomnav-icon`} style={isPubActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                        <span className="bottomnav-label">{tab.label}</span>
                                    </button>
                                    <BottomNavDropdown
                                        open={dropdownOpen}
                                        onClose={() => setDropdownOpen(false)}
                                        items={tab.dropdown}
                                        activeHref={pathname}
                                    />
                                </li>
                            );
                        }
                        const isActive = pathname === tab.href || (tab.href && pathname?.startsWith(tab.href));
                        return (
                            <li key={tab.key}>
                                <Link
                                    href={tab.href ?? "#"}
                                    className={`bottomnav-item ${isActive ? "bottomnav-item-active" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                    tabIndex={0}
                                    aria-label={tab.label}
                                    onClick={() => setDropdownOpen(false)}
                                    style={{ color: isActive ? "var(--color-primary)" : undefined, fontWeight: isActive ? 700 : undefined }}
                                >
                                    <tab.icon className="animated-bottomnav-icon" style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                    <span className="bottomnav-label">{tab.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}

// Improved Sidebar with detailed/polished hierarchy and categorization
export function AdminSidebar() {
    const pathname = usePathname();
    const { user, loading, logout } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#FAFCFE] text-primary text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                Loading user...
            </div>
        );
    }

    const handleSignOut = useCallback(() => {
        if (typeof window !== "undefined" && window.confirm("Are you sure you want to sign out?")) {
            logout();
        }
    }, [logout]);

    // Helper rendering for group labels
    function GroupLabel({ label }: { label: string }) {
        return (
            <div className="mt-1.5 mb-1 px-7 uppercase text-[11px] tracking-wider font-semibold text-[#8694b3] pb-1">
                {label}
            </div>
        );
    }

    // Dashboard/Home group
    const navSectionDashboard = useMemo(() =>
        homeLinks.map(link => {
            const isActive = link.href ? pathname === link.href : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    description={link.description}
                    active={isActive}
                />
            );
        }), [pathname]);

    // User Management group
    const navSectionUserManagement = useMemo(() =>
        userManagementLinks.map(link => {
            const isActive = link.href ? pathname === link.href : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    description={link.description}
                    active={isActive}
                />
            );
        }), [pathname]);

    // Content section (Forum, Events, etc)
    const navSectionContent = useMemo(() =>
        contentLinks.map(link => {
            const isActive = link.href ? pathname === link.href : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    description={link.description}
                    active={isActive}
                />
            );
        }), [pathname]);

    // Publications/News: Use dropdowns (above defined)
    // System (secondary/utility)
    const navSectionUtility = useMemo(() =>
        navLinksSecondary.map(link => {
            const isActive = link.href ? pathname === link.href : false;
            return (
                <NavItem
                    key={link.label}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    description={link.description}
                    active={isActive}
                />
            );
        }), [pathname]);

    // Main structure
    const SidebarContent = (
        <>
            <style>{iconAnimationStyles}</style>
            <nav
                className={`
                  w-[76px] sm:w-[248px]
                  min-w-0 sm:min-w-[248px]
                  max-w-fit border-none
                  bg-[#f7f9fb]
                  h-screen flex flex-col justify-between shadow-none z-50
                  sidebar-mobile
                  sm:sticky sm:top-0
                  sidebar-container
                `}
                aria-label="Sidebar Navigation"
                role="navigation"
            >
                {/* TOP: Logo, org name, or branded section */}
                <header className="flex flex-col border-b-2 border-[#c2d8ed] pb-2 backdrop-blur-sm">
                    <div className="flex justify-between items-center px-4 pt-3 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                            <Link href="/" aria-label="Home" className="block shrink-0 focus:outline-none focus:ring-2 focus:ring-primary">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    width={65}
                                    height={40}
                                    className="h-10 w-auto object-contain"
                                    priority
                                />
                            </Link>
                            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-[#16355D] leading-tight truncate max-w-[120px] tracking-wide" style={{ textTransform: "uppercase", color: "#14203c" }}>
                                NAAPE, Nigeria association of aircraft pilots & engineers
                            </span>
                        </div>
                    </div>
                </header>
                {/* NAVIGATION SECTIONS */}
                <ul className="flex-1 w-full flex flex-col pt-3 px-0 pb-2 overflow-y-auto divide-y divide-[#e7eef5]">
                    {/* Dashboard */}
                    <li className="py-0">
                        <GroupLabel label="Dashboard" />
                        <ul className="flex flex-col">
                            {navSectionDashboard}
                        </ul>
                    </li>
                    {/* User Management */}
                    <li className="py-0">
                        <GroupLabel label="User Management" />
                        <ul className="flex flex-col">
                            {navSectionUserManagement}
                        </ul>
                    </li>
                    {/* Content Management */}
                    <li className="py-0">
                        <GroupLabel label="Content" />
                        <ul className="flex flex-col">
                            {/* Publications/news dropdowns placed first for visibility */}
                            <PublicationsDropdown pathname={pathname} />
                            <NewsDropdown pathname={pathname} />
                            {navSectionContent}
                        </ul>
                    </li>
                </ul>
                {/* SECONDARY/UTILITY */}
                <div className="border-t-2 border-[#c2d8ed] bg-transparent mt-1">
                    <ul className="flex flex-col py-2 px-0">
                        <GroupLabel label="System & Account" />
                        {navSectionUtility}
                        <NavItem
                            icon={FaSignOutAlt}
                            label="Sign Out"
                            onClick={handleSignOut}
                            aria-label="Sign out of your account"
                        />
                    </ul>
                </div>
                {/* User profile: visually separated, more contrast */}
                <footer className="w-full border-t-2 border-[#c2d8ed] bg-[#f0f5fc] mt-2">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <UserAvatar user={user ?? {}} />
                        <div className="hidden sm:flex flex-col min-w-0">
                            <span className="text-[15px] font-bold text-[#16355D] truncate">{user?.name || "Loading..."}</span>
                            <span className="text-xs text-[#7f97b5] truncate">{user?.email}</span>
                        </div>
                    </div>
                </footer>
            </nav>
        </>
    );

    return (
        <>
            {/* Desktop sidebar */}
            <SidebarContainer SidebarContent={SidebarContent} />
            {/* Mobile Bottom Nav */}
            <MobileBottomNavBar pathname={pathname} onSignOut={handleSignOut} />
        </>
    );
}