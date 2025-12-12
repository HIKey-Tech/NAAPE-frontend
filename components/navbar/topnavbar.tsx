"use client";

import { FaRegBell } from "react-icons/fa";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import {
    useNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useDeleteNotification,
} from "@/hooks/useNotification";

// Utility: Extract initials from user's name
function getInitials(name: string | undefined) {
    if (!name) return "U";
    const parts = name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || "");
    return parts.length ? parts.join("") : "U";
}

// Utility: Map role to more presentable label
function getRoleLabel(role: string | undefined): string {
    if (!role) return "Loading";
    const normalized = role.trim().toLowerCase();
    if (normalized === "admin") return "Administrator";
    if (normalized === "user") return "User";
    if (normalized === "manager") return "Manager";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

// Avatar: Robust fallback, improved contrast
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
    const [imageLoaded, setImageLoaded] = useState(!!src);
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
                    className="w-full h-full rounded-full object-cover border-2 border-blue-600 bg-white"
                    // Slightly darker border for more definition
                    onError={() => setImageLoaded(false)}
                    priority
                />
            ) : (
                <span
                    className={`
                        w-full h-full flex items-center justify-center rounded-full
                        bg-gradient-to-tr from-blue-800 via-blue-400 to-pink-400
                        border-2 border-blue-700 text-white font-extrabold select-none
                        shadow-sm
                    `}
                    style={{ fontSize: size > 28 ? 20 : 16, letterSpacing: "1.5px" }}
                    aria-label={alt}
                >
                    {fallback}
                </span>
            )}
            {/* High contrast online indicator */}
            <span className="absolute bottom-0.5 right-0.5 block w-3 h-3 rounded-full bg-gradient-to-br from-lime-400 to-green-600 border-2 border-white shadow-[0_0_0_2px_#0e3322] animate-pulse" aria-label="Online" />
        </span>
    );
}

