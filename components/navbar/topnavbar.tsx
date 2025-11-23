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

function getInitials(name: string | undefined) {
    if (!name) return "U";
    const parts = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || "");
    return parts.length ? parts.join("") : "U";
}

function UserAvatar({
    src,
    alt,
    fallback,
    className = "",
    size = 32,
}: {
    src?: string;
    alt?: string;
    fallback: string;
    className?: string;
    size?: number;
}) {
    const [imageLoaded, setImageLoaded] = useState(true);
    return (
        <span className={`relative block ${className}`} style={{ width: size, height: size }}>
            {src && imageLoaded ? (
                <Image
                    src={src}
                    alt={alt || ""}
                    width={size}
                    height={size}
                    className={`w-full h-full rounded-full object-cover border border-[#D9E7F5] bg-gray-100 transition-shadow duration-150 hover:shadow-lg`}
                    onError={() => setImageLoaded(false)}
                    priority
                />
            ) : (
                <span
                    className={`
                        w-full h-full flex items-center justify-center rounded-full
                        bg-gradient-to-tr from-blue-200 to-blue-50
                        border border-[#D9E7F5] text-[#295681] font-semibold select-none
                        text-base
                    `}
                    style={{ fontSize: size > 24 ? 16 : 14 }}
                    aria-label={alt}
                >
                    {fallback}
                </span>
            )}
            <span
                className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white shadow"
                aria-label="Online"
            />
        </span>
    );
}

