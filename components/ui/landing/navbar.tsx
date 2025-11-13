"use client";

import  { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { NaapButton } from "@/components/ui/custom/button.naap";

// improved accessibility and usability: close drawer on esc or click outside, highlight active links, keep structure clean
export default function TopNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [serveOpen, setServeOpen] = useState(false);
    const [publicationsOpen, setPublicationsOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mobileOpen) return;
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === "Escape") setMobileOpen(false);
        }
        function onClick(e: MouseEvent) {
            // If click is outside the drawer, close it
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

    // determine active route for .active styling (optional enhancement)
    // This is client-side only and basic — adjust as needed if using Next Router.
    const [active, setActive] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined")
            setActive(window.location.pathname);
    }, []);

    const navLinks = [
        { href: "/about", label: "About" },
        { href: "/membership", label: "Membership" },
        { type: "dropdown", label: "News", menu: [
            { href: "/news/industry", label: "Industry News" },
            { href: "/news/naape", label: "NAAPE News" },
        ]},
        { type: "dropdown", label: "Publications", menu: [
            { href: "/publications/magazines", label: "Magazines" },
            { href: "/publications/newsletters", label: "Newsletters" },
        ]},
        { href: "/gallery", label: "Gallery" },
        { href: "/contact", label: "Contact" },
    ];

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
                <Link
                    href="/about"
                    className={`hover:text-[#3970D8] transition px-2 py-1 ${active === '/about' ? 'text-[#2473ea] font-semibold' : ''}`}
                >
                    About
                </Link>
                <Link
                    href="/membership"
                    className={`hover:text-[#3970D8] transition px-2 py-1 ${active === '/membership' ? 'text-[#2473ea] font-semibold' : ''}`}
                >
                    Membership
                </Link>

                {/* News as Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className={`px-2 font-medium flex items-center gap-1 hover:text-[#3970D8] ${
                                active.startsWith("/news") ? "text-[#2473ea] font-semibold" : ""
                            }`}
                            tabIndex={0}
                        >
                            News
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/news/industry">Industry News</Link>
                        </DropdownMenuItem>
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
                            className={`px-2 font-medium flex items-center gap-1 hover:text-[#3970D8] ${
                                active.startsWith("/publications") ? "text-[#2473ea] font-semibold" : ""
                            }`}
                            tabIndex={0}
                        >
                            Publications
                            <ChevronDown size={16} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/publications/magazines">Magazines</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/publications/newsletters">Newsletters</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Link
                    href="/gallery"
                    className={`hover:text-[#3970D8] transition px-2 py-1 ${active === '/gallery' ? 'text-[#2473ea] font-semibold' : ''}`}
                >
                    Gallery
                </Link>
                <Link
                    href="/contact"
                    className={`hover:text-[#3970D8] transition px-2 py-1 ${active === '/contact' ? 'text-[#2473ea] font-semibold' : ''}`}
                >
                    Contact
                </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 ml-6">
                <Link href="/login">
                    <NaapButton
                        className="border-[#E3E6ED] bg-white border h-full text-[#2852B4] hover:bg-[#F5F7FA] text-[15px] font-semibold min-w-[96px]"
                    >
                        Log In
                    </NaapButton>
                </Link>
                <Link href="/register">
                    <NaapButton
                        className="bg-[#2852B4] !rounded hover:bg-[#2347A0] text-white text-[15px] font-semibold min-w-[150px]"
                    >
                        Become a member
                    </NaapButton>
                </Link>
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
                        className="py-2 hover:text-[#3970D8] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        About
                    </Link>
                    <Link
                        href="/membership"
                        className="py-2 hover:text-[#3970D8] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Membership
                    </Link>

                    {/* News Dropdown - mobile */}
                    <button
                        className="flex items-center w-full py-2 font-medium hover:text-[#3970D8] transition"
                        aria-expanded={serveOpen}
                        aria-controls="mobile-news-menu"
                        onClick={() => setServeOpen((open) => !open)}
                        type="button"
                    >
                        News
                        <span className="ml-1">{serveOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span>
                    </button>
                    {serveOpen && (
                        <div
                            id="mobile-news-menu"
                            className="flex flex-col bg-white border-l border-[#E6EAF1] ml-5 pl-2 py-1"
                        >
                            <Link
                                href="/news/industry"
                                className="py-2 text-sm hover:text-[#3970D8] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                Industry News
                            </Link>
                            <Link
                                href="/news/naape"
                                className="py-2 text-sm hover:text-[#3970D8] transition"
                                onClick={() => { setMobileOpen(false); setServeOpen(false); }}
                                tabIndex={0}
                            >
                                NAAPE News
                            </Link>
                        </div>
                    )}

                    {/* Publications Dropdown - mobile */}
                    <button
                        className="flex items-center w-full py-2 font-medium hover:text-[#3970D8] transition"
                        aria-expanded={publicationsOpen}
                        aria-controls="mobile-publications-menu"
                        onClick={() => setPublicationsOpen((open) => !open)}
                        type="button"
                    >
                        Publications
                        <span className="ml-1">{publicationsOpen ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}</span>
                    </button>
                    {publicationsOpen && (
                        <div
                            id="mobile-publications-menu"
                            className="flex flex-col bg-white border-l border-[#E6EAF1] ml-5 pl-2 py-1"
                        >
                            <Link
                                href="/publications/magazines"
                                className="py-2 text-sm hover:text-[#3970D8] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                Magazines
                            </Link>
                            <Link
                                href="/publications/newsletters"
                                className="py-2 text-sm hover:text-[#3970D8] transition"
                                onClick={() => { setMobileOpen(false); setPublicationsOpen(false); }}
                                tabIndex={0}
                            >
                                Newsletters
                            </Link>
                        </div>
                    )}

                    <Link
                        href="/gallery"
                        className="py-2 hover:text-[#3970D8] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/contact"
                        className="py-2 hover:text-[#3970D8] transition font-medium"
                        onClick={() => setMobileOpen(false)}
                        tabIndex={0}
                    >
                        Contact
                    </Link>

                    <div className="flex flex-col gap-2 mt-2">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                            <NaapButton
                                className="w-full border-[#E3E6ED] bg-white text-[#2852B4] hover:bg-[#F5F7FA] text-[15px] font-semibold"
                            >
                                Log In
                            </NaapButton>
                        </Link>
                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                            <NaapButton className="w-full bg-[#2852B4] hover:bg-[#2347A0] text-white text-[15px] font-semibold">
                                Become a member
                            </NaapButton>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
