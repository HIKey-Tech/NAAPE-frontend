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
import { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";


// UI IMPROVEMENTS: softer palette, modern neumorphic shadows, larger icons/buttons, improved hover/focus
const PRIMARY_COLOR = "#17447b";
const PRIMARY_COLOR_LIGHT_BG = "#eaf3fb";
const PRIMARY_COLOR_LIGHT_RING = "#bfdcf8";
const PRIMARY_GRADIENT = "linear-gradient(90deg, #16457a, #3573c8)";
const SIDEBAR_BG = "#f7fafc";
const SIDEBAR_CARD_BG = "#fff";
const TEXT_COLOR = "#203040";
const ICON_INACTIVE = "#9cb4cc";
const ICON_BORDER = "#e3ecf5";
const PROFILE_NAME = "#143967";
const PROFILE_EMAIL = "#7a8fa5";
const SHADOW = "0 3px 20px 0 rgba(23,47,100,0.07)";
const RADIUS = "18px";

// Enhanced style block (sidebar "glass" look, hover, transitions)
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
  transition: color 0.25s, background 0.22s, box-shadow 0.22s;
}
.sidebar-navitem:hover,
.sidebar-navitem:focus {
  background: ${PRIMARY_COLOR_LIGHT_BG};
  box-shadow: 0 2px 16px 0 rgba(22, 69, 122, 0.04);
}
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon,
.bottomnav-item:hover .animated-bottomnav-icon,
.bottomnav-item:focus .animated-bottomnav-icon {
  animation: icon-bounce 0.5s;
  color: ${PRIMARY_COLOR} !important;
  background: rgba(22, 69, 122, 0.07);
}
.sidebar-navitem-active, .bottomnav-item-active {
  background: ${PRIMARY_COLOR_LIGHT_BG};
  font-weight: 600;
  color: ${PRIMARY_COLOR} !important;
  box-shadow: 0 6px 36px 0 rgba(25, 40, 90, 0.06);
}
.sidebar-navitem-active .animated-sidebar-icon,
.bottomnav-item-active .animated-bottomnav-icon {
  animation: icon-bounce 0.7s;
  color: ${PRIMARY_COLOR} !important;
  filter: drop-shadow(0 1.5px 7px #d2e4f7);
}
.dropdown-navitem:hover,
.dropdown-navitem:focus {
  background: #f0f5fb;
}
.dropdown-navitem:hover .animated-dropdown-icon,
.dropdown-navitem:focus .animated-dropdown-icon {
  animation: icon-bounce 0.5s;
  color: ${PRIMARY_COLOR} !important;
}
.dropdown-active .animated-dropdown-icon {
  animation: icon-bounce 0.7s;
  color: ${PRIMARY_COLOR} !important;
}
/* NEUMORPHIC CARD */
.sidebar-card {
  background: ${SIDEBAR_CARD_BG};
  box-shadow: ${SHADOW};
  border-radius: ${RADIUS};
  border: 1.5px solid #e4eefb;
}
.sidebar-card > *:first-child { border-top-left-radius: ${RADIUS}; border-top-right-radius: ${RADIUS}; }
.sidebar-card > *:last-child { border-bottom-left-radius: ${RADIUS}; border-bottom-right-radius: ${RADIUS}; }
::-webkit-scrollbar-thumb { background: #e8eef7; border-radius: 6px;}
::-webkit-scrollbar { width: 8px; background: transparent;}
/* Mobile Bottom Nav bar UI improvements */
@media (max-width: 639px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 62px;
    z-index: 51;
    background: rgba(255,255,255,0.98);
    border-top: 1px solid ${ICON_BORDER};
    box-shadow: 0 0 28px 0 rgba(44,69,112,.07), 0 -2px 0 0 ${ICON_BORDER};
    backdrop-filter: blur(2.5px);
    margin-top: 28px;
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
    font-size: 12px;
    color: ${TEXT_COLOR};
    gap: 5px;
    text-align: center;
    transition: background 0.18s, box-shadow 0.15s;
    min-width: 0; min-height: 0;
    height: 62px;
    font-weight: 500;
    border-radius: 16px 16px 0 0;
    margin: 0 0.5px;
    cursor: pointer;
    border: none;
    outline: none;
  }
  .bottomnav-item .animated-bottomnav-icon {
    width: 25px;
    height: 25px;
    display: block;
    margin: 0 auto 1.5px auto;
    color: ${ICON_INACTIVE};
    transition: color 0.2s, box-shadow 0.14s, background 0.14s;
    background: none;
    border-radius: 50%;
  }
  .bottomnav-item-active {
    background: linear-gradient(90deg, #eaf3fb 0, #e7eafc 100%);
    color: ${PRIMARY_COLOR};
    font-weight: 600;
    box-shadow: 0 0 12px 0 rgba(46,100,230,0.07), 0 -1px 0 0 #b8d1ee;
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: ${PRIMARY_COLOR} !important;
    background: rgba(22,69,122,0.08);
  }
  .bottomnav-dropdown-panel {
    position: absolute;
    bottom: 67px;
    left: 10px; right: 10px;
    background: #fafbfd;
    border-radius: 13px;
    box-shadow: 0 6px 32px 0 rgba(23,40,120,0.14), 0 1.5px 0 0 ${ICON_BORDER};
    border: 1.5px solid ${ICON_BORDER};
    z-index: 52;
    padding: 7px 0;
    animation: dropdown-fadein 0.2s cubic-bezier(0.42,0,0.58,1);
    backdrop-filter: blur(2px);
  }
  @keyframes dropdown-fadein {
    0% { transform: translateY(22px); opacity: 0;}
    100% { transform: translateY(0); opacity: 1;}
  }
  .bottomnav-label {
    font-size: 12px;
    font-weight: 600;
    transition: color 0.18s;
    letter-spacing: 0.03em;
  }
  .sidebar-container,
  .mobile-topbar {
    display: none !important;
  }
}
@media (min-width: 640px) {
  .mobile-bottom-nav { display: none !important; }
}
`;

type User = {
    name: string;
    email: string;
    avatarUrl?: string;
};

type NavLink = {
    label: string;
    icon: React.ElementType;
    href?: string;
    group?: string;
    description?: string;
};

// Navigation Definitions
const navLinksMain: NavLink[] = [
    {
        label: "Home",
        icon: FaHome,
        href: "/dashboard",
    },
    {
        label: "Training & Certifications",
        icon: FaChalkboardTeacher,
        href: "/training",
    },
    {
        label: "Events",
        icon: FaCalendarAlt,
        href: "/events",
    },
    {
        label: "Forum",
        icon: FaComments,
        href: "/forum",
    },
];

const publicationsDropdownLinks: NavLink[] = [
    {
        label: "All Publications",
        icon: FaBook,
        href: "/publications",
        group: "Publications",
        description: "Browse all publications",
    },
    {
        label: "Create Publication",
        icon: FaPlusSquare,
        href: "/publications/new",
        group: "Publications",
        description: "Add a new publication",
    },
    {
        label: "News",
        icon: FaNewspaper,
        href: "/news",
        group: "News",
        description: "Latest news updates",
    },
];

const organizePublicationTabsForMobile = (list: NavLink[]) => {
    return [
        ...list.filter(l => l.group === "Publications"),
        ...list.filter(l => l.group === "News"),
    ];
};
const publicationsDropdownLinksMobile: NavLink[] = organizePublicationTabsForMobile(publicationsDropdownLinks);

const navLinksSecondary: NavLink[] = [
    // {
    //     label: "Settings",
    //     icon: FaCog,
    //     href: "/settings",
    // },
];

// Profile Card - enhanced: larger avatar, round, subtle shadow, status indicator
function SidebarProfileCard({ user }: { user: User }) {
    return (
        <div className="flex items-center gap-4 px-5 py-3 min-w-0" style={{ paddingTop: 18, paddingBottom: 18 }}>
            <div className="relative">
                <div
                    className="flex items-center justify-center rounded-full border-2 border-[#dbe7f8] shadow-md object-cover select-none"
                    style={{
                        width: 42,
                        height: 42,
                        boxShadow: "0 4px 20px 0 rgba(23,40,100,0.14)",
                        background: "#e9f2fa",
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#285694",
                        textTransform: "uppercase",
                        letterSpacing: "0.01em",
                        userSelect: "none"
                    }}
                    aria-label={user.name}
                >
                    {user.name
                        .trim()
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0] || '')
                        .slice(0, 2)
                        .join('')}
                </div>
                <span
                    style={{
                        position: "absolute",
                        right: -3,
                        bottom: -2,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: "#10c554",
                        border: "2px solid white",
                        boxShadow: "0 1px 3px rgba(23,40,100,0.12)"
                    }}
                    aria-label="online"
                />
            </div>
            <div className="flex flex-col min-w-0" style={{ lineHeight: "1.17" }}>
                <span className="truncate text-[16px] font-semibold" style={{ color: PROFILE_NAME }}>{user.name}</span>
                <span className="truncate text-xs" style={{ color: PROFILE_EMAIL }}>{user.email}</span>
            </div>
        </div>
    );
}

// NavItem: now uses neumorphic highlight, smoother icon, hover, and big clickable surface
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
    const labelClass = hideLabelOnMobile
        ? "hidden sm:inline"
        : "inline";
    const baseClass =
        `sidebar-navitem flex items-center w-full px-6 py-3 rounded-lg text-base font-medium gap-4 mb-1 transition-all duration-150 whitespace-nowrap focus:outline-none focus:ring-2`;
    const focusRing = `focus:ring-[${PRIMARY_COLOR}]`;
    const activeClass = `sidebar-navitem-active bg-[${PRIMARY_COLOR_LIGHT_BG}] text-[${PRIMARY_COLOR}] shadow`;
    const hoverInactive = `hover:bg-[#f4f8fd] hover:shadow text-[${TEXT_COLOR}] transition-all duration-150`;
    const iconActive = `animated-sidebar-icon text-[${PRIMARY_COLOR}] drop-shadow-[0_4px_18px_rgba(22,69,122,0.14)] scale-105`;
    const iconInactive = `animated-sidebar-icon text-[${ICON_INACTIVE}]`;
    const buttonRippleStyle = { transition: "box-shadow 0.14s, background 0.12s" };

    if (asButton) {
        return (
            <li className="relative">
                <button
                    type="button"
                    className={`${baseClass} ${focusRing} ${hoverInactive} ${active ? activeClass : ""}`}
                    tabIndex={0}
                    aria-haspopup={children ? "menu" : undefined}
                    aria-expanded={ariaExpanded}
                    onClick={onClick}
                    style={buttonRippleStyle}
                >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
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
            <Icon className={`w-6 h-6 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
            <span className={labelClass}>{label}</span>
        </>
    );

    if (href) {
        return (
            <li>
                <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`${baseClass} ${focusRing} ${active ? activeClass : hoverInactive}`}
                    tabIndex={0}
                    style={buttonRippleStyle}
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
                className={`${baseClass} ${focusRing} ${hoverInactive} ${active ? activeClass : ""}`}
                onClick={onClick}
                tabIndex={0}
                style={buttonRippleStyle}
            >
                {content}
            </button>
        </li>
    );
}

// Publications Dropdown for Sidebar (desktop) - larger, glass effect, easier menu surfacing
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
            label="News & Publications"
            active={isChildActive}
            asButton
            ariaExpanded={open}
            onClick={() => setOpen(v => !v)}
        >
            <ul
                ref={dropdownRef}
                onBlur={handleBlur}
                className={`${open ? "block" : "hidden"} absolute left-1 right-1 top-full z-50 bg-[#f9fbfe] border border-[${ICON_BORDER}] rounded-xl shadow-lg mt-2 py-2 sm:min-w-[230px] max-w-xs transition-all duration-100`}
                tabIndex={-1}
                role="menu"
                aria-label="News & Publications submenu"
                style={{ boxShadow: SHADOW, borderRadius: "13px", minWidth: 190, background: "#fafdff" }}
            >
                {publicationTabs.map((sublink, idx) => {
                    const isActive = pathname === sublink.href;
                    const isCreate = sublink.label === "Create Publication";
                    return (
                        <li key={sublink.label} className={`dropdown-navitem${isActive ? " dropdown-active" : ""}`}>
                            {isCreate && (
                                <div className="border-t border-[${ICON_BORDER}] my-1" />
                            )}
                            <Link
                                href={sublink.href ?? "#"}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] font-medium transition-all duration-150 hover:bg-[#f3f7fa] ${isActive
                                    ? `text-[${PRIMARY_COLOR}] font-semibold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                                    : `text-[${TEXT_COLOR}]`
                                    }`}
                                role="menuitem"
                                tabIndex={0}
                                style={isActive
                                    ? { fontWeight: 600, boxShadow: "0 2px 14px 0 #d6e4f7" }
                                    : undefined}
                                onClick={() => setOpen(false)}
                            >
                                <sublink.icon className={`w-5 h-5 flex-shrink-0 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}]` : `text-[${ICON_INACTIVE}]`
                                    }`} aria-hidden="true" />
                                <span className={labelClass}>{sublink.label}</span>
                                {sublink.description && (
                                    <span className="ml-auto text-xs hidden sm:inline" style={{ color: ICON_INACTIVE }}>
                                        {sublink.description}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </NavItem>
    );
}

// Mobile BottomNav Dropdown (modern sheet style)
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
                minWidth: '190px',
                maxWidth: '94vw',
                borderRadius: "14px",
                boxShadow: "0 10px 31px 0 rgba(23,40,120,.17)",
            }}
        >
            {nonCreateTabs.map(link => {
                const isActive = activeHref === link.href;
                return (
                    <Link
                        key={link.label}
                        href={link.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-120 hover:bg-[#f4f8fa] ${isActive
                            ? `text-[${PRIMARY_COLOR}] font-semibold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                            : `text-[${TEXT_COLOR}]`
                            }`}
                        tabIndex={0}
                        style={isActive
                            ? { fontWeight: 600, boxShadow: "0 1.5px 11px #d3e7fb" }
                            : undefined}
                    >
                        <link.icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}]` : `text-[${ICON_INACTIVE}]`
                            }`} aria-hidden="true" />
                        <span className="bottomnav-label">{link.label}</span>
                        {link.description && (
                            <span className="ml-auto text-xs hidden sm:inline" style={{ color: ICON_INACTIVE }}>
                                {link.description}
                            </span>
                        )}
                    </Link>
                );
            })}
            {createTab && (
                <>
                    <div className="border-t" style={{ borderColor: ICON_BORDER, margin: '0.33rem 0' }} />
                    <Link
                        key={createTab.label}
                        href={createTab.href ?? "#"}
                        onClick={onClose}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-120 hover:bg-[#f4f8fa] ${activeHref === createTab.href
                            ? `text-[${PRIMARY_COLOR}] font-semibold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                            : `text-[${TEXT_COLOR}]`
                            }`}
                        tabIndex={0}
                        style={activeHref === createTab.href
                            ? { fontWeight: 600, boxShadow: "0 1.5px 11px #d3e7fb" }
                            : undefined}
                    >
                        <createTab.icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${activeHref === createTab.href ? `text-[${PRIMARY_COLOR}]` : `text-[${ICON_INACTIVE}]`
                            }`} aria-hidden="true" />
                        <span className="bottomnav-label">{createTab.label}</span>
                        {createTab.description && (
                            <span className="ml-auto text-xs hidden sm:inline" style={{ color: ICON_INACTIVE }}>
                                {createTab.description}
                            </span>
                        )}
                    </Link>
                </>
            )}
        </div>
    );
}

// Modern sidebar glassy container with neumorphism and backdrop
function SidebarContainer({
    SidebarContent
}: { SidebarContent: React.ReactNode }) {
    return (
        <div className="hidden sm:block sidebar-container sticky bg-gradient-to-b from-[#f7fbff] to-[#eef4fa] pt-2 h-full min-h-0">
            <aside className="sticky top-0 h-screen">{SidebarContent}</aside>
        </div>
    );
}

// Mobile: BottomAppBar more modern, round icons, color highlights
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
            href: "/dashboard"
        },
        {
            key: "publications",
            icon: FaBook,
            label: "Publications",
            dropdown: publicationsDropdownLinksMobile,
            iconDropdown: FaSearch
        },
        {
            key: "training",
            icon: FaChalkboardTeacher,
            label: "Training",
            href: "/training"
        },
        {
            key: "events",
            icon: FaCalendarAlt,
            label: "Events",
            href: "/events"
        },
        {
            key: "forum",
            icon: FaComments,
            label: "Forum",
            href: "/forum"
        }
    ];

    const isPubActive = publicationsDropdownLinksMobile.some(l =>
        l.href && (pathname === l.href || pathname?.startsWith(l.href))
    );

    const visibleTabKeys = ["home", "publications", "events", "forum", "training"];
    const filteredTabs = bottomTabs.filter(tab => visibleTabKeys.includes(tab.key));

    useEffect(() => {
        setDropdownOpen(false);
    }, [pathname]);

    return (
        <>
            <nav
                className="mobile-bottom-nav sticky"
                style={{ marginTop: 28 }}
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
                                            boxShadow: dropdownOpen ? "0 5px 20px 0 rgba(44,69,112,0.14)" : undefined,
                                            zIndex: dropdownOpen ? 100 : undefined,
                                            fontWeight: isPubActive ? 700 : 500,
                                        }}
                                    >
                                        <tab.iconDropdown className={`animated-bottomnav-icon`} aria-hidden="true" />
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
                            <li key={tab.key} >
                                <Link
                                    href={tab.href ?? "#"}
                                    className={`bottomnav-item p-2 ${isActive ? "bottomnav-item-active" : ""}`}
                                    aria-current={isActive ? "page" : undefined}
                                    tabIndex={0}
                                    aria-label={tab.label}
                                    onClick={() => setDropdownOpen(false)}
                                    style={{
                                        fontWeight: isActive ? 700 : 500,
                                    }}
                                >
                                    <tab.icon className="animated-bottomnav-icon" aria-hidden="true" />
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

