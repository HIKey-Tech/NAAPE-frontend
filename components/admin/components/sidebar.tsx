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
    FaChalkboardTeacher,
    FaBars,
    FaTimes
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
    group?: string;
    description?: string;
    subcategory?: string;
};

const iconAnimationStyles = `
/* ... Existing styles ... */
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
  .sidebar-container { display: none !important; }
  .mobile-bottom-nav { display: none !important; }
  .mobile-topbar { display: flex !important; }
}
@media (min-width: 640px) {
  .mobile-topbar { display: none !important; }
}
`;

const homeLinks: NavLink[] = [
    {
        label: "Overview",
        icon: FaHome,
        href: "/admin/dashboard",
        group: "Dashboard",
        description: "Admin Home & Stats"
    },
];
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
const contentLinks: NavLink[] = [
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

const organizePublicationTabsForMobile = (list: NavLink[]) => [
    ...list.filter(l => l.group === "Publications"),
    ...list.filter(l => l.group === "News"),
];
const publicationsDropdownLinksMobile: NavLink[] = organizePublicationTabsForMobile([
    ...publicationsDropdownLinks,
    ...newsDropdownLinks
]);
const navLinksSecondary: NavLink[] = [
    // ...
];

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

function PublicationsDropdown({ pathname }: { pathname: string | null }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);

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

// HamburgerDrawer for mobile
function HamburgerDrawer({
    open,
    onClose,
    navSections,
    user,
    onSignOut
}: {
    open: boolean;
    onClose: () => void;
    navSections: React.ReactNode;
    user: any;
    onSignOut: () => void;
}) {
    // Trap scroll when sidebar is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    return (
        <>
            <div
                className={`fixed inset-0 z-[101] bg-black bg-opacity-20 transition-opacity duration-200 ${open ? 'block opacity-100' : 'pointer-events-none opacity-0'}`}
                aria-hidden="true"
                onClick={onClose}
                style={{ display: open ? "block" : "none" }}
            />
            <aside
                className={`
                  fixed top-0 left-0 h-full w-[82vw] max-w-xs z-[110]
                  bg-[#f7f9fb] border-r-2 border-[#c2d8ed]
                  shadow-2xl transition-transform duration-200
                  ${open ? "translate-x-0" : "-translate-x-full"}
                  flex flex-col
                `}
                style={{
                    transition: "transform 0.22s cubic-bezier(.8,0,0,1)"
                }}
                aria-label="Mobile Navigation"
                role="dialog"
                tabIndex={-1}
            >
                <div className="flex justify-between items-center px-4 pt-3 pb-2 border-b-2 border-[#c2d8ed]">
                    <Link href="/" aria-label="Home" className="block shrink-0 focus:outline-none focus:ring-2 focus:ring-primary">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={54}
                            height={32}
                            className="h-8 w-auto object-contain"
                            priority
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 ml-2 rounded hover:bg-[#e7eef5] focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <FaTimes size={22} />
                    </button>
                </div>
                <nav className="flex-1 overflow-y-auto pt-1 pb-3">
                    {navSections}
                </nav>
                {/* Account (sign out, profile, etc) */}
                <div className="border-t-2 border-[#c2d8ed] px-0 py-2 bg-[#f0f5fc]">
                    <ul className="flex flex-col gap-1">
                        <li>
                            <button
                                onClick={onSignOut}
                                className="sidebar-navitem flex items-center w-full px-5 py-2.5 rounded-lg text-[15px] font-medium gap-3 mb-0.5 text-[#c62027] hover:bg-[#f6eaea] transition-colors"
                                aria-label="Sign out of your account"
                            >
                                <FaSignOutAlt size={18} className="text-[#c62027]"/>
                                <span className="">Sign Out</span>
                            </button>
                        </li>
                    </ul>
                </div>
                <footer className="w-full border-t-2 border-[#c2d8ed] bg-[#f0f5fc]">
                    <div className="flex items-center gap-3 px-3 py-3">
                        <UserAvatar user={user ?? {}} />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[14px] font-bold text-[#16355D] truncate">{user?.name || "Loading..."}</span>
                            <span className="text-xs text-[#7f97b5] truncate">{user?.email}</span>
                        </div>
                    </div>
                </footer>
            </aside>
        </>
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

// MobileTopbarHamburger: Top app bar with hamburger menu for mobile
function MobileTopbarHamburger({
    navSections,
    user,
    onSignOut
}: {
    navSections: React.ReactNode;
    user: any;
    onSignOut: () => void;
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <header
            className="mobile-topbar flex items-center justify-between sm:hidden px-4 py-2 bg-[#f7f9fb] border-b-2 border-[#c2d8ed] sticky top-0 left-0 right-0 z-[120]"
            style={{ minHeight: "54px" }}
        >
            <div className="flex items-center gap-2 min-w-0">
                <button
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                    className="p-2 rounded hover:bg-[#e7eef5] focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <FaBars size={24} />
                </button>
                <Link href="/" aria-label="Home" className="shrink-0 focus:outline-none focus:ring-2 focus:ring-primary">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={30}
                        className="h-8 w-auto object-contain"
                        priority
                    />
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[12px] font-semibold text-[#16355D] leading-tight truncate max-w-[110px] tracking-wide" style={{ textTransform: "uppercase", color: "#14203c" }}>
                    NAAPE
                </span>
                <Image
                    src={user?.avatarUrl || "/default-avatar.png"}
                    alt="User"
                    width={31}
                    height={31}
                    className="w-8 h-8 rounded-full border-2 border-[#bbc9dc] object-cover"
                    style={{ background: "#eaf0f7" }}
                />
            </div>
            <HamburgerDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                navSections={navSections}
                user={user}
                onSignOut={onSignOut}
            />
            <style>{iconAnimationStyles}</style>
        </header>
    );
}

// GroupLabel helper reused for both views
function GroupLabel({ label }: { label: string }) {
    return (
        <div className="mt-1.5 mb-1 px-7 uppercase text-[11px] tracking-wider font-semibold text-[#8694b3] pb-1">
            {label}
        </div>
    );
}

// MobileNavSections: The full navigation structure for the hamburger drawer
function MobileNavSections({ pathname }: { pathname: string | null }) {
    return (
        <ul className="flex flex-col py-2 px-0 gap-2">
            {/* Dashboard */}
            <li>
                <GroupLabel label="Dashboard" />
                <ul className="flex flex-col">
                    {homeLinks.map(link => (
                        <NavItem
                            key={link.label}
                            icon={link.icon}
                            label={link.label}
                            href={link.href}
                            description={link.description}
                            active={pathname === link.href}
                        />
                    ))}
                </ul>
            </li>
            <li>
                <GroupLabel label="User Management" />
                <ul className="flex flex-col">
                    {userManagementLinks.map(link => (
                        <NavItem
                            key={link.label}
                            icon={link.icon}
                            label={link.label}
                            href={link.href}
                            description={link.description}
                            active={pathname === link.href}
                        />
                    ))}
                </ul>
            </li>
            <li>
                <GroupLabel label="Content" />
                <ul className="flex flex-col">
                    <NavItem
                        icon={FaSearch}
                        label="Publications"
                        href="/admin/publications/all-publications"
                        active={pathname?.startsWith("/admin/publications")}
                    />
                    <NavItem
                        icon={FaSearch}
                        label="News"
                        href="/admin/news"
                        active={pathname === "/admin/news"}
                    />
                    {contentLinks.map(link => (
                        <NavItem
                            key={link.label}
                            icon={link.icon}
                            label={link.label}
                            href={link.href}
                            description={link.description}
                            active={pathname === link.href}
                        />
                    ))}
                </ul>
            </li>
        </ul>
    );
}

// Main Sidebar (desktop) + Hamburger (mobile)
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

    // Desktop nav sections reused for desktop sidebar
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
        }), [pathname]
    );
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
        }), [pathname]
    );
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
        }), [pathname]
    );
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
        }), [pathname]
    );

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
                <ul className="flex-1 w-full flex flex-col pt-3 px-0 pb-2 overflow-y-auto divide-y divide-[#e7eef5]">
                    <li className="py-0">
                        <GroupLabel label="Dashboard" />
                        <ul className="flex flex-col">
                            {navSectionDashboard}
                        </ul>
                    </li>
                    <li className="py-0">
                        <GroupLabel label="User Management" />
                        <ul className="flex flex-col">
                            {navSectionUserManagement}
                        </ul>
                    </li>
                    <li className="py-0">
                        <GroupLabel label="Content" />
                        <ul className="flex flex-col">
                            <PublicationsDropdown pathname={pathname} />
                            <NewsDropdown pathname={pathname} />
                            {navSectionContent}
                        </ul>
                    </li>
                </ul>
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
            {/* Mobile Hamburger Topbar */}
            <MobileTopbarHamburger
                navSections={<MobileNavSections pathname={pathname} />}
                user={user}
                onSignOut={handleSignOut}
            />
        </>
    );
}