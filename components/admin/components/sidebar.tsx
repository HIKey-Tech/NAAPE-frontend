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
    FaNewspaper,
    FaEnvelope,
    FaUsers,
    FaMoneyCheckAlt,
    FaIdBadge,
    FaCalendarAlt,
    FaComments,
    FaBook,
    FaPlusSquare,
    FaChalkboardTeacher,
    FaBars,
    FaTimes,
    FaCog
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { LogoutDialog } from "@/components/ui/logout-dialog";
import { EventsDropdown, EventSection } from "@/components/admin/events/AdminEventsLayout";
import { ForumDropdown, ForumSection } from "@/components/admin/forum/AdminForumLayout";

// --- Types ---
type NavLink = {
    label: string;
    icon: React.ElementType;
    href?: string;
    group?: string;
    subcategory?: string;
};

// --- Data ---
const homeLinks: NavLink[] = [
    { label: "Overview", icon: FaHome, href: "/admin/dashboard", group: "Dashboard" },
];

const userManagementLinks: NavLink[] = [
    { label: "Members", icon: FaUsers, href: "/admin/members", group: "User Management" },
    { label: "Payment History", icon: FaMoneyCheckAlt, href: "/admin/members/payment-history", group: "User Management" },
];

const contentLinks: NavLink[] = [
    { label: "Trainings", icon: FaChalkboardTeacher, href: "/admin/trainings", group: "Content" },
    { label: "Communications", icon: FaEnvelope, href: "/admin/communications", group: "Content" },
    { label: "Gallery", icon: FaSearch, href: "/admin/gallery", group: "Content" },
];

const publicationsDropdownLinks: NavLink[] = [
    { label: "Review Publications", icon: FaSearch, href: "/admin/publications", group: "Publications" },
    { label: "Create Publication", icon: FaPlusSquare, href: "/admin/publications/new", group: "Publications" },
];

const newsDropdownLinks: NavLink[] = [
    { label: "All News", icon: FaSearch, href: "/admin/news", group: "News" },
    { label: "Create News", icon: FaPlusSquare, href: "/admin/news/new", group: "News" },
];

const navLinksSecondary: NavLink[] = [];

// --- Components ---

function UserAvatar({ user }: { user: { name?: string, email?: string, avatarUrl?: string } }) {
    const getInitials = (name?: string) => {
        if (!name) return "U";
        const parts = name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0]?.toUpperCase() || "");
        return parts.length ? parts.join("") : "U";
    };

    const initials = getInitials(user.name);

    return (
        <div className="flex items-center gap-3 px-3 py-3 border-t border-slate-100 dark:border-slate-800/60 mt-2">
            {user.avatarUrl ? (
                <Image
                    src={user.avatarUrl}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                    priority
                />
            ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center shadow-sm">
                    <span className="text-white font-bold text-xs">{initials}</span>
                </div>
            )}
            <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user.name ?? "-"}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user.email ?? ""}</span>
            </div>
        </div>
    );
}

// Reusable styling for nav items
const navItemBase = "flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium gap-3 transition-all duration-200 group";
const navItemActive = "text-primary bg-primary/5 dark:bg-primary/10 font-bold shadow-sm ring-1 ring-black/5 dark:ring-white/5";
const navItemInactive = "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200";

