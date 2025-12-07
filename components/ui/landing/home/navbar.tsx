"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, ChevronUp, LogOut, User2 } from "lucide-react";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useAuth } from "@/context/authcontext";

// NOTE: we use --primary for primary color usages. Other notes from original remain.

export default function TopNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [serveOpen, setServeOpen] = useState(false);
    const [publicationsOpen, setPublicationsOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);
    const { user, logout, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!mobileOpen) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setMobileOpen(false);
        }
        function onClick(e: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onClick);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClick);
        };
    }, [mobileOpen]);

    const [active, setActive] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined")
            setActive(window.location.pathname);
    }, []);

    function getInitials(name?: string) {
        if (!name) return "U";
        const names = name.split(" ");
        const initials = names[0][0] + (names[1]?.[0] ?? '');
        return initials.toUpperCase();
    }

    return (
        <nav className="w-full sticky top-0 left-0 z-30 bg-white border-b border-[#E6EAF1] shadow-sm px-6 py-2 flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <Link href="/" className="flex items-center group" aria-label="Go to homepage">
                    <Image
                        src="/logo.png"
                        alt="NAAPE Logo"
                        width={56}
                        height={56}
                        className="object-contain h-14 w-14 bg-white rounded drop-shadow-md"
                        priority
                    />
                    <span className="ml-2 text-[21px] font-extrabold tracking-tight text-[color:var(--primary)] hidden sm:inline whitespace-nowrap group-hover:underline decoration-2 underline-offset-4">
                        NAAPE
                    </span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center w-full gap-4 xl:gap-7 text-[#0A1331] font-medium text-[16px]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition text-[15.5px] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${active.startsWith("/about") ? "text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm" : ""}`}
                            tabIndex={0}
                        >
                            About
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/about/about-us" className="font-semibold">About Us</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/about/nac-members">NAC Members</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/about/organs-of-association">Organs of Association</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/about/rights-and-responsibilites">Rights and Responsibilites</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Link
                    href="/membership"
                    className={`px-3 py-2 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${
                        active === '/membership' ? 'text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm' : ''
                    }`}
                >
                    Membership
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition text-[15.5px] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${active.startsWith("/news") ? "text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm" : ""}`}
                            tabIndex={0}
                        >
                            News
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {/* <DropdownMenuItem asChild>
                            <Link href="/news/industry">Industry News</Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuItem asChild>
                            <Link href="/news/naape">NAAPE News</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1 transition text-[15.5px] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${active.startsWith("/publications") ? "text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm" : ""}`}
                            tabIndex={0}
                        >
                            Publications
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/publication/members">From Members</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/publication/naape">From NAAPE</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link
                    href="/gallery"
                    className={`px-3 py-2 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${
                        active === '/gallery' ? 'text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm' : ''
                    }`}
                >
                    Gallery
                </Link>
                <Link
                    href="/contact"
                    className={`px-3 py-2 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] hover:bg-[#eef2fc] hover:text-[color:var(--primary)] ${
                        active === '/contact' ? 'text-[color:var(--primary)] bg-[#eef2fc] font-bold shadow-sm' : ''
                    }`}
                >
                    Contact
                </Link>
            </div>

            {/* Desktop Auth/User Section */}
            <div className="hidden md:flex items-center gap-3 ml-10">
                {!isAuthenticated ? (
                    <>
                        <Link href="/login">
                            <NaapButton
                                className="border-[#E3E6ED] bg-white border h-full text-[color:var(--primary)] hover:bg-[#F5F7FA] text-[15.5px] font-bold min-w-[112px] shadow"
                                style={{letterSpacing: "0.02em"}}
                            >
                                Log In
                            </NaapButton>
                        </Link>
                        <Link href="/register">
                            <NaapButton
                                className="bg-[color:var(--primary)] !rounded-lg shadow-md hover:bg-[color:var(--primary)]/90 text-white text-[15.5px] font-bold min-w-[175px] border-2 border-[color:var(--primary)]"
                                style={{letterSpacing: "0.03em"}}
                            >
                                Become a member
                            </NaapButton>
                        </Link>
                    </>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex items-center gap-3 px-4 py-2 rounded-xl border border-[#E6EAF1] bg-white shadow-sm hover:bg-[#F5F7FA] transition min-w-[46px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                                aria-label="Open account menu"
                                type="button"
                            >
                                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[color:var(--primary)] text-white font-bold text-lg uppercase border-2 border-[color:var(--primary)] shadow">
                                    {getInitials(user?.name)}
                                </span>
                                <span className="text-[16px] text-[color:var(--primary)] font-semibold max-w-[140px] truncate hidden sm:inline">
                                    {user?.name}
                                </span>
                                <ChevronDown size={20} className="text-[color:var(--primary)]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[210px] mt-2 shadow-lg rounded-xl !overflow-hidden border border-[color:var(--primary)]/[.08]">
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard" className="font-medium text-[15.5px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/10">
                                    <User2 className="w-4 h-4" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={logout}
                                className="!text-red-600 cursor-pointer font-medium text-[15.5px] flex items-center gap-2 py-2 hover:bg-red-50"
                            >
                                <LogOut className="w-4 h-4" />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Hamburger menu for mobile */}
            <button
                className="md:hidden p-2 ml-3 flex items-center justify-center rounded-lg transition-colors border border-transparent hover:border-[#EEF2FC] focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
                aria-label="Open main menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                onClick={() => setMobileOpen((prev) => !prev)}
            >
                {mobileOpen ? <X size={30} /> : <Menu size={28} />}
            </button>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div
                    ref={drawerRef}
                    role="dialog"
                    aria-modal="true"
                    id="mobile-nav"
                    className="absolute left-0 top-[100%] w-full z-40 bg-white border-t border-[#E6EAF1] shadow-lg flex flex-col px-3.5 py-4 gap-2 md:hidden animate-slideDown rounded-b-xl"
                >
                    <Link
                        href="/about"
                        className="py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        About
                    </Link>
                    <Link
                        href="/membership"
                        className="py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Membership
                    </Link>

                    {/* News Dropdown - mobile */}
                    <button
                        className="flex items-center justify-between w-full py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        aria-expanded={serveOpen}
                        aria-controls="mobile-news-menu"
                        onClick={() => setServeOpen((open) => !open)}
                        type="button"
                    >
                        <span>News</span>
                        <span>{serveOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                    </button>
                    {serveOpen && (
                        <div
                            id="mobile-news-menu"
                            className="flex flex-col ml-5 pl-3 py-1 border-l-2 border-[color:var(--primary)]/25"
                        >
                            {/* <Link
                                href="/news/industry"
                                className="py-2 text-base hover:text-[color:var(--primary)] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                Industry News
                            </Link> */}
                            <Link
                                href="/news/naape"
                                className="py-2 text-base rounded hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                NAAPE News
                            </Link>
                        </div>
                    )}

                    {/* Publications Dropdown - mobile */}
                    <button
                        className="flex items-center justify-between w-full py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        aria-expanded={publicationsOpen}
                        aria-controls="mobile-publications-menu"
                        onClick={() => setPublicationsOpen((open) => !open)}
                        type="button"
                    >
                        <span>Publications</span>
                        <span>{publicationsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
                    </button>
                    {publicationsOpen && (
                        <div
                            id="mobile-publications-menu"
                            className="flex flex-col ml-5 pl-3 py-1 border-l-2 border-[color:var(--primary)]/25"
                        >
                            <Link
                                href="/publication/members"
                                className="py-2 text-base rounded hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                From Members
                            </Link>
                            <Link
                                href="/publication/naape"
                                className="py-2 text-base rounded hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                From NAAPE
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/gallery"
                        className="py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/contact"
                        className="py-3 px-2 text-lg rounded-lg font-bold hover:text-[color:var(--primary)] hover:bg-[#eef2fc] transition"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Contact
                    </Link>

                    <div className="flex flex-col gap-2 mt-3">
                        {!isAuthenticated ? (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <NaapButton
                                        className="w-full border-[#E3E6ED] bg-white text-[color:var(--primary)] hover:bg-[#F5F7FA] text-[16.5px] font-bold shadow"
                                    >
                                        Log In
                                    </NaapButton>
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)}>
                                    <NaapButton className="w-full bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[16.5px] font-bold shadow border-2 border-[color:var(--primary)]">
                                        Become a member
                                    </NaapButton>
                                </Link>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 px-3 py-3 rounded-xl border border-[#E6EAF1] bg-white shadow hover:bg-[#F5F7FA] transition w-full"
                                        aria-label="Open account menu"
                                        type="button"
                                    >
                                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[color:var(--primary)] text-white font-bold text-[17px] uppercase border-2 border-[color:var(--primary)] shadow">
                                            {getInitials(user?.name)}
                                        </span>
                                        <span className="text-[16px] text-[color:var(--primary)] font-semibold truncate">
                                            {user?.name}
                                        </span>
                                        <ChevronDown size={20} className="text-[color:var(--primary)]" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" sideOffset={6} className="min-w-[180px] mt-2 shadow-lg rounded-xl border border-[color:var(--primary)]/[.08] !overflow-hidden">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard" className="font-medium text-[16px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/10">
                                            <User2 className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="!text-red-600 cursor-pointer font-medium text-[16px] flex items-center gap-2 py-2 hover:bg-red-50"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Log Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
