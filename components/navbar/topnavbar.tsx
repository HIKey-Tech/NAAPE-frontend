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
import { LogoutDialog } from "@/components/ui/logout-dialog";
import { motion, AnimatePresence } from "framer-motion";

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

    // Update imageLoaded when src changes
    useEffect(() => {
        setImageLoaded(!!src);
    }, [src]);

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
                    className="w-full h-full rounded-full object-cover border border-slate-200 shadow-sm bg-slate-50"
                    onError={() => setImageLoaded(false)}
                    priority
                />
            ) : (
                <span
                    className={`
                        w-full h-full flex items-center justify-center rounded-full
                        bg-gradient-to-tr from-primary/80 via-primary to-indigo-500
                        text-white font-bold select-none shadow-sm
                    `}
                    style={{ fontSize: size > 28 ? 16 : 12 }}
                    aria-label={alt}
                >
                    {fallback}
                </span>
            )}
            {/* High contrast online indicator */}
            <span className="absolute bottom-0 right-0 block w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" aria-label="Online" />
        </span>
    );
}

export default function TopNavbar() {
    const { user: authUser, logout } = useAuth();
    const router = useRouter();
    const role =
        authUser?.role && authUser?.role !== "Loading"
            ? getRoleLabel(authUser?.role)
            : "User";
    const user = {
        name: authUser?.name || "User",
        rawRole: authUser?.role || "user",
        role,
        avatarUrl: authUser?.profile?.image?.url,
    };

    const { data: notifications, isPending: notificationsLoading } = useNotifications();
    const markNotificationRead = useMarkNotificationRead();
    const markAllNotificationsRead = useMarkAllNotificationsRead();
    const deleteNotification = useDeleteNotification();

    const notificationCount =
        notifications?.filter((n: { read: boolean }) => !n.read).length || 0;
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

    function handleSettingsClick() {
        setShowUserDropdown(false);
        if (
            typeof user.rawRole === "string" &&
            user.rawRole.trim().toLowerCase() === "admin"
        ) {
            router.push("/admin/settings");
        } else {
            router.push("/settings");
        }
    }

    function handleLogout() {
        setShowUserDropdown(false);
        setShowLogoutDialog(true);
    }

    function confirmLogout() {
        setShowLogoutDialog(false);
        setShowUserDropdown(false);
        logout();
    }

    return (
        <nav
            className="w-full h-[72px] flex items-center justify-between px-6 md:px-8 border-b border-slate-100 bg-white/80 sticky top-0 z-40 transition-all duration-300"
            style={{
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
            }}
        >
            {/* Left: Logo (Mobile) & Search (Desktop) */}
            <div className="flex-1 flex items-center min-w-0 gap-6">
                {/* Mobile: Logo */}
                <div className="sm:hidden flex pr-3 items-center">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={40}
                        height={40}
                        className="w-10 h-10 object-contain drop-shadow-sm"
                        priority
                        draggable={false}
                    />
                </div>

                {/* Desktop: Search removed as per request */}
                <div className="relative hidden sm:block max-w-md w-full">
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                {/* Notification Bell */}
                <div className="relative" ref={notificationsDropdownRef}>
                    <button
                        aria-label="View notifications"
                        className={`
                            relative p-2.5 rounded-full transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-primary/20
                            hover:bg-slate-100 active:scale-95
                            ${showNotificationsDropdown ? "bg-slate-100 text-primary" : "text-slate-500 hover:text-slate-700"}
                        `}
                        onClick={() => {
                            setShowUserDropdown(false);
                            setShowNotificationsDropdown((open) => !open);
                        }}
                    >
                        <FaRegBell size={20} />
                        {notificationCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
                        )}
                    </button>

                    <AnimatePresence>
                        {showNotificationsDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden origin-top-right ring-1 ring-slate-900/5"
                            >
                                <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                    <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                                    {notificationCount > 0 && (
                                        <button
                                            onClick={() => markAllNotificationsRead.mutate()}
                                            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                                            disabled={markAllNotificationsRead.isPending}
                                        >
                                            Mark all as read
                                        </button>
                                    )}
                                </div>
                                <div className="max-h-[60vh] overflow-y-auto">
                                    {notificationsLoading ? (
                                        <div className="p-8 text-center text-sm text-slate-400">Loading...</div>
                                    ) : !notifications?.length ? (
                                        <div className="p-8 text-center">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300">
                                                <FaRegBell size={20} />
                                            </div>
                                            <p className="text-sm text-slate-500 font-medium">No new notifications</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-50">
                                            {notifications.map((notif: any) => (
                                                <div
                                                    key={notif._id}
                                                    className={`
                                                        p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative
                                                        ${!notif.read ? "bg-primary/[0.02]" : ""}
                                                    `}
                                                    onClick={() => !notif.read && markNotificationRead.mutate(notif._id)}
                                                >
                                                    <div className="flex gap-3 items-start">
                                                        <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notif.read ? "bg-primary" : "bg-slate-200"}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm ${!notif.read ? "font-semibold text-slate-800" : "text-slate-600"}`}>
                                                                {notif.message}
                                                            </p>
                                                            <p className="text-xs text-slate-400 mt-1">
                                                                {notif.createdAt ? new Date(notif.createdAt).toLocaleString(undefined, {
                                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                                }) : ""}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification.mutate(notif._id);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                                                        >
                                                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative" ref={userDropdownRef}>
                    <button
                        className={`
                            flex items-center gap-3 p-1.5 pr-3 rounded-full transition-all duration-200 border border-transparent
                            hover:bg-slate-100 focus:outline-none focus:bg-slate-100
                            ${showUserDropdown ? "bg-slate-100 border-slate-200 shadow-sm" : ""}
                        `}
                        onClick={() => setShowUserDropdown((open) => !open)}
                        aria-expanded={showUserDropdown}
                        aria-label="User menu"
                    >
                        <UserAvatar
                            src={user.avatarUrl}
                            alt={user.name}
                            fallback={initials}
                            size={36}
                            className={showUserDropdown ? "ring-2 ring-primary/10" : ""}
                        />
                        <div className="hidden lg:block text-left">
                            <p className="text-sm font-bold text-slate-700 leading-none mb-0.5 max-w-[120px] truncate">{user.name}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{user.role}</p>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            className={`hidden lg:block text-slate-400 transition-transform duration-200 ${showUserDropdown ? "rotate-180 text-primary" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <AnimatePresence>
                        {showUserDropdown && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden ring-1 ring-slate-900/5"
                            >
                                <div className="p-2 border-b border-slate-50">
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{authUser?.email || "user@naape.org.ng"}</p>
                                    </div>
                                </div>

                                <div className="p-1.5 flex flex-col gap-0.5">
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-primary transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </button>
                                    <button
                                        onClick={handleSettingsClick}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-xl hover:bg-slate-50 hover:text-primary transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </button>
                                </div>

                                <div className="p-1.5 mt-1 border-t border-slate-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-600 rounded-xl hover:bg-red-50 transition-colors text-left"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Sign out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <LogoutDialog
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                onConfirm={confirmLogout}
            />
        </nav>
    );
}
