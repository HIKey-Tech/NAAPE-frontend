"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";
import { NaapButton } from "@/components/ui/custom/button.naap";

export default function TopNavbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [serveOpen, setServeOpen] = useState(false);
    const [publicationsOpen, setPublicationsOpen] = useState(false);

    return (
        <nav className="w-full sticky top-0 left-0 z-30 bg-white border-b border-[#E6EAF1] shadow-sm px-6 py-2  flex items-center justify-between relative">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="NAAPE Logo"
                        width={100}
                        height={2}
                        className="object-contain h-fit"
                        priority
                    />
                </Link>
            </div>

            {/* Hamburger menu for mobile */}
            <button
                className="md:hidden p-2 "
                aria-label="Open main menu"
                onClick={() => setMobileOpen((prev) => !prev)}
            >
                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center w-full gap-5 text-[#0A1331] font-medium text-[15px]">
                <Link href="/about" className="hover:text-[#3970D8] transition">
                    About
                </Link>
                <Link href="/membership" className="hover:text-[#3970D8] transition">
                    Membership
                </Link>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="px-2 font-medium hover:text-[#3970D8]">
                            News
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem asChild>
                            <Link href="/serve/option1">Option 1</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/serve/option2">Option 2</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="px-2 font-medium hover:text-[#3970D8]">
                            Publications
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

                <Link href="/gallery" className="hover:text-[#3970D8] transition">
                    Gallery
                </Link>
                <Link href="/contact" className="hover:text-[#3970D8] transition">
                    Contact
                </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                    <NaapButton
                        // variant="outline"
                        className="border-[#E3E6ED] bg-white border w-full h-full text-[#2852B4] hover:bg-[#F5F7FA] text-[15px] font-semibold"
                    >
                        Log In
                    </NaapButton>
                </Link>
                <Link href="/register">
                    <NaapButton
                        className="bg-[#2852B4] rounded-none hover:bg-[#2347A0] text-white text-[15px] font-semibold"
                    >
                        Become a member
                    </NaapButton>
                </Link>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div className="absolute left-0 top-[100%] w-full z-40 bg-white border-t border-[#E6EAF1] shadow-md flex flex-col px-4 py-3 gap-2 md:hidden animate-slideDown">
                    <Link
                        href="/about"
                        className="py-2 hover:text-[#3970D8] transition"
                        onClick={() => setMobileOpen(false)}
                    >
                        About
                    </Link>
                    <Link
                        href="/membership"
                        className="py-2 hover:text-[#3970D8] transition"
                        onClick={() => setMobileOpen(false)}
                    >
                        Membership
                    </Link>
                    {/* Serve Dropdown - mobile */}
                    <div className="relative">
                        <button
                            className="flex items-center w-full py-2 font-medium hover:text-[#3970D8] transition"
                            onClick={() => setServeOpen((open) => !open)}
                        >
                            News
                            <svg
                                className={`ml-2 transition-transform duration-200 ${serveOpen ? 'rotate-180' : ''}`}
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 9l6 6 6-6" stroke="#0A1331" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {serveOpen && (
                            <div className="flex flex-col bg-white border rounded shadow px-3 mt-1">
                                <Link
                                    href="/serve/option1"
                                    className="py-2 text-sm hover:text-[#3970D8] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Option 1
                                </Link>
                                <Link
                                    href="/serve/option2"
                                    className="py-2 text-sm hover:text-[#3970D8] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Option 2
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Publications Dropdown - mobile */}
                    <div className="relative">
                        <button
                            className="flex items-center w-full py-2 font-medium hover:text-[#3970D8] transition"
                            onClick={() => setPublicationsOpen((open) => !open)}
                        >
                            Publications
                            <svg
                                className={`ml-2 transition-transform duration-200 ${publicationsOpen ? 'rotate-180' : ''}`}
                                width="16"
                                height="16"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path d="M6 9l6 6 6-6" stroke="#0A1331" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {publicationsOpen && (
                            <div className="flex flex-col bg-white border rounded shadow px-3 mt-1">
                                <Link
                                    href="/publications/magazines"
                                    className="py-2 text-sm hover:text-[#3970D8] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Magazines
                                </Link>
                                <Link
                                    href="/publications/newsletters"
                                    className="py-2 text-sm hover:text-[#3970D8] transition"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Newsletters
                                </Link>
                            </div>
                        )}
                    </div>
                    <Link
                        href="/gallery"
                        className="py-2 hover:text-[#3970D8] transition"
                        onClick={() => setMobileOpen(false)}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/contact"
                        className="py-2 hover:text-[#3970D8] transition"
                        onClick={() => setMobileOpen(false)}
                    >
                        Contact
                    </Link>
                    <div className="flex flex-col gap-2 mt-2">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                            <Button
                                variant="outline"
                                className="w-full border-[#E3E6ED] bg-white text-[#2852B4] hover:bg-[#F5F7FA] text-[15px] font-semibold"
                            >
                                Log In
                            </Button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileOpen(false)}>
                            <Button className="w-full bg-[#2852B4] hover:bg-[#2347A0] text-white text-[15px] font-semibold">
                                Become a member
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