type NavItemProps = {
    icon: React.ElementType;
    label: string;
    href?: string;
    active?: boolean;
    onClick?: () => void;
    children?: React.ReactNode;
    ariaExpanded?: boolean;
    asButton?: boolean;
    className?: string;
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
    className = ""
}: NavItemProps) {

    // Icon styling
    const iconClass = `w-5 h-5 flex-shrink-0 transition-colors duration-200 ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`;

    const content = (
        <>
            <Icon className={iconClass} />
            <span className="flex-1 text-left truncate">{label}</span>
            {children && (
                <svg
                    className={`ml-auto h-3 w-3 text-slate-400 transition-transform duration-200 ${ariaExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            )}
        </>
    );

    if (asButton) {
        return (
            <li className="mb-1">
                <button
                    type="button"
                    className={`${navItemBase} ${active ? navItemActive : navItemInactive} ${className}`}
                    aria-haspopup={children ? "menu" : undefined}
                    aria-expanded={ariaExpanded}
                    onClick={onClick}
                >
                    {content}
                </button>
                {children}
            </li>
        );
    }

    if (href) {
        return (
            <li className="mb-1">
                <Link
                    href={href}
                    className={`${navItemBase} ${active ? navItemActive : navItemInactive} ${className}`}
                >
                    {content}
                </Link>
            </li>
        );
    }

    // Default button behavior if no href
    return (
        <li className="mb-1">
            <button
                type="button"
                className={`${navItemBase} ${active ? navItemActive : navItemInactive} ${className}`}
                onClick={onClick}
            >
                {content}
            </button>
        </li>
    );
}

function GroupLabel({ label }: { label: string }) {
    return (
        <div className="mt-6 mb-2 px-4 text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {label}
        </div>
    );
}

// --- Dropdowns ---

function SimpleDropdown({
    label,
    icon,
    links,
    pathname
}: {
    label: string,
    icon: React.ElementType,
    links: NavLink[],
    pathname: string | null
}) {
    // Check if any child is active to auto-expand or highlight parent
    const isChildActive = links.some(link => pathname === link.href || (link.href && pathname?.startsWith(link.href)));
    const [open, setOpen] = useState(isChildActive);

    // Auto-close if path changes to something else, but keep open if child active
    useEffect(() => {
        if (!isChildActive) setOpen(false);
        else setOpen(true);
    }, [pathname, isChildActive]);

    return (
        <NavItem
            icon={icon}
            label={label}
            active={isChildActive}
            asButton
            ariaExpanded={open}
            onClick={() => setOpen(!open)}
        >
            {open && (
                <ul className="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 ml-6 animate-in slide-in-from-top-1 duration-200">
                    {links.map(link => {
                        const isActive = pathname === link.href;
                        return (
                            <li key={link.label}>
                                <Link
                                    href={link.href ?? "#"}
                                    className={`
                                        block px-3 py-2 rounded-md text-sm transition-colors
                                        ${isActive ? "text-primary font-bold bg-primary/5 dark:bg-primary/10" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"}
                                    `}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </NavItem>
    );
}

function PublicationsDropdown({ pathname }: { pathname: string | null }) {
    return <SimpleDropdown label="Publications" icon={FaSearch} links={publicationsDropdownLinks} pathname={pathname} />;
}

function NewsDropdown({ pathname }: { pathname: string | null }) {
    return <SimpleDropdown label="News" icon={FaSearch} links={newsDropdownLinks} pathname={pathname} />;
}

function UsersDropdown({ pathname }: { pathname: string | null }) {
    return <SimpleDropdown label="Users" icon={FaUsers} links={userManagementLinks} pathname={pathname} />;
}


// --- Main Layout Components ---

export function AdminSidebar() {
    const pathname = usePathname();
    const { user: authUser, loading, logout } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    // Events & Forum State
    const [activeEventSection, setActiveEventSection] = useState<EventSection>(EventSection.MANAGEMENT);
    const [activeForumSection, setActiveForumSection] = useState<ForumSection>(ForumSection.DASHBOARD);

    // Sync state with url
    useEffect(() => {
        if (!pathname) return;
        if (pathname.includes('/admin/events/payments')) setActiveEventSection(EventSection.PAYMENTS);
        else if (pathname.includes('/admin/events/attendees')) setActiveEventSection(EventSection.ATTENDEES);
        else if (pathname.includes('/admin/events/settings')) setActiveEventSection(EventSection.SETTINGS);
        else if (pathname.includes('/admin/events/communications')) setActiveEventSection(EventSection.COMMUNICATIONS);
        else if (pathname.includes('/admin/events')) setActiveEventSection(EventSection.MANAGEMENT);

        if (pathname.includes('/admin/forum/categories')) setActiveForumSection(ForumSection.CATEGORIES);
        else if (pathname.includes('/admin/forum/moderation')) setActiveForumSection(ForumSection.MODERATION);
        else if (pathname.includes('/admin/forum/users')) setActiveForumSection(ForumSection.USERS);
        else if (pathname.includes('/admin/forum/reports')) setActiveForumSection(ForumSection.REPORTS);
        else if (pathname.includes('/admin/forum/analytics')) setActiveForumSection(ForumSection.ANALYTICS);
        else if (pathname.includes('/admin/forum')) setActiveForumSection(ForumSection.DASHBOARD);
    }, [pathname]);

    const user = authUser ? {
        name: authUser.name,
        email: authUser.email,
        avatarUrl: authUser.profile?.image?.url,
    } : null;

    if (loading) return null;

    // Mobile specific
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = () => {
        setMobileOpen(false);
        setShowLogoutDialog(true);
    };
    const confirmLogout = () => {
        setShowLogoutDialog(false);
        logout();
    };

    const SidebarContent = (
        <div className="flex flex-col h-full bg-white dark:bg-[#0f121b] border-r border-slate-100 dark:border-slate-800/60 shadow-[2px_0_24px_-12px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-center sm:justify-start">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Image src="/logo.png" alt="NAAPE" width={40} height={40} className="relative z-10 object-contain w-10 h-10" priority />
                    </div>
                    <span className="hidden sm:block text-lg font-black text-slate-800 dark:text-slate-200 tracking-tight ml-2">NAAPE <span className="text-primary">Admin</span></span>
                </Link>
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
                <GroupLabel label="Dashboard" />
                {homeLinks.map(link => (
                    <NavItem
                        key={link.label}
                        {...link}
                        active={pathname === link.href}
                    />
                ))}

                <GroupLabel label="Management" />
                <UsersDropdown pathname={pathname} />

                <GroupLabel label="Content" />
                <PublicationsDropdown pathname={pathname} />
                <NewsDropdown pathname={pathname} />
                <EventsDropdown
                    pathname={pathname}
                    activeSection={activeEventSection}
                    onSectionChange={setActiveEventSection}
                />
                <ForumDropdown
                    pathname={pathname}
                    activeSection={activeForumSection}
                    onSectionChange={setActiveForumSection}
                />
                {contentLinks.map(link => (
                    <NavItem
                        key={link.label}
                        {...link}
                        active={pathname === link.href}
                    />
                ))}

                <GroupLabel label="System" />
                <NavItem
                    icon={FaCog}
                    label="Settings"
                    href="/admin/settings"
                    active={pathname === "/admin/settings"}
                />
                <NavItem
                    icon={FaSignOutAlt}
                    label="Sign Out"
                    onClick={handleSignOut}
                    asButton
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 mt-2"
                />
            </div>

            {/* Footer User */}
            {user && (
                <div className="p-4 bg-slate-50/50 dark:bg-[#0a0d14]/50">
                    <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar - Sticky */}
            <aside className="hidden sm:block w-[260px] h-screen sticky top-0 z-30 font-sans">
                {SidebarContent}
            </aside>

            {/* Mobile Sidebar - Drawer */}
            <div className="sm:hidden">
                {/* Mobile Toggle is likely in TopNavbar or a separate mobile header, but based on previous code, 
                     the sidebar itself handled the mobile hamburger rendering optionally. 
                     Since we have a TopNavbar, we should rely on that or a mobile trigger. 
                     The original code had `MobileTopbarHamburger`. We'll recreate a simple one here for mobile only. */}

                <div className="fixed top-0 left-0 w-full h-[60px] bg-white border-b border-slate-100 flex items-center px-4 z-50 justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setMobileOpen(true)} className="p-2 text-slate-600">
                            <FaBars size={20} />
                        </button>
                        <Image src="/logo.png" alt="Logo" width={32} height={32} />
                        <span className="font-bold text-slate-800">Admin</span>
                    </div>
                </div>

                {mobileOpen && (
                    <div className="fixed inset-0 z-[60]">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                        <div className="absolute top-0 left-0 h-full w-[80vw] max-w-[300px] bg-white shadow-2xl animate-in slide-in-from-left duration-200">
                            {SidebarContent}
                            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LogoutDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                onConfirm={confirmLogout}
            />
        </>
    );
}

// Ensure exports match original interface roughly so we don't break layout imports
export default AdminSidebar;