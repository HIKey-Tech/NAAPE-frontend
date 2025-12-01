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

// NOTE: From @globals.css, suppose the primary colour is set as a CSS custom property:
// :root { --primary: #2852B4; }
// We will now replace all previous hard-coded #2852B4, #2347A0, #2473ea, #3970D8, #5671c0 usages that semantically mean "primary" or a "primary shade" with "var(--primary)" or --tw-prose-primary (if Tailwind is mapped).
// Neutral nuances (#E6EAF1, #F3F6FC, etc) will remain unless the prompt specifies otherwise.

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
                <Link href="/" className="flex items-center" aria-label="Go to homepage">
                    <Image
                        src="/logo.png"
                        alt="NAAPE Logo"
                        width={52}
                        height={52}
                        className="object-contain h-14 w-14 bg-white rounded"
                        priority
                    />
                    <span className="ml-2 text-[17px] font-semibold text-[#232835] hidden sm:inline whitespace-nowrap">
                        NAAPE
                    </span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center w-full gap-2 xl:gap-5 text-[#0A1331] font-medium text-[15px]">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-2 font-medium flex items-center gap-1 hover:text-[color:var(--primary)] ${active.startsWith("/about") ? "text-[color:var(--primary)] font-semibold" : ""}`}
                            tabIndex={0}
                        >
                            About
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/about/about-us">About Us</Link>
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
                    className={`hover:text-[color:var(--primary)] transition px-2 py-1 ${active === '/membership' ? 'text-[color:var(--primary)] font-semibold' : ''}`}
                >
                    Membership
                </Link>

                {/* News as Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-2 font-medium flex items-center gap-1 hover:text-[color:var(--primary)] ${active.startsWith("/news") ? "text-[color:var(--primary)] font-semibold" : ""}`}
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

                {/* Publications as Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-2 font-medium flex items-center gap-1 hover:text-[color:var(--primary)] ${active.startsWith("/publications") ? "text-[color:var(--primary)] font-semibold" : ""}`}
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
                    className={`hover:text-[color:var(--primary)] transition px-2 py-1 ${active === '/gallery' ? 'text-[color:var(--primary)] font-semibold' : ''}`}
                >
                    Gallery
                </Link>
                <Link
                    href="/contact"
                    className={`hover:text-[color:var(--primary)] transition px-2 py-1 ${active === '/contact' ? 'text-[color:var(--primary)] font-semibold' : ''}`}
                >
                    Contact
                </Link>
            </div>

            {/* Desktop Auth/User Section */}
            <div className="hidden md:flex items-center gap-2 ml-6">
                {!isAuthenticated ? (
                    <>
                        <Link href="/login">
                            <NaapButton
                                className="border-[#E3E6ED] bg-white border h-full text-[color:var(--primary)] hover:bg-[#F5F7FA] text-[15px] font-semibold min-w-[96px]"
                            >
                                Log In
                            </NaapButton>
                        </Link>
                        <Link href="/register">
                            <NaapButton
                                className="bg-[color:var(--primary)] !rounded hover:bg-[color:var(--primary)]/90 text-white text-[15px] font-semibold min-w-[150px]"
                            >
                                Become a member
                            </NaapButton>
                        </Link>
                    </>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="flex items-center gap-2 px-3 py-1 rounded-lg border border-[#E6EAF1] bg-white shadow-sm hover:bg-[#F5F7FA] transition min-w-[42px] focus:outline-none"
                                aria-label="Open account menu"
                                type="button"
                            >
                                <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[color:var(--primary)] text-white font-bold text-base uppercase">
                                    {getInitials(user?.name)}
                                </span>
                                <span className="text-[15px] text-[color:var(--primary)] font-medium max-w-[110px] truncate hidden sm:inline">{user?.name}</span>
                                <ChevronDown size={18} className="text-[color:var(--primary)]" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[190px]">
                            <DropdownMenuItem asChild>
                                <Link href="/dashboard">
                                    <User2 className="w-4 h-4 mr-2" />
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={logout}
                                className="!text-red-600 cursor-pointer"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Log Out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Hamburger menu for mobile */}
            <button
                className="md:hidden p-2 ml-3 flex items-center justify-center rounded transition-colors hover:bg-[#F3F6FC]"
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
                    className="absolute left-0 top-[100%] w-full z-40 bg-white border-t border-[#E6EAF1] shadow-md flex flex-col px-3.5 py-2 gap-1 md:hidden animate-slideDown"
                >
                    <Link
                        href="/about"
                        className="py-2 hover:text-[color:var(--primary)] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        About
                    </Link>
                    <Link
                        href="/membership"
                        className="py-2 hover:text-[color:var(--primary)] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Membership
                    </Link>

                    {/* News Dropdown - mobile */}
                    <button
                        className="flex items-center w-full py-2 font-medium hover:text-[color:var(--primary)] transition"
                        aria-expanded={serveOpen}
                        aria-controls="mobile-news-menu"
                        onClick={() => setServeOpen((open) => !open)}
                        type="button"
                    >
                        News
                        <span className="ml-1">{serveOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                    </button>
                    {serveOpen && (
                        <div
                            id="mobile-news-menu"
                            className="flex flex-col bg-white border-l border-[#E6EAF1] ml-5 pl-2 py-1"
                        >
                            {/* <Link
                                href="/news/industry"
                                className="py-2 text-sm hover:text-[color:var(--primary)] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                Industry News
                            </Link> */}
                            <Link
                                href="/news/naape"
                                className="py-2 text-sm hover:text-[color:var(--primary)] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                NAAPE News
                            </Link>
                        </div>
                    )}

                    {/* Publications Dropdown - mobile */}
                    <button
                        className="flex items-center w-full py-2 font-medium hover:text-[color:var(--primary)] transition"
                        aria-expanded={publicationsOpen}
                        aria-controls="mobile-publications-menu"
                        onClick={() => setPublicationsOpen((open) => !open)}
                        type="button"
                    >
                        Publications
                        <span className="ml-1">{publicationsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                    </button>
                    {publicationsOpen && (
                        <div
                            id="mobile-publications-menu"
                            className="flex flex-col bg-white border-l border-[#E6EAF1] ml-5 pl-2 py-1"
                        >
                            <Link
                                href="/publication/members"
                                className="py-2 text-sm hover:text-[color:var(--primary)] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                From Members
                            </Link>
                            <Link
                                href="/publication/naape"
                                className="py-2 text-sm hover:text-[color:var(--primary)] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                From NAAPE
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/gallery"
                        className="py-2 hover:text-[color:var(--primary)] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/contact"
                        className="py-2 hover:text-[color:var(--primary)] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Contact
                    </Link>

                    <div className="flex flex-col gap-2 mt-2">
                        {!isAuthenticated ? (
                            <>
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <NaapButton
                                        className="w-full border-[#E3E6ED] bg-white text-[color:var(--primary)] hover:bg-[#F5F7FA] text-[15px] font-semibold"
                                    >
                                        Log In
                                    </NaapButton>
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)}>
                                    <NaapButton className="w-full bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[15px] font-semibold">
                                        Become a member
                                    </NaapButton>
                                </Link>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E6EAF1] bg-white shadow-sm hover:bg-[#F5F7FA] transition w-full"
                                        aria-label="Open account menu"
                                        type="button"
                                    >
                                        <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[color:var(--primary)] text-white font-bold text-base uppercase">
                                            {getInitials(user?.name)}
                                        </span>
                                        <span className="text-[15px] text-[color:var(--primary)] font-medium truncate">{user?.name}</span>
                                        <ChevronDown size={18} className="text-[color:var(--primary)]" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" sideOffset={6} className="min-w-[180px]">
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <User2 className="w-4 h-4 mr-2" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => { logout(); setMobileOpen(false); }}
                                        className="!text-red-600 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
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