// FINAL: Top-level AppSidebar including improved visual
export function AppSidebar() {
    const pathname = usePathname();
    const { logout, user } = useAuth();

    const handleSignOut = useCallback(() => {
        if (window.confirm("Are you sure you want to sign out?")) {
            toast.promise(
                (async () => {
                    await logout();
                })(),
                {
                    loading: "Signing out...",
                    success: "Signed out successfully.",
                    error: (err) =>
                        err?.message
                            ? `Failed to sign out: ${err.message}`
                            : "An error occurred signing out.",
                }
            );
        }
    }, [logout]);

    // Improved nav: bigger label, modern
    const navItemsMain = useMemo(
        () =>
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

    const navItemsSecondary = useMemo(
        () =>
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

    // Sidebar content for desktop: glass card, breathing/space
    const SidebarContent = (
        <>
            <style>{iconAnimationStyles}</style>
            <nav
                className={`
                  sidebar-card
                  w-[84px] sticky sm:w-[265px] max-w-[265px]
                  min-w-0 sm:min-w-[215px]
                  border-none h-screen
                  flex flex-col justify-between z-50
                  p-1.5 pb-2 pt-0
                  sidebar-mobile sm:sticky sm:top-0 sidebar-container
                `}
                aria-label="Sidebar Navigation"
                role="navigation"
                style={{
                    background: "linear-gradient(173deg,#fafdff 78%,#f1f5fb 100%)",
                    borderRadius: RADIUS,
                    boxShadow: SHADOW,
                    border: `1.6px solid ${ICON_BORDER}`,
                    minHeight: "99vh",
                    minWidth: 0,
                }}
            >
                {/* Logo & brand area */}
                <header className="flex flex-col py-2 px-3" style={{ borderBottom: `1.5px solid ${ICON_BORDER}` }}>
                    <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center  gap-3 min-w-0">
                            <Link href="/" aria-label="Home" className="block bg-white shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2259ae] rounded-lg">
                                <div
                                    style={{
                                        background: ``,
                                        borderRadius: "12px",
                                        border: "1.5px solid #e2ebf8",
                                        boxShadow: "0 2px 10px 0 rgba(26,48,118,0.044)",
                                        padding: 4,
                                    }}
                                >
                                    <Image
                                        src="/logo.png"
                                        alt="Logo"
                                        width={60}
                                        height={40}
                                        className="h-9 w-auto object-contain"
                                        priority
                                    />
                                </div>
                            </Link>
                            <span
                                className="hidden sm:inline-block ml-2 text-[13px] font-bold leading-tight truncate max-w-[128px]"
                                style={{
                                    color: PROFILE_NAME,
                                    letterSpacing: ".011em",
                                    fontWeight: 700,
                                }}
                            >
                                NAAPE, Nigeria association of aircraft pilots & engineers
                            </span>
                        </div>
                        {/* Desktop: collapse/expand sidebar - placeholder */}
                        <button
                            type="button"
                            aria-label="Collapse sidebar (not yet implemented)"
                            className="ml-1 sm:flex hidden items-center justify-center rounded-md transition-colors p-[5px] focus:outline-none focus:ring-2"
                            tabIndex={0}
                            style={{
                                border: "1.5px solid #d7e2ed",
                                background: "none",
                                color: ICON_INACTIVE,
                            }}
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
                <ul className="flex-1 w-full flex flex-col py-3 px-0 gap-0.5 overflow-y-auto" style={{ minHeight: 0 }}>
                    {/* Home */}
                    {navItemsMain[0]}
                    {/* News & Publications dropdown */}
                    <PublicationsDropdown pathname={pathname} />
                    {/* Additional section */}
                    {navItemsMain.slice(1)}
                </ul>
                <div style={{
                    background: "linear-gradient(90deg,#fafdff 0,#f2f7fd 100%)",
                    borderTop: `1.5px solid ${ICON_BORDER}`
                }}>
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
                <footer className="w-full" style={{
                    borderTop: `1.5px solid ${ICON_BORDER}`,
                    background: "#f6faff",
                    borderBottomLeftRadius: RADIUS,
                    borderBottomRightRadius: RADIUS,
                    marginTop: 10
                }}>
                    {user && <SidebarProfileCard user={user} />}
                </footer>
            </nav>
        </>
    );

    return (
        < div className="sticky">
            <style>{iconAnimationStyles}</style>
            {/* Desktop sidebar */}
            <SidebarContainer SidebarContent={SidebarContent} />
            {/* Mobile Bottom Nav */}
            <MobileBottomNavBar pathname={pathname} onSignOut={handleSignOut} />
        </div>
    );
}