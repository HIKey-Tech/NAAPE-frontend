"use client";

import { FaRegCommentDots, FaRegBell } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import {
    useNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useDeleteNotification,
} from "@/hooks/useNotification";

/** Get initials: fallback if no name */
function getInitials(name: string | undefined) {
    if (!name) return "U";
    const parts = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || "");
    return parts.length ? parts.join("") : "U";
}

/** Human readable role name */
function getRoleLabel(role: string | undefined): string {
    if (!role) return "Loading";
    // Add more mappings as needed
    const normalized = role.trim().toLowerCase();
    if (normalized === "admin") return "Administrator";
    if (normalized === "user") return "User";
    if (normalized === "manager") return "Manager";
    // fallback to original with first letter uppercase
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

/** Avatar without shadow, visually centered */
function UserAvatar({
    src,
    alt,
    fallback,
    className = "",
    size = 40,
}: {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
    size?: number;
}) {
    const [imageLoaded, setImageLoaded] = useState(true);
    return (
        <span
            className={`relative flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {src && imageLoaded ? (
                <Image
                    src={src}
                    alt={alt || ""}
                    width={size}
                    height={size}
                    className="w-full h-full rounded-full object-cover border-2 border-blue-200 bg-white"
                    onError={() => setImageLoaded(false)}
                    priority
                />
            ) : (
                <span
                    className={`
                        w-full h-full flex items-center justify-center rounded-full
                        bg-gradient-to-tr from-blue-400 via-blue-100 to-pink-300
                        border-2 border-blue-300 text-[#143161] font-extrabold select-none
                        text-lg
                    `}
                    style={{ fontSize: size > 28 ? 18 : 16 }}
                    aria-label={alt}
                >
                    {fallback}
                </span>
            )}
            {/* Online indicator with higher contrast border */}
            <span className="absolute bottom-0.5 right-0.5 block w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-green-700 border-2 border-white shadow-[0_0_0_2px_#225a3a] animate-pulse" aria-label="Online" />
        </span>
    );
}

function ReminderBanner() {
    return (
        <div className="flex items-center justify-center px-4 py-2 bg-yellow-100 border-b border-yellow-200">
            <span className="text-[#b27a00] font-bold text-sm sm:text-base">
                Please remember to update your profile with your latest contact information.
            </span>
        </div>
    );
}

export default function TopNavbar() {
    const checkUser = useAuth();
    const router = useRouter();
    // Ensure role is always correct and up-to-date based on checkUser context
    const role =
        checkUser.user?.role && checkUser.user?.role !== "Loading"
            ? getRoleLabel(checkUser.user?.role)
            : "Loading";
    const user = {
        name: checkUser.user?.name || "Loading",
        rawRole: checkUser.user?.role || "Loading",
        role, // role is a readable label
        // avatarUrl: checkUser.user?.avatarUrl || "",
    };

    // Notifications integration
    const { data: notifications, isPending: notificationsLoading } = useNotifications();
    const markNotificationRead = useMarkNotificationRead();
    const markAllNotificationsRead = useMarkAllNotificationsRead();
    const deleteNotification = useDeleteNotification();

    // Calculate unread count
    const notificationCount = notifications?.filter((n: { read: boolean }) => !n.read).length || 0;

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

    // Initials logic
    const initials = getInitials(user.name);

    // Helper function for profile button routing (admin check based on rawRole)
    function handleProfileClick() {
        setShowUserDropdown(false);
        if (
            typeof user.rawRole === "string" &&
            user.rawRole.trim().toLowerCase() === "admin"
        ) {
            router.push("/admin/profile");
        } else {
            router.push("/profile");
        }
    }

    return (
        <>
            <ReminderBanner />
            <nav
                className="w-full h-[62px] sm:h-[68px] min-h-[62px] sm:min-h-[68px] flex items-center justify-between px-2 sm:px-8 bg-gradient-to-r from-[#f4f8fd] via-white to-[#f4f8fd] border-b border-[#bfd3e6] sticky top-0 z-30"
                style={{
                    WebkitBackdropFilter: "blur(6px)",
                    backdropFilter: "blur(6px)",
                    height: undefined,
                    minHeight: undefined,
                }}
            >
                {/* Left: Welcome and search */}
                <div className="flex-1 flex items-center min-w-0">
                    {/* Show logo on mobile only */}
                    <div className="sm:hidden flex pr-2 items-center">
                        <Image
                            src="/images/plane.jpg"
                            alt="Logo"
                            width={44}
                            height={44}
                            className="w-11 h-11 object-contain border-2 border-blue-400 rounded-full bg-white"
                            priority
                            draggable={false}
                        />
                    </div>

                    {/* More personal welcome + subtle hierarchy */}
                    <div className="flex flex-col justify-center min-w-0">
                        <span className="hidden sm:inline text-[15px] font-extrabold text-[#163055] tracking-tight leading-tight">
                            Welcome back, <span className="text-[#1C61B6] font-extrabold">{user.name === "Loading" ? "..." : user.name.split(" ")[0]}</span>!
                        </span>
                        <span className="hidden sm:inline text-xs text-[#47608e] font-bold tracking-wide">{user.role}</span>
                    </div>

                    {/* Search bar on sm+ screens only */}
                    <div className="relative w-full max-w-xs sm:max-w-sm md:w-80 sm:block hidden ml-6">
                        <input
                            type="text"
                            className="pl-4 pr-10 py-2 rounded-lg border-2 border-[#9EC3E5] bg-white text-sm text-[#123165] placeholder-[#6a7fa0] focus:outline-none focus:border-[#205ea6] w-full shadow-inner"
                            placeholder="Search…"
                            aria-label="Search"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2762b3] pointer-events-none">
                            <svg width="20" height="20" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                                <circle cx="9" cy="9" r="7" stroke="#2762b3" strokeWidth="2" />
                                <path d="M15 15l-2.2-2.2" stroke="#2762b3" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Right: icons and user */}
                <div className="flex items-center gap-2 sm:gap-6 pr-1 sm:pr-0 flex-shrink-0">
                    {/* Chat icon */}
                    <button
                        aria-label="Open chat"
                        className="group p-2 rounded-full hover:bg-[#195488] transition-colors text-[#417ec5] focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]/70"
                        style={{ minHeight: 0, height: 44, width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <FaRegCommentDots size={22} className="group-hover:text-white group-hover:drop-shadow" />
                    </button>

                    {/* Notification icon with dropdown */}
                    <div className="relative flex items-center">
                        <button
                            aria-label="View notifications"
                            className="group p-2 rounded-full hover:bg-[#205ea6] transition-colors text-[#1860a5] relative focus:outline-none focus:ring-2 focus:ring-[#1D6FD0]/70"
                            style={{ minHeight: 0, height: 44, width: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onClick={() => {
                                setShowUserDropdown(false);
                                setShowNotificationsDropdown((open) => !open);
                            }}
                        >
                            <FaRegBell size={22} className="group-hover:text-white group-hover:drop-shadow" />
                            {/* Notification count badge */}
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-black w-5 h-5 rounded-full bg-[#D42054] text-white border-2 border-white shadow-md select-none">
                                    {notificationCount}
                                </span>
                            )}
                        </button>
                        {showNotificationsDropdown && (
                            <div className="absolute right-0 mt-3 w-80 max-w-[95vw] sm:max-w-[90vw] bg-white border border-[#9EC3E5] rounded-xl z-30 shadow-xl" style={{boxShadow: '0 4px 24px #06376a1a'}}>
                                <div className="py-3 px-5 border-b border-b-[#bfd3e6] bg-gradient-to-r from-[#eaf2fb] to-white rounded-t-xl flex justify-between items-center">
                                    <span className="text-[17px] font-bold text-[#153260]">Notifications</span>
                                    {notificationCount > 0 && (
                                        <button
                                            onClick={() => markAllNotificationsRead.mutate()}
                                            className="text-xs text-[#1860a5] hover:underline px-1 font-semibold"
                                            disabled={markAllNotificationsRead.isPending}
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-60 overflow-y-auto divide-y divide-[#dae9f8]">
                                    {notificationsLoading ? (
                                        <div className="p-5 text-sm text-[#7e899e] text-center">Loading…</div>
                                    ) : (!notifications || notifications.length === 0) ? (
                                        <div className="p-5 text-sm text-[#7e899e] text-center">No notifications.</div>
                                    ) : (
                                        notifications.map((notif: any) => (
                                            <div
                                                className={`
                                                    px-5 py-3 flex flex-col cursor-pointer transition group
                                                    rounded-none last:rounded-b-xl
                                                    hover:bg-[#e8f2fb]
                                                    ${!notif.read ? "bg-[#bfdcff] border-l-4 border-[#2263aa]" : ""}
                                                `}
                                                key={notif.id}
                                                onClick={() => {
                                                    if (!notif.read && !markNotificationRead.isPending) {
                                                        markNotificationRead.mutate(notif.id);
                                                    }
                                                }}
                                            >
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className={`font-bold ${notif.read ? "text-[#8793af] font-medium" : "text-[#13479b] underline underline-offset-2"}`}>
                                                        {notif.message}
                                                    </div>
                                                    <button
                                                        aria-label="Delete notification"
                                                        className="opacity-80 hover:opacity-100 p-1 text-[#a10f2a] hover:bg-[#ffe5ec] rounded-full transition"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification.mutate(notif.id);
                                                        }}
                                                        disabled={deleteNotification.isPending}
                                                    >
                                                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                            <path d="M4 4l8 8M4 12L12 4" stroke="#a10f2a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="text-xs text-[#687898] mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User menu: avatar, greeting, dropdown */}
                    <div className="relative flex items-center gap-2 sm:gap-4 ml-1 sm:ml-4">
                        <button
                            className={`
                                flex items-center gap-3 focus:outline-none px-2 py-1
                                rounded-lg transition
                                hover:bg-[#eaf2fb]
                                ${showUserDropdown ? "ring-2 ring-[#2263aa] bg-[#eaf2fb]" : ""}
                            `}
                            style={{
                                minHeight: 0,
                                height: 48,
                                alignItems: "center",
                                display: "flex",
                            }}
                            onClick={() => setShowUserDropdown((open) => !open)}
                            aria-haspopup="menu"
                            aria-expanded={showUserDropdown}
                            aria-label="Open user menu"
                            tabIndex={0}
                            type="button"
                        >
                            <span className="relative flex items-center">
                                <UserAvatar
                                    src={''}
                                    alt={user.name}
                                    fallback={initials}
                                    size={40}
                                />
                            </span>
                            {/* Greeting - make more personal, show both on xs and up */}
                            <div className="flex flex-col min-w-0 items-start text-left leading-tight justify-center">
                                <span className="text-[16px] font-extrabold text-[#1849ab] max-w-[90px] sm:max-w-[140px] truncate">
                                    {user.name === "Loading" ? "Welcome!" : `Hi, ${user.name.split(" ")[0]}`}
                                </span>
                                <span className="text-xs text-[#316bd3] font-bold max-w-[90px] sm:max-w-[140px] truncate">
                                    {user.role}
                                </span>
                            </div>
                            <svg
                                width="18"
                                height="18"
                                className={`ml-2 text-[#2263aa] transition-transform duration-200 ease-in-out ${showUserDropdown ? "rotate-180" : ""} `}
                                fill="none"
                                viewBox="0 0 16 16"
                                aria-hidden="true"
                            >
                                <path d="M4 6l4 4 4-4" stroke="#2263aa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {showUserDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-30"
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    onClick={() => setShowUserDropdown(false)}
                                />
                                <div
                                    className="absolute top-2 right-0 mt-12 w-56 sm:w-60 bg-white rounded-xl border border-[#bfd3e6] py-5 z-40 animate-fade-in flex flex-col items-stretch shadow-xl"
                                    role="menu"
                                    aria-label="User menu"
                                    onBlur={() => setShowUserDropdown(false)}
                                    style={{boxShadow: '0 4px 24px #06376a1a'}}
                                >
                                    <div className="flex flex-col items-center mb-4 px-2">
                                        <UserAvatar
                                            src={''}
                                            alt={user.name}
                                            fallback={initials}
                                            size={54}
                                        />
                                        <span className="mt-2 font-bold text-[#123165] text-[17px] text-center">{user.name}</span>
                                        <span className="text-sm text-[#316bd3] text-center font-semibold">{user.role}</span>
                                    </div>
                                    <hr className="my-2 border-[#bfd3e6]" />
                                    <button
                                        className="w-full flex items-center gap-2 text-left px-5 py-2 text-[15px] text-[#123165] hover:bg-[#eaf2fb] focus:bg-[#eaf2fb] transition font-bold"
                                        tabIndex={0}
                                        role="menuitem"
                                        onClick={handleProfileClick}
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#316bd3]">
                                            <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H4z" stroke="#316bd3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Profile
                                    </button>
                                    <button
                                        className="w-full flex items-center gap-2 text-left px-5 py-2 text-[15px] text-[#123165] hover:bg-[#eaf2fb] focus:bg-[#eaf2fb] transition font-bold"
                                        tabIndex={0}
                                        role="menuitem"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#316bd3]">
                                            <path d="M4 11V7a6 6 0 1112 0v4" stroke="#316bd3" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            <rect x="2" y="11" width="16" height="7" rx="2" stroke="#316bd3" strokeWidth="1.6" />
                                        </svg>
                                        Settings
                                    </button>
                                    <hr className="my-2 border-[#bfd3e6]" />
                                    <button
                                        className="w-full flex items-center gap-2 text-left px-5 py-2 text-[15px] text-[#bf112b] hover:bg-[#ffe5ec] focus:bg-[#ffe5ec] transition font-bold"
                                        tabIndex={0}
                                        role="menuitem"
                                    >
                                        <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#bf112b]">
                                            <path d="M6 6l8 8M6 14L14 6" stroke="#bf112b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