export default function TopNavbar() {
    const checkUser = useAuth();
    const router = useRouter();
    const user = {
        name: checkUser.user?.name || "Loading",
        role: checkUser.user?.role || "Loading",
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

    return (
        <nav
            className={`
                w-full
                h-[54px] sm:h-16
                min-h-[54px] sm:min-h-16
                flex items-center justify-between
                px-2 sm:px-4
                bg-white border-b border-[#EAEDF0]
                sticky top-0 z-30
                transition-shadow
            `}
            style={{
                WebkitBackdropFilter: "blur(6px)",
                backdropFilter: "blur(6px)",
                height: undefined,
                minHeight: undefined,
            }}
        >
            {/* On mobile: logo. On tablet/desktop: search box. */}
            <div className="flex-1 flex items-center">
                {/* Show logo on mobile only */}
                <div className="sm:hidden flex items-center">
                    <Image
                        src="/images/plane.jpg"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain"
                        priority
                        draggable={false}
                    />
                </div>
                {/* Search bar on sm+ screens only */}
                <div className="relative w-full max-w-xs sm:max-w-sm md:w-80 sm:block hidden">
                    <input
                        type="text"
                        className="pl-4 pr-9 py-2 rounded-md border border-[#E6EAF0] bg-[#FAFCFE] text-sm text-[#203040] placeholder-[#A9B5C7] focus:outline-none focus:border-[#B2D7EF] w-full transition-shadow"
                        placeholder="Search…"
                        aria-label="Search"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#AEBFD3] pointer-events-none">
                        <svg width="18" height="18" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                            <circle cx="9" cy="9" r="7" stroke="#AEBFD3" strokeWidth="2" />
                            <path d="M15 15l-2.2-2.2" stroke="#AEBFD3" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Right section, always shown on all screen sizes */}
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
                {/* Chat icon */}
                <button
                    aria-label="Open chat"
                    className="group p-2 rounded-md hover:bg-[#E5F0FB] transition-colors text-[#8CA1B6] focus:outline-none focus:ring-2 focus:ring-[#B2D7EF]"
                    style={{ minHeight: 0, height: 40, width: 40 }}
                >
                    <FaRegCommentDots size={21} className="group-hover:text-[#326BB4]" />
                </button>

                {/* Notification icon with dropdown */}
                <div className="relative">
                    <button
                        aria-label="View notifications"
                        className="group p-2 rounded-md hover:bg-[#E5F0FB] transition-colors text-[#8CA1B6] relative focus:outline-none focus:ring-2 focus:ring-[#B2D7EF]"
                        style={{ minHeight: 0, height: 40, width: 40 }}
                        onClick={() => {
                            setShowUserDropdown(false);
                            setShowNotificationsDropdown((open) => !open);
                        }}
                    >
                        <FaRegBell size={21} className="group-hover:text-[#326BB4]" />
                        {/* Notification count badge */}
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-bold w-5 h-5 rounded-full bg-red-500 text-white border-2 border-white">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    {showNotificationsDropdown && (
                        <div className="absolute right-0 mt-2 w-72 max-w-[95vw] sm:w-80 sm:max-w-[90vw] bg-white border border-[#E6EAF0] rounded-lg shadow-lg z-20">
                            <div className="p-4 border-b border-[#E6EAF0] font-semibold text-[#16355D] flex justify-between items-center">
                                <span>Notifications</span>
                                {notificationCount > 0 && (
                                    <button
                                        onClick={() => markAllNotificationsRead.mutate()}
                                        className="text-xs text-blue-600 hover:underline px-1"
                                        disabled={markAllNotificationsRead.isPending}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-60 overflow-y-auto divide-y divide-[#F1F4F8]">
                                {notificationsLoading ? (
                                    <div className="p-4 text-sm text-[#8CA1B6] text-center">Loading…</div>
                                ) : (!notifications || notifications.length === 0) ? (
                                    <div className="p-4 text-sm text-[#8CA1B6] text-center">No notifications.</div>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div
                                            className={`
                                                p-4 flex flex-col cursor-pointer hover:bg-[#F6FAFE] group
                                                ${!notif.read ? "bg-blue-50/40 border-l-2 border-blue-200" : ""}
                                            `}
                                            key={notif.id}
                                            onClick={() => {
                                                if (!notif.read && !markNotificationRead.isPending) {
                                                    markNotificationRead.mutate(notif.id);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div className={`font-medium text-[#203040] ${notif.read ? "" : "font-bold"}`}>{notif.message}</div>
                                                <button
                                                    aria-label="Delete notification"
                                                    className="opacity-60 hover:opacity-100 p-1 text-[#AEBFD3]"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification.mutate(notif.id);
                                                    }}
                                                    disabled={deleteNotification.isPending}
                                                >
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                        <path d="M4 4l8 8M4 12L12 4" stroke="#D04545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-xs text-[#A9B5C7] mt-1">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User menu: always show avatar, hide name/role on mobile */}
                <div className="relative flex items-center gap-2 ml-1 sm:ml-2">
                    <button
                        className={`
                            flex items-center gap-2 focus:outline-none px-2 py-1
                            rounded-md transition
                            hover:bg-[#E8F2FE]
                            ${showUserDropdown ? "ring-2 ring-[#B2D7EF] bg-[#F2F7FB]" : ""}
                        `}
                        style={{ minHeight: 0, height: 40 }}
                        onClick={() => setShowUserDropdown((open) => !open)}
                        aria-haspopup="menu"
                        aria-expanded={showUserDropdown}
                        aria-label="Open user menu"
                        tabIndex={0}
                        type="button"
                    >
                        <span className="relative w-8 h-8">
                            <UserAvatar
                                src={''}
                                alt={user.name}
                                fallback={initials}
                                size={32}
                            />
                            {/* Online indicator dot */}
                            <span
                                className="absolute bottom-0 right-0 block w-2 h-2 bg-green-500 border-2 border-white rounded-full shadow ring-1 ring-white"
                                aria-label="Online"
                            />
                        </span>
                        {/* On xs screens, hide name/role, just show avatar */}
                        <div className="flex-col min-w-0 leading-tight items-start text-left ml-0 hidden xs:flex">
                            <span className="text-sm font-semibold text-[#16355D] truncate max-w-[80px] sm:max-w-[120px]">{user.name}</span>
                            <span className="text-xs text-[#96A6BF] truncate max-w-[80px] sm:max-w-[120px]">{user.role}</span>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            className={`ml-1 text-[#9CB2C9] transition-transform duration-150 ease-in-out ${showUserDropdown ? "rotate-180" : ""} hidden xs:block`}
                            fill="none"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                        >
                            <path d="M4 6l4 4 4-4" stroke="#9CB2C9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
                                className="absolute top-2 right-0 mt-10 w-44 sm:w-48 bg-white shadow-lg rounded-md border border-[#E6EAF0] py-4 z-40 animate-fade-in"
                                role="menu"
                                aria-label="User menu"
                                onBlur={() => setShowUserDropdown(false)}
                            >
                                <button
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-[#16355D] hover:bg-[#F3F6FB] focus:bg-[#F3F6FB] transition"
                                    tabIndex={0}
                                    role="menuitem"
                                    onClick={() => {
                                        setShowUserDropdown(false);
                                        router.push("/profile");
                                    }}
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#A6B5C6]">
                                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H4z" stroke="#A6B5C6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Profile
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-[#16355D] hover:bg-[#F3F6FB] focus:bg-[#F3F6FB] transition"
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#A6B5C6]">
                                        <path d="M4 11V7a6 6 0 1112 0v4" stroke="#A6B5C6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="2" y="11" width="16" height="7" rx="2" stroke="#A6B5C6" strokeWidth="1.6" />
                                    </svg>
                                    Settings
                                </button>
                                <hr className="my-1 border-[#E6EAF0]" />
                                <button
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-500 hover:bg-[#FFF6F6] focus:bg-[#FFF6F6] transition"
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-red-400">
                                        <path d="M6 6l8 8M6 14L14 6" stroke="#F87171" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
