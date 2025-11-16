"use client";

import { FaRegCommentDots, FaRegBell } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

export default function TopNavbar() {
    // This can later come from context/auth/user
    const user = {
        name: "Akeem",
        role: "Engineer",
        avatarUrl: "/user-avatar.jpg",
    };

    // For improved example: notification count and user menu dropdown
    const [notificationCount] = useState(3); // Example
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false); 

    return (
        <nav className="w-full h-16 flex items-center justify-between px-4 bg-white border-b border-[#EAEDF0] sticky top-0 z-30">
            {/* Search Box */}
            <div className="flex items-center flex-1">
                <div className="relative w-80 max-w-full">
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

            {/* Right section */}
            <div className="flex items-center gap-4">
                {/* Chat icon */}
                <button
                    aria-label="Open chat"
                    className="group p-2 rounded-md hover:bg-[#E5F0FB] transition-colors text-[#8CA1B6] focus:outline-none focus:ring-2 focus:ring-[#B2D7EF]"
                >
                    <FaRegCommentDots size={21} className="group-hover:text-[#326BB4]" />
                </button>

                {/* Notification icon with dropdown */}
                <div className="relative">
                    <button
                        aria-label="View notifications"
                        className="group p-2 rounded-md hover:bg-[#E5F0FB] transition-colors text-[#8CA1B6] relative focus:outline-none focus:ring-2 focus:ring-[#B2D7EF]"
                        // Clicking notifications closes user menu and toggles the notifications dropdown
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
                    {/* Notifications dropdown */}
                    {showNotificationsDropdown && (
                        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-[#E6EAF0] rounded-lg shadow-lg z-20">
                            <div className="p-4 border-b border-[#E6EAF0] font-semibold text-[#16355D]">
                                Notifications
                            </div>
                            <div className="max-h-60 overflow-y-auto divide-y divide-[#F1F4F8]">
                                {/* Example notifications; replace with real notifications in real app */}
                                {notificationCount === 0 ? (
                                    <div className="p-4 text-sm text-[#8CA1B6] text-center">No new notifications.</div>
                                ) : (
                                    <>
                                        <div className="p-4 hover:bg-[#F6FAFE] cursor-pointer">
                                            <div className="font-medium text-[#203040]">3 new comments on your post</div>
                                            <div className="text-xs text-[#A9B5C7] mt-1">5 min ago</div>
                                        </div>
                                        <div className="p-4 hover:bg-[#F6FAFE] cursor-pointer">
                                            <div className="font-medium text-[#203040]">Your submission was approved</div>
                                            <div className="text-xs text-[#A9B5C7] mt-1">1 hour ago</div>
                                        </div>
                                        <div className="p-4 hover:bg-[#F6FAFE] cursor-pointer">
                                            <div className="font-medium text-[#203040]">Reminder: Complete your profile</div>
                                            <div className="text-xs text-[#A9B5C7] mt-1">Yesterday</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User menu */}
                <div className="relative flex items-center gap-2 ml-2">
                    <button
                        className={`
                            flex items-center gap-2 focus:outline-none px-2 py-1
                            rounded-md transition
                            hover:bg-[#E8F2FE]
                            ${showUserDropdown ? "ring-2 ring-[#B2D7EF] bg-[#F2F7FB]" : ""}
                        `}
                        onClick={() => setShowUserDropdown((open) => !open)}
                        aria-haspopup="menu"
                        aria-expanded={showUserDropdown}
                        aria-label="Open user menu"
                        tabIndex={0}
                        type="button"
                    >
                        <span className="relative w-8 h-8">
                            <Image
                                src={user.avatarUrl}
                                alt={user.name}
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover border border-[#D9E7F5] bg-gray-100"
                                priority
                            />
                            {/* Online indicator dot */}
                            <span
                                className="absolute bottom-0 right-0 block w-2 h-2 bg-green-500 border-2 border-white rounded-full shadow ring-1 ring-white"
                                aria-label="Online"
                            />
                        </span>
                        <div className="flex flex-col min-w-0 leading-tight items-start text-left">
                            <span className="text-sm font-semibold text-[#16355D] truncate max-w-[120px]">{user.name}</span>
                            <span className="text-xs text-[#96A6BF] truncate max-w-[120px]">{user.role}</span>
                        </div>
                        <svg
                            width="16"
                            height="16"
                            className={`ml-1 text-[#9CB2C9] transition-transform duration-150 ease-in-out ${showUserDropdown ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                        >
                            <path d="M4 6l4 4 4-4" stroke="#9CB2C9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {/* User dropdown */}
                    {showUserDropdown && (
                        <>
                            <div
                                className="fixed inset-0 z-30"
                                tabIndex={-1}
                                aria-hidden="true"
                                onClick={() => setShowUserDropdown(false)}
                            />
                            <div
                                className="absolute top-2 right-0 mt-10 w-48 bg-white shadow-lg rounded-md border border-[#E6EAF0] py-4 z-40 animate-fade-in"
                                role="menu"
                                aria-label="User menu"
                                onBlur={() => setShowUserDropdown(false)}
                            >
                                <button
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-[#16355D] hover:bg-[#F3F6FB] focus:bg-[#F3F6FB] transition"
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#A6B5C6]">
                                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-6 8a6 6 0 0112 0H4z" stroke="#A6B5C6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Profile
                                </button>
                                <button
                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-[#16355D] hover:bg-[#F3F6FB] focus:bg-[#F3F6FB] transition"
                                    tabIndex={0}
                                    role="menuitem"
                                >
                                    <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="text-[#A6B5C6]">
                                        <path d="M4 11V7a6 6 0 1112 0v4" stroke="#A6B5C6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                        <rect x="2" y="11" width="16" height="7" rx="2" stroke="#A6B5C6" strokeWidth="1.6"/>
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
                                        <path d="M6 6l8 8M6 14L14 6" stroke="#F87171" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
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
