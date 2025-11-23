"use client";

import {
    FaHome,
    FaSearch,
    FaBook,
    FaPlusSquare,
    FaChalkboardTeacher,
    FaCalendarAlt,
    FaBriefcase,
    FaComments,
    FaCog,
    FaSignOutAlt,
    FaUsers
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";

// Use CSS vars for primary and secondary color from globals.css
const PRIMARY_COLOR = "oklch(0.32 0.13 266.81)";
const PRIMARY_COLOR_VAR = "var(--color-primary)";
const PRIMARY_COLOR_TEXT = "text-primary";
const PRIMARY_COLOR_TEXT_VAR = "var(--color-primary)";
const PRIMARY_COLOR_BG_VAR = "var(--color-primary)";
const PRIMARY_COLOR_BG = "bg-primary"; // tailwind support

const iconAnimationStyles = `
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
/* Mobile Bottom Nav bar */
@media (max-width: 639px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 58px;
    z-index: 50;
    background: #FAFCFE;
    border-top: 1px solid #E6EFFA;
    box-shadow: 0 0 6px 0 rgba(44,69,112,0.01), 0 -1px 0 0 #E6EFFA;
    margin-top: 24px; /* Added: top margin 24 on mobile */
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
    font-size: 11px; color: #203040;
    gap: 2px;
    text-align: center;
    font-weight: 500;
    min-width: 0; min-height: 0;
    height: 58px;
    padding: 0;
    background: transparent;
    border: none;
    outline: none;
    transition: background 0.15s;
    cursor: pointer;
  }
  .bottomnav-item .animated-bottomnav-icon {
    width: 22px;
    height: 22px;
    display: block;
    margin: 0 auto 1px auto;
    color: #8CA1B6;
    transition: color 0.2s;
  }
  .bottomnav-item-active {
    background: #E6F7FF;
    color: var(--color-primary);
    font-weight: 600;
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: var(--color-primary) !important;
  }
  .bottomnav-dropdown-panel {
    position: absolute;
    bottom: 62px;
    left: 8px; right: 8px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 6px 36px 0 rgba(23,40,120,0.10), 0 1.5px 0 0 #E6EFFA;
    border: 1px solid #E6EFFA;
    z-index: 51;
    padding: 3px 0;
    animation: dropdown-fadein 0.21s cubic-bezier(0.42,0,0.58,1);
  }
  @keyframes dropdown-fadein {
    0% { transform: translateY(16px); opacity: 0;}
    100% { transform: translateY(0); opacity: 1;}
  }
  .bottomnav-label {
    font-size: 11px;
    line-height: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
    margin-top: 0;
    transition: color 0.2s;
  }
  .sidebar-container,
  .mobile-topbar {
    display: none !important;
  }
}
/* Hide bottom nav on desktop */
@media (min-width: 640px) {
  .mobile-bottom-nav { display: none !important; }
}
`;

// Improved Auth types - rely on context (not hardcoded)
type NavLink = {
    label: string;
    icon: React.ElementType;
    href?: string;
    group?: string; // For grouping
    description?: string;
};

// Main navigation links, excludes 'Create Publication'
const navLinksMain: NavLink[] = [
    {
        label: "Overview",
        icon: FaHome,
        href: "/admin/dashboard"
    },
    {
        label: "Members",
        icon: FaUsers,
        href: "/admin/members"
    },
    {
        label: "Events",
        icon: FaCalendarAlt,
        href: "/admin/events"
    },
    {
        label: "Forum",
        icon: FaComments,
        href: "/admin/forum"
    }
];

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
        href: "/admin/publications/all-publications",
        group: "News",
        description: "All News"
    },

    {
        label: "Create News",
        icon: FaPlusSquare,
        href: "/admin/news/new",
        group: "Publications",
        description: "New news"
    },
];

const organizePublicationTabsForMobile = (list: NavLink[]) => {
    return [
        ...list.filter(l => l.group === "Publications"),
        ...list.filter(l => l.group === "News"),
    ];
};
// const newsTabsForMobile = (list: NavLink[]) => {
//     return [
//         ...list.filter(l => l.group === "News"),
//     ];
// };

