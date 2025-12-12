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

// Utility: Responsive width padding class for max screen support
const NAVBAR_MAX_WIDTH = "max-w-[1440px]"; // change this if your layout is wider/smaller
const DESKTOP_NAV_MIN_WIDTH = 1160; // px, should be high enough for all items + buttons

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

  // Tighter padding & spacing, min-w-0 to avoid overflow, max-w for responsive control
  const baseMenuLink =
    "px-2.5 xl:px-3 py-2 font-bold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] border-b-2 border-transparent uppercase tracking-wide text-[15px] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] flex items-center justify-center h-full text-center min-w-0 max-w-[155px] truncate";
  const activeMenuLink =
    "text-[color:var(--primary)] font-black border-b-[3px] border-[color:var(--primary)]";

  return (
    <nav className="w-full sticky top-0 left-0 z-40 bg-white border-b-2 border-[color:var(--primary)] flex items-center justify-center relative py-0">
      {/* Outer centered container, limit width */}
      <div className={`w-full flex flex-col items-center justify-center`}>
        {/* Main navbar row: set max-w and responsive px, hide overflow */}
        <div
          className={`w-full ${NAVBAR_MAX_WIDTH} mx-auto flex items-center justify-between px-2 xs:px-3 sm:px-4 min-h-[64px] h-[64px] sm:min-h-[72px] sm:h-[72px]`}
          style={{
            minWidth: 0,
            overflowX: "hidden",
          }}
        >
          {/* Logo & Hamburger */}
          <div className="flex flex-row items-center px-2 sm:px-6 justify-between min-w-0 h-full shrink-0">
            {/* Logo Group */}
            <div className="flex flex-row items-center gap-2 sm:gap-4 min-w-0 h-full shrink-0">
              <Link
                href="/"
                className="flex items-center group min-w-0 h-full"
                aria-label="Go to NAAPE homepage"
                tabIndex={0}
              >
                <Image
                  src="/logo.png"
                  alt="NAAPE Logo"
                  width={48}
                  height={48}
                  className="object-contain h-[40px] w-[40px] xs:h-[46px] xs:w-[46px] sm:h-[53px] sm:w-[53px] bg-white rounded-lg border-[2.5px] border-[color:var(--primary)]"
                  priority
                />
                <span className="ml-2 sm:ml-2 text-[17px] xs:text-[18px] sm:text-[20px] font-extrabold tracking-tight text-[color:var(--primary)] uppercase hidden sm:inline whitespace-nowrap leading-none group-hover:underline decoration-4 underline-offset-[8px] decoration-[color:var(--primary)] transition-all min-w-0">
                  NAAPE
                </span>
              </Link>
            </div>
            {/* Hamburger for mobile only */}
            <button
              className="md:hidden ml-2 p-2 flex items-center justify-center rounded-xl border-2 border-[color:var(--primary)] bg-white focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <X size={25} className="text-[color:var(--primary)]" />
              ) : (
                <Menu size={23} className="text-[color:var(--primary)]" />
              )}
            </button>
          </div>

          {/* Desktop Navigation Center */}
          <div
            className="hidden md:flex grow flex-shrink-[2] basis-0 items-center justify-center min-w-0"
            style={{
              maxWidth: "calc(100vw - 375px)",
            }}
          >
            <div
              className="flex items-center gap-0.5 sm:gap-1 xl:gap-2 text-[#1A2752] font-semibold text-[15px] uppercase h-full py-1 min-w-0"
              style={{ width: "100%", minWidth: 0 }}
            >
              {/* About group */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${baseMenuLink} ${active.startsWith("/about") ? activeMenuLink : ""}`}
                    tabIndex={0}
                  >
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate">
                      About
                      <ChevronDown size={17} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/about/about-us" className="font-bold text-[color:var(--primary)]/90 text-[15px]">
                      About Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/nac-members" className="font-semibold text-[15px]">
                      NAC Members
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/organs-of-association" className="font-semibold text-[15px]">
                      Organs of Association
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/rights-and-responsibilites" className="font-semibold text-[15px]">
                      Rights &amp; Responsibilities
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Membership */}
              <Link
                href="/membership"
                className={`${baseMenuLink} ${active === "/membership" ? activeMenuLink : ""}`}
                tabIndex={0}
                style={{ minWidth: 0, maxWidth: "140px" }}
              >
                Membership
              </Link>

              {/* News group */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${baseMenuLink} ${active.startsWith("/news") ? activeMenuLink : ""}`}
                    tabIndex={0}
                  >
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate">
                      News
                      <ChevronDown size={17} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/news/naape" className="font-bold text-[color:var(--primary)]/90 text-[15px]">
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
                    className={`${baseMenuLink} ${active.startsWith("/publications") ? activeMenuLink : ""}`}
                    tabIndex={0}
                  >
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate">
                      Publications
                      <ChevronDown size={17} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/publication/members" className="font-semibold text-[15px]">
                      From Members
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/publication/naape" className="font-semibold text-[15px]">
                      From NAAPE
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advertisement */}
              <Link
                href="/advertisement"
                className={`${baseMenuLink} ${active === "/advertisement" ? activeMenuLink : ""}`}
                style={{ minWidth: 0, maxWidth: "160px" }}
                tabIndex={0}
              >
                Advertisement
              </Link>

              {/* Gallery */}
              <Link
                href="/gallery"
                className={`${baseMenuLink} ${active === "/gallery" ? activeMenuLink : ""}`}
                style={{ minWidth: 0, maxWidth: "100px" }}
                tabIndex={0}
              >
                Gallery
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`${baseMenuLink} ${active === "/contact" ? activeMenuLink : ""}`}
                style={{
                  position: "relative",
                  zIndex: 1,
                  minWidth: 0,
                  maxWidth: "100px",
                  marginRight: "0.35rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                tabIndex={0}
              >
                Contact
              </Link>
            </div>
          </div>

          {/* User auth/buttons group - always right, vertically centered */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 ml-1 sm:ml-2 xl:ml-4 justify-end h-full shrink-0">
            {/* Auth section (desktop only) */}
            <div
              className="hidden md:flex items-center px-2 gap-2 justify-end min-w-0"
              style={{
                minWidth: "200px",
                maxWidth: "285px",
              }}
            >
              {!isAuthenticated ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <Link href="/login" tabIndex={0}>
                    <NaapButton
                      className="py-1.5 sm:py-2 px-4 border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[15px] font-extrabold min-w-[85px] sm:min-w-[105px] max-w-[112px] tracking-wide uppercase text-center truncate"
                      style={{ letterSpacing: "0.035em" }}
                    >
                      Log In
                    </NaapButton>
                  </Link>
                  <Link href="/register" tabIndex={0}>
                    <NaapButton
                      className="py-1.5 sm:py-2 px-4 bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[15px] font-extrabold min-w-[110px] sm:min-w-[145px] max-w-[146px] border-2 border-[color:var(--primary)] uppercase tracking-wide text-center truncate"
                      style={{ letterSpacing: "0.04em" }}
                    >
                      Become a member
                    </NaapButton>
                  </Link>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-2xl bg-white border-2 border-[color:var(--primary)] font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] min-w-[44px] sm:min-w-[50px] transition h-full justify-center text-center"
                      aria-label="Open account menu"
                      type="button"
                    >
                      <span className="inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-sm sm:text-base uppercase border-4 border-white">
                        {getInitials(user?.name)}
                      </span>
                      <span className="text-[14px] sm:text-[15px] text-[color:var(--primary)] font-black max-w-[100px] sm:max-w-[130px] truncate hidden sm:inline tracking-wide uppercase text-left">
                        {user?.name}
                      </span>
                      <ChevronDown size={19} className="text-[color:var(--primary)] sm:w-[21px] sm:h-[21px]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[170px] sm:min-w-[185px] mt-2 rounded-xl !overflow-hidden border-2 border-[color:var(--primary)]/[.22] bg-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="font-bold text-[15px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/16 hover:text-[color:var(--primary)] transition-colors text-left"
                      >
                        <User2 className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="!text-red-600 cursor-pointer font-bold text-[15px] flex items-center gap-2 py-2 hover:bg-red-50 transition-all text-left"
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
      </div>

      {/* Mobile Navigation Drawer - content centered and harmonized spacing */}
      {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          id="mobile-nav"
          className="absolute left-0 top-[100%] w-full z-50 bg-white border-t-2 border-[color:var(--primary)] flex flex-col items-center px-4 py-6 gap-4 md:hidden shadow-xl overflow-x-auto"
        >
          {/* Welcome header */}
          <div className="mb-3 flex flex-col items-center text-center w-full">
            <span className="font-black text-[color:var(--primary)] text-lg uppercase tracking-widest text-center w-full">
              Welcome to NAAPE
            </span>
            <span className="text-xs mt-0.5 font-semibold tracking-normal text-[#3654B2]/60 w-full text-center">
              United. Safe. Professional. Proud.
            </span>
          </div>
          {/* Section: Main Navigation Links */}
          <div className="flex flex-col gap-1 w-full items-center">
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
                className={`py-2.5 px-2.5 w-full text-[15px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center 
                  ${item.label === "Contact" ? "mt-1 mb-2" : ""}`}
                style={
                  item.label === "Contact"
                    ? {
                        marginTop: "0.22rem",
                        marginBottom: "0.5rem",
                        zIndex: 2,
                        position: "relative",
                        fontFamily: "inherit",
                      }
                    : undefined
                }
                onClick={() => setMobileOpen(false)}
                tabIndex={0}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Section: Dropdown groupings */}
          <div className="flex flex-col gap-1 w-full items-center">
            {/* News Dropdown - mobile */}
            <div className="w-full">
              <button
                className="flex items-center justify-between w-full py-2.5 px-2.5 text-[15px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center"
                aria-expanded={serveOpen}
                aria-controls="mobile-news-menu"
                onClick={() => setServeOpen((open) => !open)}
                type="button"
              >
                <span className="flex-1 text-center">News</span>
                <span className="flex-none">
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
                    className="py-2 text-[15px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-left"
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
            <div className="w-full">
              <button
                className="flex items-center justify-between w-full py-2.5 px-2.5 text-[15px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center"
                aria-expanded={publicationsOpen}
                aria-controls="mobile-publications-menu"
                onClick={() => setPublicationsOpen((open) => !open)}
                type="button"
              >
                <span className="flex-1 text-center">Publications</span>
                <span className="flex-none">
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
                    className="py-2 text-[15px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-left"
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
                    className="py-2 text-[15px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-left"
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
          <div className="flex flex-col gap-2 mt-6 w-full items-center">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 w-full items-center">
                <Link href="/login" onClick={() => setMobileOpen(false)} className="w-full">
                  <NaapButton className="w-full border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[15px] font-extrabold uppercase py-2 text-center">
                    Log In
                  </NaapButton>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full">
                  <NaapButton className="w-full bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[15px] font-extrabold border-2 border-[color:var(--primary)] uppercase py-2 text-center">
                    Become a member
                  </NaapButton>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-stretch w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border-2 border-[color:var(--primary)] font-bold w-full uppercase transition justify-start text-center"
                      aria-label="Open account menu"
                      type="button"
                    >
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-sm uppercase border-4 border-white">
                        {getInitials(user?.name)}
                      </span>
                      <span className="text-[15px] text-[color:var(--primary)] font-black truncate tracking-wide text-left max-w-[90px]">
                        {user?.name}
                      </span>
                      <ChevronDown size={20} className="text-[color:var(--primary)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={7}
                    className="min-w-[155px] mt-2 rounded-xl border-2 border-[color:var(--primary)]/[.22] !overflow-hidden bg-white"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="font-bold text-[15px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/12 hover:text-[color:var(--primary)] transition-colors uppercase text-left"
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
                      className="!text-red-600 cursor-pointer font-bold text-[15px] flex items-center gap-2 py-2 hover:bg-red-50 transition-all uppercase text-left"
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
