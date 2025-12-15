"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);

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

  // Adjust to ensure text is always centered for all items
  const baseMenuLink =
    "px-2.5 xl:px-3 py-2 font-bold transition focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] border-b-2 border-transparent uppercase tracking-wide text-[13px] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] flex items-center justify-center h-full text-center min-w-0 max-w-[155px] truncate justify-center items-center text-center";
  const activeMenuLink =
    "text-[color:var(--primary)] font-black border-b-[3px] border-[color:var(--primary)]";

  // Improved Login Button Handler (for Desktop Nav)
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!loginLoading) {
      setLoginLoading(true);
      router.push("/login");
    }
  };

  // Improved Login Button Handler (for Mobile Nav)
  const handleMobileLoginClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!loginLoading) {
      setLoginLoading(true);
      setMobileOpen(false);
      router.push("/login");
    }
  };

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
                <span className="ml-2 sm:ml-2 text-[15px] xs:text-[16px] sm:text-[18px] font-extrabold tracking-tight text-[color:var(--primary)] uppercase hidden sm:inline whitespace-nowrap leading-none group-hover:underline decoration-4 underline-offset-[8px] decoration-[color:var(--primary)] transition-all min-w-0 text-center">
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
              className="flex items-center gap-0.5 sm:gap-1 xl:gap-2 text-[#1A2752] font-semibold text-[13px] uppercase h-full py-1 min-w-0 w-full justify-center"
              style={{ width: "100%", minWidth: 0, justifyContent: "center", textAlign: "center" }}
            >
              {/* About group */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`${baseMenuLink} ${active.startsWith("/about") ? activeMenuLink : ""}`}
                    tabIndex={0}
                  >
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate text-center w-full">
                      About
                      <ChevronDown size={15} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-center">
                  <DropdownMenuItem asChild>
                    <Link href="/about/about-us" className="font-bold text-[color:var(--primary)]/90 text-[13px] text-center w-full flex justify-center">
                      About Us
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/nac-members" className="font-semibold text-[13px] text-center w-full flex justify-center">
                      NAC Members
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/organs-of-association" className="font-semibold text-[13px] text-center w-full flex justify-center">
                      Organs of Association
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/about/rights-and-responsibilites" className="font-semibold text-[13px] text-center w-full flex justify-center">
                      Rights &amp; Responsibilities
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Membership */}
              <Link
                href="/membership"
                className={`${baseMenuLink} ${active === "/membership" ? activeMenuLink : ""} text-center flex justify-center`}
                tabIndex={0}
                style={{ minWidth: 0, maxWidth: "140px", textAlign: "center" }}
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
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate text-center w-full">
                      News
                      <ChevronDown size={15} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-center">
                  <DropdownMenuItem asChild>
                    <Link href="/news/naape" className="font-bold text-[color:var(--primary)]/90 text-[13px] text-center w-full flex justify-center">
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
                    <span className="flex items-center gap-1 mx-auto justify-center min-w-0 truncate text-center w-full">
                      Publications
                      <ChevronDown size={15} />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-center">
                  <DropdownMenuItem asChild>
                    <Link href="/publication/members" className="font-semibold text-[13px] text-center w-full flex justify-center">
                      From Members
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/publication/naape" className="font-semibold text-[13px] text-center w-full flex justify-center">
                      From NAAPE
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Advertisement */}
              <Link
                href="/advertisement"
                className={`${baseMenuLink} ${active === "/advertisement" ? activeMenuLink : ""} text-center flex justify-center`}
                style={{ minWidth: 0, maxWidth: "160px", textAlign: "center" }}
                tabIndex={0}
              >
                Advertisement
              </Link>

              {/* Gallery */}
              <Link
                href="/gallery"
                className={`${baseMenuLink} ${active === "/gallery" ? activeMenuLink : ""} text-center flex justify-center`}
                style={{ minWidth: 0, maxWidth: "100px", textAlign: "center" }}
                tabIndex={0}
              >
                Gallery
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`${baseMenuLink} ${active === "/contact" ? activeMenuLink : ""} text-center flex justify-center`}
                style={{
                  position: "relative",
                  zIndex: 1,
                  minWidth: 0,
                  maxWidth: "100px",
                  marginRight: "0.35rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  textAlign: "center"
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
                  {/* Use a real button for login for instant UI feedback/click handling */}
                  <NaapButton
                    className="py-1.5 sm:py-2 px-4 border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[13px] font-extrabold min-w-[85px] sm:min-w-[105px] max-w-[112px] tracking-wide uppercase text-center truncate flex justify-center text-center"
                    style={{ letterSpacing: "0.035em" }}
                    onClick={handleLoginClick}
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging In..." : "Log In"}
                  </NaapButton>
                  <Link href="/register" tabIndex={0}>
                    <NaapButton
                      className="py-1.5 sm:py-2 px-4 bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[13px] font-extrabold min-w-[110px] sm:min-w-[145px] max-w-[146px] border-2 border-[color:var(--primary)] uppercase tracking-wide text-center truncate flex justify-center text-center"
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
                      <span className="inline-flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-xs sm:text-sm uppercase border-4 border-white">
                        {getInitials(user?.name)}
                      </span>
                      <span className="text-[12px] sm:text-[13px] text-[color:var(--primary)] font-black max-w-[100px] sm:max-w-[130px] truncate hidden sm:inline tracking-wide uppercase text-center">
                        {user?.name}
                      </span>
                      <ChevronDown size={16} className="text-[color:var(--primary)] sm:w-[17px] sm:h-[17px]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="min-w-[150px] sm:min-w-[160px] mt-2 rounded-xl !overflow-hidden border-2 border-[color:var(--primary)]/[.22] bg-white text-center"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="font-bold text-[13px] flex items-center gap-2 py-2 hover:bg-[color:var(--primary)]/16 hover:text-[color:var(--primary)] transition-colors text-center w-full justify-center"
                      >
                        <User2 className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="!text-red-600 cursor-pointer font-bold text-[13px] flex items-center gap-2 py-2 hover:bg-red-50 transition-all text-center w-full justify-center"
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

      {/* Mobile Navigation Drawer - items and groupings centrally aligned */}
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
            <span className="font-black text-[color:var(--primary)] text-base uppercase tracking-widest text-center w-full">
              Welcome to NAAPE
            </span>
            <span className="text-[11px] mt-0.5 font-semibold tracking-normal text-[#3654B2]/60 w-full text-center">
              United. Safe. Professional. Proud.
            </span>
          </div>
          {/* Section: Main Navigation Links (centralized text) */}
          <div className="flex flex-col gap-1 w-full items-center justify-center text-center">
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
                className={`py-2 px-2 w-full text-[13px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center flex justify-center items-center ${item.label === "Contact" ? "mt-1 mb-2" : ""}`}
                style={
                  item.label === "Contact"
                    ? {
                        marginTop: "0.22rem",
                        marginBottom: "0.5rem",
                        zIndex: 2,
                        position: "relative",
                        fontFamily: "inherit",
                        textAlign: "center"
                      }
                    : { textAlign: "center" }
                }
                onClick={() => setMobileOpen(false)}
                tabIndex={0}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {/* Section: Dropdown groupings (centralized dropdown content) */}
          <div className="flex flex-col gap-1 w-full items-center justify-center text-center">
            {/* News Dropdown - mobile */}
            <div className="w-full flex flex-col items-center text-center">
              <button
                className="flex items-center justify-center w-full py-2 px-2 text-[13px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center"
                aria-expanded={serveOpen}
                aria-controls="mobile-news-menu"
                onClick={() => setServeOpen((open) => !open)}
                type="button"
                style={{ textAlign: "center" }}
              >
                <span className="flex-1 text-center">News</span>
                <span className="flex-none ml-2">
                  {serveOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              </button>
              {serveOpen && (
                <div
                  id="mobile-news-menu"
                  className="flex flex-col items-center justify-center ml-4 pl-2 py-1 border-l-4 border-[color:var(--primary)]/40 text-center"
                >
                  <Link
                    href="/news/naape"
                    className="py-1.5 text-[13px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-center flex justify-center items-center w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setServeOpen(false);
                    }}
                    tabIndex={0}
                    style={{ textAlign: "center" }}
                  >
                    NAAPE News
                  </Link>
                </div>
              )}
            </div>

            {/* Publications Dropdown - mobile */}
            <div className="w-full flex flex-col items-center text-center">
              <button
                className="flex items-center justify-center w-full py-2 px-2 text-[13px] rounded-xl font-black hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 transition uppercase tracking-wider text-center"
                aria-expanded={publicationsOpen}
                aria-controls="mobile-publications-menu"
                onClick={() => setPublicationsOpen((open) => !open)}
                type="button"
                style={{ textAlign: "center" }}
              >
                <span className="flex-1 text-center">Publications</span>
                <span className="flex-none ml-2">
                  {publicationsOpen ? (
                    <ChevronUp size={15} />
                  ) : (
                    <ChevronDown size={15} />
                  )}
                </span>
              </button>
              {publicationsOpen && (
                <div
                  id="mobile-publications-menu"
                  className="flex flex-col items-center justify-center ml-4 pl-2 py-1 border-l-4 border-[color:var(--primary)]/40 text-center"
                >
                  <Link
                    href="/publication/members"
                    className="py-1.5 text-[13px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-center flex justify-center items-center w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setPublicationsOpen(false);
                    }}
                    tabIndex={0}
                    style={{ textAlign: "center" }}
                  >
                    From Members
                  </Link>
                  <Link
                    href="/publication/naape"
                    className="py-1.5 text-[13px] rounded font-bold hover:text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 uppercase transition text-center flex justify-center items-center w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      setPublicationsOpen(false);
                    }}
                    tabIndex={0}
                    style={{ textAlign: "center" }}
                  >
                    From NAAPE
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* Section: Authentication */}
          <div className="flex flex-col gap-2 mt-6 w-full items-center justify-center text-center">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2 w-full items-center justify-center text-center">
                {/* REAL BUTTON ensures instant feedback on tap */}
                <NaapButton
                  className="w-full border-[2.5px] border-[color:var(--primary)] bg-white text-[color:var(--primary)] hover:bg-[color:var(--primary)]/10 text-[13px] font-extrabold uppercase py-1.5 text-center flex justify-center items-center"
                  onClick={handleMobileLoginClick}
                  disabled={loginLoading}
                >
                  {loginLoading ? "Logging In..." : "Log In"}
                </NaapButton>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="w-full flex justify-center">
                  <NaapButton className="w-full px-2 bg-[color:var(--primary)] hover:bg-[color:var(--primary)]/90 text-white text-[13px] font-extrabold border-2 border-[color:var(--primary)] uppercase py-1.5 text-center flex justify-center items-center">
                    Become a member
                  </NaapButton>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white border-2 border-[color:var(--primary)] font-bold w-full uppercase transition justify-center text-center"
                      aria-label="Open account menu"
                      type="button"
                    >
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[color:var(--primary)] text-white font-extrabold text-xs uppercase border-4 border-white">
                        {getInitials(user?.name)}
                      </span>
                      <span className="text-[12px] text-[color:var(--primary)] font-black truncate tracking-wide text-center max-w-[80px]">
                        {user?.name}
                      </span>
                      <ChevronDown size={16} className="text-[color:var(--primary)]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    sideOffset={7}
                    className="min-w-[135px] mt-2 rounded-xl border-2 border-[color:var(--primary)]/[.22] !overflow-hidden bg-white text-center"
                  >
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard"
                        className="font-bold text-[13px] flex items-center gap-2 py-1.5 hover:bg-[color:var(--primary)]/12 hover:text-[color:var(--primary)] transition-colors uppercase text-center w-full justify-center"
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
                      className="!text-red-600 cursor-pointer font-bold text-[13px] flex items-center gap-2 py-1.5 hover:bg-red-50 transition-all uppercase text-center w-full justify-center"
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
