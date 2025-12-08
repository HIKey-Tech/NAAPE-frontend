"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ChevronUp, LogOut, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useAuth } from "@/context/authcontext";

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
    if (typeof window !== "undefined") setActive(window.location.pathname);
  }, []);

  function getInitials(name?: string) {
    if (!name) return "U";
    const names = name.trim().split(" ");
    const initials = (names[0]?.[0] ?? "") + (names[1]?.[0] ?? "");
    return initials.toUpperCase();
  }

  // Consistent menu link styling for both desktop and mobile
  const baseMenuLink =
    "px-5 py-2.5 rounded-xl font-bold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] border-b-2 border-transparent uppercase tracking-wide text-[16.5px] hover:bg-[color:var(--primary)]/[.08] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]";
  const activeMenuLink =
    "text-[color:var(--primary)] bg-[color:var(--primary)]/14 font-black border-b-[3.5px] border-[color:var(--primary)]";

  // px-4 sm:px-6 md:px-10 xl:px-16
  return (
    <nav className="w-full sticky top-0 left-0 z-40 bg-white border-b-2 border-[color:var(--primary)]  py-2 md:py-0 flex items-stretch justify-between relative">
      {/* Main navbar horizontal container */}
      <div className="flex w-full flex-row items-center justify-between min-h-[64px] h-[64px] sm:min-h-[72px] sm:h-[72px] px-4">
        {/* Branded Logo */}
        <div className="flex flex-row items-center gap-3 sm:gap-4 flex-shrink-0 min-w-0 h-full pl-1 sm:pl-0">
          <Link
            href="/"
            className="flex items-center group min-w-0 h-full"
            aria-label="Go to NAAPE homepage"
          >
            <Image
              src="/logo.png"
              alt="NAAPE Logo"
              width={53}
              height={53}
              className="object-contain h-[42px] w-[42px] xs:h-[48px] xs:w-[48px] sm:h-[53px] sm:w-[53px] bg-white rounded-lg border-[2.5px] border-[color:var(--primary)]"
              priority
            />
            <span className="ml-2 sm:ml-3 text-[21px] xs:text-[24px] sm:text-[25px] font-extrabold tracking-tight text-[color:var(--primary)] uppercase hidden sm:inline whitespace-nowrap leading-none group-hover:underline decoration-4 underline-offset-[8px] decoration-[color:var(--primary)] transition-all">
              NAAPE
            </span>
          </Link>
        </div>

        {/* Central navigation group */}
        <div className="hidden md:flex items-center justify-center h-full ">
          <div className="flex items-center gap-2 justify-center md:gap-2 xl:gap-2 2xl:gap-2 text-[#1A2752] font-semibold text-[16.5px] uppercase tracking-wide h-full py-1">
            {/* About group */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${baseMenuLink} flex items-center gap-1 ${active.startsWith("/about") ? activeMenuLink : ""} h-full`}
                  tabIndex={0}
                >
                  <span className="flex items-center gap-1">
                    About
                    <ChevronDown size={18} />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/about/about-us" className="font-bold text-[color:var(--primary)]/90 text-[16.5px]">
                    About Us
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/nac-members" className="font-semibold text-[16.5px]">
                    NAC Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/organs-of-association" className="font-semibold text-[16.5px]">
                    Organs of Association
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/rights-and-responsibilites" className="font-semibold text-[16.5px]">
                    Rights &amp; Responsibilities
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Membership */}
            <Link
              href="/membership"
              className={`${baseMenuLink} ${active === "/membership" ? activeMenuLink : ""} h-full flex items-center`}
            >
              Membership
            </Link>

            {/* News group */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${baseMenuLink} flex items-center gap-1 ${active.startsWith("/news") ? activeMenuLink : ""} h-full`}
                  tabIndex={0}
                >
                  <span className="flex items-center gap-1">
                    News
                    <ChevronDown size={18} />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/news/naape" className="font-bold text-[color:var(--primary)]/90 text-[16.5px]">
                    NAAPE News
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Publications group */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`${baseMenuLink} flex items-center gap-1 ${active.startsWith("/publications") ? activeMenuLink : ""} h-full`}
                  tabIndex={0}
                >
                  <span className="flex items-center gap-1">
                    Publications
                    <ChevronDown size={18} />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/publication/members" className="font-semibold text-[16.5px]">
                    From Members
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/publication/naape" className="font-semibold text-[16.5px]">
                    From NAAPE
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Advertisement */}
            <Link
              href="/advertisement"
              className={`${baseMenuLink} ${active === "/advertisement" ? activeMenuLink : ""} h-full flex items-center`}
            >
              Advertisement
            </Link>

            {/* Gallery */}
            <Link
              href="/gallery"
              className={`${baseMenuLink} ${active === "/gallery" ? activeMenuLink : ""} h-full flex items-center`}
            >
              Gallery
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`${baseMenuLink} ${active === "/contact" ? activeMenuLink : ""} h-full flex items-center`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* User auth/buttons group */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 ml-1.5 sm:ml-3 xl:ml-8 h-full pr-1 sm:pr-0">
          {/* Hamburger menu button (mobile only) */}
          <button
            className="md:hidden p-1.5 xs:p-2 sm:p-2.5 ml-1 sm:ml-2 flex items-center justify-center rounded-xl border-2 border-[color:var(--primary)] bg-white focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
            aria-label="Open main menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={28} className="text-[color:var(--primary)]" /> : <Menu size={26} className="text-[color:var(--primary)]" />}
          </button>
          {/* Auth section (desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <NaapButton
                    className="py-1.5 sm:py-2 px-4 sm:px-5 border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[16.5px] font-extrabold min-w-[100px] sm:min-w-[120px] tracking-wide uppercase"
                    style={{ letterSpacing: "0.04em" }}
                  >
                    Log In
                  </NaapButton>
                </Link>
                <Link href="/register">
                  <NaapButton
                    className="py-1.5 sm:py-2 px-5 bg-[color:var(--primary)]  hover:bg-[color:var(--primary)]/90 text-white text-[16.5px] font-extrabold min-w-[140px] sm:min-w-[180px] border-2 border-[color:var(--primary)] uppercase tracking-wide"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    Become a member
                  </NaapButton>
                </Link>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white border-2 border-[color:var(--primary)] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] min-w-[44px] sm:min-w-[50px] transition h-full"
                    aria-label="Open account menu"
                    type="button"
                  >
                    <span className="inline-flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-base sm:text-lg uppercase border-4 border-white">
                      {getInitials(user?.name)}
                    </span>
                    <span className="text-[15px] sm:text-[17px] text-[color:var(--primary)] font-black max-w-[108px] sm:max-w-[148px] truncate hidden sm:inline tracking-wide uppercase">
                      {user?.name}
                    </span>
                    <ChevronDown size={20} className="text-[color:var(--primary)] sm:w-[22px] sm:h-[22px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[190px] sm:min-w-[210px] mt-2 rounded-xl !overflow-hidden border-2 border-[color:var(--primary)]/[.22] bg-white"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="font-bold text-[16.5px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/16 hover:text-[color:var(--primary)] transition-colors"
                    >
                      <User2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="!text-red-600 cursor-pointer font-bold text-[16.5px] flex items-center gap-2 py-2 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          id="mobile-nav"
          className="absolute left-0 top-[100%] w-full z-50 bg-white border-t-2 border-[color:var(--primary)] flex flex-col px-4 py-5 gap-3 md:hidden shadow-xl"
        >
          {/* Welcome header */}
          <div className="mb-3 flex flex-col items-center text-center">
            <span className="font-black text-[color:var(--primary)] text-xl uppercase tracking-widest">
              Welcome to NAAPE
            </span>
            <span className="text-xs mt-0.5 font-semibold tracking-normal text-[#3654B2]/60">
              United. Safe. Professional. Proud.
            </span>
          </div>
          {/* Section: Main Navigation Links */}
          <div className="flex flex-col gap-1">
            {[
              { href: "/about", label: "About" },
              { href: "/membership", label: "Membership" },
              { href: "/advertisement", label: "Advertisement" },
              { href: "/gallery", label: "Gallery" },
              { href: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-3 px-2.5 text-[17px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider"
                onClick={() => setMobileOpen(false)}
                tabIndex={0}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Section: Dropdown groupings */}
          <div className="flex flex-col gap-1">
            {/* News Dropdown - mobile */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 px-2.5 text-[17px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider"
                aria-expanded={serveOpen}
                aria-controls="mobile-news-menu"
                onClick={() => setServeOpen((open) => !open)}
                type="button"
              >
                <span>News</span>
                <span>
                  {serveOpen ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
                </span>
              </button>
              {serveOpen && (
                <div
                  id="mobile-news-menu"
                  className="flex flex-col ml-5 pl-3 py-1 border-l-4 border-[color:var(--primary)]/40"
                >
                  <Link
                    href="/news/naape"
                    className="py-2 text-base rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition"
                    onClick={() => {
                      setMobileOpen(false);
                      setServeOpen(false);
                    }}
                    tabIndex={0}
                  >
                    NAAPE News
                  </Link>
                </div>
              )}
            </div>

            {/* Publications Dropdown - mobile */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 px-2.5 text-[17px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider"
                aria-expanded={publicationsOpen}
                aria-controls="mobile-publications-menu"
                onClick={() => setPublicationsOpen((open) => !open)}
                type="button"
              >
                <span>Publications</span>
                <span>
                  {publicationsOpen ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </span>
              </button>
              {publicationsOpen && (
                <div
                  id="mobile-publications-menu"
                  className="flex flex-col ml-5 pl-3 py-1 border-l-4 border-[color:var(--primary)]/40"
                >
                  <Link
                    href="/publication/members"
                    className="py-2 text-base rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition"
                    onClick={() => {
                      setMobileOpen(false);
                      setPublicationsOpen(false);
                    }}
                    tabIndex={0}
                  >
                    From Members
                  </Link>
                  <Link
                    href="/publication/naape"
                    className="py-2 text-base rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition"
                    onClick={() => {
                      setMobileOpen(false);
                      setPublicationsOpen(false);
                    }}
                    tabIndex={0}
                  >
                    From NAAPE
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Section: Authentication */}
          <div className="flex flex-col gap-2 mt-5">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <NaapButton className="w-full border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[16.5px] font-extrabold uppercase py-2">
                    Log In
                  </NaapButton>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <NaapButton className="w-full bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[16.5px] font-extrabold border-2 border-[color:var(--primary)] uppercase py-2">
                    Become a member
                  </NaapButton>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white border-2 border-[color:var(--primary)] font-bold w-full uppercase transition"
                      aria-label="Open account menu"
                      type="button"
                    >
                      <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-base uppercase border-4 border-white">
                        {getInitials(user?.name)}
                      </span>
                      <span className="text-[16.5px] text-[color:var(--primary)] font-black truncate tracking-wide">
                        {user?.name}
                      </span>
                      <ChevronDown size={21} className="text-[color:var(--primary)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={7}
                    className="min-w-[165px] mt-2 rounded-xl border-2 border-[color:var(--primary)]/[.22] !overflow-hidden bg-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="font-bold text-[16px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/12 hover:text-[color:var(--primary)] transition-colors uppercase"
                      >
                        <User2 className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="!text-red-600 cursor-pointer font-bold text-[16px] flex items-center gap-2 py-2 hover:bg-red-50 transition-all uppercase"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