export default function TopNavbar() {
    const checkUser = useAuth();
    const router = useRouter();
    const role =
        checkUser.user?.role && checkUser.user?.role !== "Loading"
            ? getRoleLabel(checkUser.user?.role)
            : "Loading";
    const user = {
        name: checkUser.user?.name || "Loading",
        rawRole: checkUser.user?.role || "Loading",
        role,
    };

    const { data: notifications, isPending: notificationsLoading } = useNotifications();
    const markNotificationRead = useMarkNotificationRead();
    const markAllNotificationsRead = useMarkAllNotificationsRead();
    const deleteNotification = useDeleteNotification();

    const notificationCount =
        notifications?.filter((n: { read: boolean }) => !n.read).length || 0;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const notificationsDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                showUserDropdown &&
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target as Node)
            ) {
                setShowUserDropdown(false);
            }
            if (
                showNotificationsDropdown &&
                notificationsDropdownRef.current &&
                !notificationsDropdownRef.current.contains(event.target as Node)
            ) {
                setShowNotificationsDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [showUserDropdown, showNotificationsDropdown]);

    const initials = getInitials(user.name);

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
        <nav
            className="w-full h-[76px] sm:h-[94px] min-h-[76px] sm:min-h-[94px] flex items-center justify-between px-2 sm:px-10 border-b border-[#43618b] bg-gradient-to-b from-[#fafcff] to-[#f4f8fd] sticky top-0 z-30"
            style={{
                WebkitBackdropFilter: "blur(8px)",
                backdropFilter: "blur(8px)",
            }}
        >
            {/* Left: Logo & search */}
            <div className="flex-1 flex items-center min-w-0">
                {/* Mobile: Logo with better contrast */}
                <div className="sm:hidden flex pr-3 items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={48}
                        height={48}
                        className="w-12 h-12 object-contain border-2 border-blue-700 shadow-md rounded-full bg-white"
                        priority
                        draggable={false}
                    />
                </div>

                {/* Desktop: Search with higher-contrast */}
                <div className="relative hidden sm:block ml-10 min-w-[240px] max-w-[380px] w-full">
                    <input
                        type="text"
                        className="
                            pl-5 pr-12 py-[13px]
                            rounded-xl border-2 border-[#295095] bg-white 
                            text-base text-[#123165] placeholder-[#3c4863] font-semibold
                            focus:outline-none focus:border-[#174184]
                            w-full shadow-[0_1px_8px_0_#29509522]
                        "
                        placeholder="Search…"
                        aria-label="Search"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#295095] pointer-events-none">
                        <svg width="24" height="24" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                            <circle cx="9" cy="9" r="7" stroke="#295095" strokeWidth="2.2" />
                            <path d="M15 15l-2.2-2.2" stroke="#295095" strokeWidth="2.2" strokeLinecap="round" />
                        </svg>
                    </span>
                </div>
            </div>

            {/* Right: Notification & User */}
            <div className="flex items-center gap-2 sm:gap-8 pr-0 flex-shrink-0">
                {/* Notification button with higher contrast and improved accessibility */}
                <div className="relative flex items-center" ref={notificationsDropdownRef}>
                    <button
                        aria-label="View notifications"
                        className={
                            `group p-3 rounded-full bg-white 
                            hover:bg-[#174184] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#174184]/60
                            text-[#174184] 
                            shadow-[0_1px_4px_#0e1e361f] 
                            transition-colors relative`
                        }
                        style={{
                            minHeight: 0,
                            height: 48,
                            width: 48,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onClick={() => {
                            setShowUserDropdown(false);
                            setShowNotificationsDropdown((open) => !open);
                        }}
                    >
                        <FaRegBell size={22} className="transition group-hover:text-white group-hover:drop-shadow-sm" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex items-center justify-center text-xs font-extrabold w-5 h-5 rounded-full bg-[#d20d40] text-white border-2 border-white shadow-[0_1px_2px_#d20d4060] select-none">
                                {notificationCount}
                            </span>
                        )}
                    </button>
                    {showNotificationsDropdown && (
                        <div
                            className="absolute right-0 mt-3 w-[92vw] sm:w-96 max-w-[95vw] sm:max-w-[90vw] bg-white border border-[#3d5382] rounded-lg z-40 shadow-2xl"
                            style={{ boxShadow: '0 8px 36px #112d4928', minWidth: "246px" }}
                        >
                            <div className="py-4 px-5 sm:px-6 border-b border-[#e8eafa] bg-gradient-to-r from-[#e9f2fd] to-[#f2f8ff] rounded-t-lg flex justify-between items-center">
                                <span className="text-lg sm:text-xl font-black text-[#123165] tracking-tight">
                                    Notifications
                                </span>
                                {notificationCount > 0 && (
                                    <button
                                        onClick={() => markAllNotificationsRead.mutate()}
                                        className="text-xs text-[#174184] hover:text-[#238b45] hover:underline px-2 font-semibold focus:outline-none focus:underline"
                                        disabled={markAllNotificationsRead.isPending}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-[#e5eaf5] bg-white">
                                {notificationsLoading ? (
                                    <div className="p-6 text-base text-[#8ba0c2] text-center font-medium">Loading…</div>
                                ) : (!notifications || notifications.length === 0) ? (
                                    <div className="p-6 text-base text-[#8ba0c2] text-center font-medium">No notifications.</div>
                                ) : (
                                    notifications.map((notif: any) => (
                                        <div
                                            className={`
                                                px-4 sm:px-6 py-3 flex flex-col cursor-pointer group rounded-none last:rounded-b-lg
                                                hover:bg-[#e5f0ff] transition
                                                ${!notif.read ? "bg-[#e9f0fd] border-l-4 border-[#143161]" : ""}
                                            `}
                                            key={notif.id}
                                            onClick={() => {
                                                if (!notif.read && !markNotificationRead.isPending) {
                                                    markNotificationRead.mutate(notif.id);
                                                }
                                            }}
                                        >
                                            <div className="flex justify-between items-start gap-3 sm:gap-4">
                                                <div className={
                                                    `font-bold ${notif.read
                                                        ? "text-[#7b8bb2] font-medium"
                                                        : "text-[#143161] underline"
                                                    } text-sm sm:text-base`
                                                }>
                                                    {notif.message}
                                                </div>
                                                <button
                                                    aria-label="Delete notification"
                                                    className="opacity-80 hover:opacity-100 p-2 text-[#bf112b] hover:bg-[#ffdbe6] rounded-full transition-colors focus:outline-none"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification.mutate(notif.id);
                                                    }}
                                                    disabled={deleteNotification.isPending}
                                                >
                                                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                        <path d="M4 4l8 8M4 12L12 4" stroke="#bf112b" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="text-[11px] sm:text-xs text-[#5d6d95] mt-1 font-mono">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {/* User dropdown */}
                <div className="relative flex items-center gap-2 sm:gap-6 ml-2 sm:ml-6" ref={userDropdownRef}>
                    <button
                        className={`
                            flex items-center gap-2 sm:gap-4 focus:outline-none px-3 sm:px-4 py-2
                            rounded-lg transition-colors font-semibold bg-white
                            hover:bg-[#eaf2fb]
                            ${showUserDropdown ? "ring-2 ring-[#143161] bg-[#eaf2fb]" : ""}
                        `}
                        style={{
                            minHeight: 0,
                            height: 52,
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
                                size={44}
                            />
                        </span>
                        <svg
                            width="20"
                            height="20"
                            className={`ml-2 sm:ml-3 text-[#143161] transition-transform duration-150 ${showUserDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                        >
                            <path d="M4 6l4 4 4-4" stroke="#143161" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                                className="
                                    absolute top-1 right-0 mt-12 sm:mt-14 w-[93vw] sm:w-72 min-w-[244px] max-w-xs sm:max-w-none
                                    bg-white rounded-lg border border-[#43618b] py-6 sm:py-8 z-40 animate-fade-in flex flex-col items-stretch shadow-2xl
                                "
                                role="menu"
                                aria-label="User menu"
                                style={{ boxShadow: '0 8px 36px #14316122' }}
                            >
                                <div className="flex flex-col items-center mb-5 sm:mb-7 px-2">
                                    <UserAvatar
                                        src={''}
                                        alt={user.name}
                                        fallback={initials}
                                        size={64}
                                    />
                                    <span className="mt-2 font-bold text-[#143161] text-lg sm:text-xl text-center truncate max-w-[160px]">{user.name}</span>
                                    <span className="text-base sm:text-lg text-[#235ae7] text-center font-semibold truncate max-w-[120px]">{user.role}</span>
                                </div>
                                <hr className="my-2 sm:my-4 border-[#e6ecfa]" />
                                <button
                                    className="
                                        w-full flex items-center gap-3 text-left px-5 sm:px-7 py-3 text-[15px] sm:text-lg text-[#143161] hover:bg-[#edf4fb] focus:bg-[#eaf2fb] transition font-bold
                                    "
                                    tabIndex={0}
                                    role="menuitem"
                                    onClick={handleProfileClick}
                                >
                                    <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="text-[#235ae7]">
                                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H4z" stroke="#235ae7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Profile
                                </button>
                                <button
                                    className="
                                        w-full flex items-center gap-3 text-left px-5 sm:px-7 py-3 text-[15px] sm:text-lg text-[#143161] hover:bg-[#edf4fb] focus:bg-[#eaf2fb] transition font-bold
                                    "
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="text-[#235ae7]">
                                        <path d="M4 11V7a6 6 0 1112 0v4" stroke="#235ae7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <rect x="2" y="11" width="16" height="7" rx="2" stroke="#235ae7" strokeWidth="2" />
                                    </svg>
                                    Settings
                                </button>
                                <hr className="my-2 sm:my-4 border-[#e6ecfa]" />
                                <button
                                    className="
                                        w-full flex items-center gap-3 text-left px-5 sm:px-7 py-3 text-[15px] sm:text-lg text-[#bf112b] hover:bg-[#ffe5ec] focus:bg-[#ffe5ec] transition font-bold
                                    "
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="18" height="18" fill="none" viewBox="0 0 20 20" className="text-[#bf112b]">
                                        <path d="M6 6l8 8M6 14L14 6" stroke="#bf112b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