const publicationsDropdownLinksMobile: NavLink[] = organizePublicationTabsForMobile([
    ...publicationsDropdownLinks,
    ...newsDropdownLinks
]);

const navLinksSecondary: NavLink[] = [
    {
        label: "Settings",
        icon: FaCog,
        href: "/admin/settings"
    }
];

// UserAvatar now expects full user object (from context)
function UserAvatar({ user }: { user: { name?: string, email?: string, avatarUrl?: string } }) {
    return (
        <div className="flex items-center gap-3 px-3 py-3">
            <Image
                src={user.avatarUrl || "/default-avatar.png"}
                alt={user.name || "User"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border border-[#D9E7F5] object-cover"
                priority
            />
            <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-sm font-semibold text-[#16355D] truncate">
                    {user.name ?? "-"}
                </span>
                <span className="text-xs text-[#96A6BF] truncate">
                    {user.email ?? ""}
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
    hideLabelOnMobile?: boolean;
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
    hideLabelOnMobile = false
}: NavItemProps) {
    // Use Tailwind primary color for ring and active by mapping to class or inline style
    const labelClass = hideLabelOnMobile ? "hidden sm:inline" : "inline";
    const baseClass =
        "sidebar-navitem flex items-center w-full px-5 py-2.5 rounded-lg text-sm font-medium gap-3 mb-0.5 transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary";
    const activeClass = "sidebar-navitem-active bg-[#D8F3FF] text-primary"; // (Background matches UI, text uses primary via CSS var)
    const hoverInactive = "hover:bg-[#F5F7FA] text-[#203040]";
    const iconActive = "animated-sidebar-icon text-primary";
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
                    style={active ? { color: "var(--color-primary)" } : undefined}
                >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${active ? iconActive : iconInactive}`} style={active ? { color: "var(--color-primary)" } : undefined} />
                    <span className={`flex-1 text-left ${labelClass}`}>{label}</span>
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
                    style={active ? { color: "var(--color-primary)" } : undefined}
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
                style={active ? { color: "var(--color-primary)" } : undefined}
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

    const labelClass = "hidden sm:inline";

    const publicationTabs = [
        ...publicationsDropdownLinks.filter(l => l.group === "Publications" && l.label !== "Create Publication"),
        ...publicationsDropdownLinks.filter(l => l.group === "News"),
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
                className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-40 bg-white border border-[#E6EFFA] rounded shadow mt-1 ml-3 mr-3 py-1 sm:min-w-[198px] max-w-xs`}
                tabIndex={-1}
                role="menu"
                aria-label="News & Publications submenu"
            >
                {publicationTabs.map((sublink, idx) => {
                    const isActive = pathname === sublink.href;
                    const isCreate = sublink.label === "Create Publication";
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            {isCreate && (
                                <div className="border-t border-[#E6EFFA] my-1" />
                            )}
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-[#F5F7FA] ${isActive ? "font-semibold bg-[#D8F3FF] text-primary" : "text-[#203040]"
                                    }`}
                                role="menuitem"
                                tabIndex={0}
                                // CLOSE dropdown panel on nav
                                onClick={() => setOpen(false)}
                                style={isActive ? { color: "var(--color-primary)" } : undefined}
                            >
                                <sublink.icon className={`w-4 h-4 flex-shrink-0 animated-dropdown-icon${isActive ? " text-primary" : " text-[#8CA1B6]"}`
                                } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                <span className={labelClass}>{sublink.label}</span>
                                {sublink.description && (
                                    <span className="ml-auto text-xs text-[#8CA1B6] hidden sm:inline">{sublink.description}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

// News Dropdown for Sidebar (desktop)
function NewsDropdown({ pathname }: { pathname: string | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

    // Determine if any child tab is active
    const isChildActive = newsDropdownLinks.some(
        (link) => pathname === link.href || (link.href && pathname?.startsWith(link.href))
    );

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

    const labelClass = "hidden sm:inline";

    const newsTabs = [
        ...newsDropdownLinks.filter(l => l.group === "News" && l.label !== "Create News"),
        ...newsDropdownLinks.filter(l => l.group === "News"),
        ...newsDropdownLinks.filter(l => l.label === "Create News"),
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
                className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-40 bg-white border border-[#E6EFFA] rounded shadow mt-1 ml-3 mr-3 py-1 sm:min-w-[198px] max-w-xs`}
                tabIndex={-1}
                role="menu"
                aria-label="News"
            >
                {newsTabs.map((sublink, idx) => {
                    const isActive = pathname === sublink.href;
                    const isCreate = sublink.label === "Create News";
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            {isCreate && (
                                <div className="border-t border-[#E6EFFA] my-1" />
                            )}
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors hover:bg-[#F5F7FA] ${isActive ? "font-semibold bg-[#D8F3FF] text-primary" : "text-[#203040]"
                                    }`}
                                role="menuitem"
                                tabIndex={0}
                                // CLOSE dropdown panel on nav
                                onClick={() => setOpen(false)}
                                style={isActive ? { color: "var(--color-primary)" } : undefined}
                            >
                                <sublink.icon className={`w-4 h-4 flex-shrink-0 animated-dropdown-icon${isActive ? " text-primary" : " text-[#8CA1B6]"}`
                                } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                                <span className={labelClass}>{sublink.label}</span>
                                {sublink.description && (
                                    <span className="ml-auto text-xs text-[#8CA1B6] hidden sm:inline">{sublink.description}</span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

// Mobile BottomNav Dropdown (bottom sheet style)
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

    // Also close dropdown if route (activeHref) changes
    useEffect(() => {
        onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                maxWidth: '90vw'
            }}
        >
            {nonCreateTabs.map(link => {
                const isActive = activeHref === link.href;
                return (
                    <Link
                        key={link.label}
                        href={link.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-[#F5F7FA] ${isActive ? "font-semibold bg-[#D8F3FF] text-primary" : "text-[#203040]"}`}
                        tabIndex={0}
                        style={isActive ? { color: "var(--color-primary)" } : undefined}
                    >
                        <link.icon className={`w-5 h-5 mr-2 animated-dropdown-icon${isActive ? " text-primary" : " text-[#8CA1B6]"}`
                        } style={isActive ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                        <span className="bottomnav-label">{link.label}</span>
                        {link.description && (
                            <span className="ml-auto text-xs text-[#8CA1B6] hidden sm:inline">{link.description}</span>
                        )}
                    </Link>
                );
            })}
            {createTab && (
                <>
                    <div className="border-t border-[#E6EFFA] my-1" />
                    <Link
                        key={createTab.label}
                        href={createTab.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-[#F5F7FA] ${activeHref === createTab.href ? "font-semibold bg-[#D8F3FF] text-primary" : "text-[#203040]"
                            }`}
                        tabIndex={0}
                        style={activeHref === createTab.href ? { color: "var(--color-primary)" } : undefined}
                    >
                        <createTab.icon className={`w-5 h-5 mr-2 animated-dropdown-icon${activeHref === createTab.href ? " text-primary" : " text-[#8CA1B6]"}`
                        } style={activeHref === createTab.href ? { color: "var(--color-primary)" } : undefined} aria-hidden="true" />
                        <span className="bottomnav-label">{createTab.label}</span>
                        {createTab.description && (
                            <span className="ml-auto text-xs text-[#8CA1B6] hidden sm:inline">{createTab.description}</span>
                        )}
                    </Link>
                </>
            )}
        </div>
    );
}

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

function MobileBottomNavBar({
    pathname,
    onSignOut
}: {
    pathname: string | null;
    onSignOut: () => void;
}) {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Only these tabs on mobile: Home, Publications (dropdown with create), Events, Forum, Training
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
        // {
        //     key: "training",
        //     icon: FaChalkboardTeacher,
        //     label: "Training",
        //     href: "/admin/training"
        // },
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
        }
    ];

    const isPubActive = publicationsDropdownLinksMobile.some(l =>
        l.href && (pathname === l.href || pathname?.startsWith(l.href))
    );
    // const isNewsActive = newsDropdownLinksMobile.some(l =>
    //     l.href && (pathname === l.href || pathname?.startsWith(l.href))
    // );

    const visibleTabKeys = ["home", "publications", "news", "events", "forum", "training"];
    const filteredTabs = bottomTabs.filter(tab => visibleTabKeys.includes(tab.key));

    // Always render all navitems; we do not hide any when dropdown is open
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
                                            boxShadow: dropdownOpen ? "0 4px 24px 0 rgba(44,69,112,0.09)" : undefined,
                                            position: "relative",
                                            zIndex: dropdownOpen ? 100 : undefined,
                                            color: isPubActive ? "var(--color-primary)" : undefined
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
                                    style={isActive ? { color: "var(--color-primary)" } : undefined}
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

export function AdminSidebar() {
    const pathname = usePathname();
    const { user, loading, logout, isAuthenticated } = useAuth();

    // Improved authentication: block access unless user is authenticated (safe fallback UI)
    if (loading) {
        return (
            <>
                <div className="flex items-center justify-center h-screen bg-white text-primary text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                    Loading user...
                </div>
            </>
        );
    }

    

    const handleSignOut = useCallback(() => {
        if (typeof window !== "undefined" && window.confirm("Are you sure you want to sign out?")) {
            logout();
        }
    }, [logout]);

    const navItemsMain = useMemo(() =>
        navLinksMain.map((link, idx) => {
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
        }),
        [pathname]
    );

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

    // Sidebar content for desktop only
    const SidebarContent = (
        <>
            <style>{iconAnimationStyles}</style>
            <nav
                className={`
                  w-[76px] sm:w-[228px]
                  min-w-0 sm:min-w-[228px]
                  max-w-fit border-none
                  bg-[#FAFCFE]
                  h-screen flex flex-col justify-between shadow-none z-50
                  sidebar-mobile
                  sm:sticky sm:top-0
                  sidebar-container
                `}
                aria-label="Sidebar Navigation"
                role="navigation"
            >
                {/* Logo and collapse/mobile close button */}
                <header className="flex flex-col border-b border-[#E6EFFA] pb-2">
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
                            <span className="hidden sm:inline-block ml-2 text-xs font-semibold text-[#16355D] leading-tight truncate max-w-[114px]">
                                NAAPE, Nigeria association of aircraft pilots & engineers
                            </span>
                        </div>
                        {/* Desktop: collapse/expand sidebar button placeholder (disabled for now) */}
                        <button
                            type="button"
                            aria-label="Collapse sidebar (not yet implemented)"
                            className="ml-1 sm:flex hidden items-center justify-center rounded-md hover:bg-[#E5F0FB] transition-colors p-[5px] focus:outline-none focus:ring-2 focus:ring-primary"
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
                    {/* Improved News & Publications Dropdown with close on nav */}
                    <PublicationsDropdown pathname={pathname} />
                    {/* rest; do NOT render standalone Create Publication navitem */}
                    {navItemsMain.slice(1)}
                </ul>
                <div className="border-t border-[#E6EFFA] bg-transparent">
                    <ul className="flex flex-col py-2 px-0">
                        {navItemsSecondary}
                        <NavItem
                            icon={FaSignOutAlt}
                            label="Sign Out"
                            onClick={handleSignOut}
                            aria-label="Sign out of your account"
                        />
                    </ul>
                </div>
                {/* User Profile Footer */}
                <footer className="w-full border-t border-[#E6EFFA] bg-[#F6FAFF]">
                    <div className="flex items-center gap-3 px-4 py-3">
                        {/* Show avatar always, details on sm+ */}
                        <UserAvatar user={user ?? {}} />
                        <div className="hidden sm:flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-[#16355D] truncate">{user?.name || "Loading..."}</span>
                            <span className="text-xs text-[#768EA6] truncate">{user?.email}</span>
                        </div>
                    </div>
                </footer>
            </nav>
        </>
    );

    return (
        <>
            <style>{iconAnimationStyles}</style>
            {/* Desktop sidebar */}
            <SidebarContainer SidebarContent={SidebarContent} />
            {/* Mobile Bottom Nav */}
            <MobileBottomNavBar pathname={pathname} onSignOut={handleSignOut} />
        </>
    );
}