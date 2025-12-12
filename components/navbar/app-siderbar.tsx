"use client";

import {
  FaHome,
  FaNewspaper,
  FaBook,
  FaPlusSquare,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaComments,
  FaSignOutAlt,
  FaCreditCard,
  FaIdBadge,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";

/** --- Enhanced Style constants for better hierarchy --- */
const SIDEBAR_WIDTH = 300;
const SECTION_LABEL =
  "text-[.83rem] font-bold text-[#204a7a] uppercase tracking-[0.17em] pl-2 py-1 mt-8 mb-1 opacity-80";
const SECTION_TITLE =
  "text-base font-black text-[#15407c] uppercase tracking-wider mb-[2px] mt-7 pl-2";
const NAV_ITEM_BASE =
  "flex items-center w-full py-2.5 px-4 rounded-lg text-[#16355D] text-[15px] font-medium hover:bg-[#f0f5fc] transition cursor-pointer select-none gap-2";
const NAV_ITEM_ACTIVE =
  "text-[#15407c] bg-[#e2eaf6] font-extrabold shadow-[inset_3px_0_0_0_#15407c]";
const SIGNOUT_BTN =
  "flex items-center w-full py-2.5 px-4 rounded-lg text-[#a32424] font-bold hover:bg-[#fae9ea] transition cursor-pointer select-none gap-2";
const PROFILE_NAME = "text-[16px] font-bold text-[#15407c] truncate";
const PROFILE_EMAIL = "text-xs text-[#6782a9] truncate";
const PROFILE_AVATAR_RING = "ring-2 ring-[#cbdeea] shadow-md";
const SECTION_DIVIDER =
  "border-t border-[#e4ecf7] w-full mx-auto my-4";
const DROPDOWN_BTN =
  "flex items-center w-full py-2.5 px-4 rounded-lg hover:bg-[#f0f5fc] transition cursor-pointer select-none gap-2 text-[#204a7a]";
const DROPDOWN_ICON = "text-[1.19em]";
const DROPDOWN_ARROW = "ml-auto";
const LIST_RESET =
  "list-none p-0 m-0 flex flex-col gap-y-1 gap-x-0";

/** --- Type definitions --- */
type User = {
  name?: string;
  email?: string;
  avatarUrl?: string;
};

type NavLink = {
  label: string;
  icon: React.ElementType;
  href?: string;
  group?: string;
};

/** --- Links config --- */
const newsPublicationsLinks: NavLink[] = [
  { label: "All News", icon: FaNewspaper, href: "/news", group: "News" },
  { label: "All Publications", icon: FaBook, href: "/publications", group: "Publications" },
  { label: "Create Publications", icon: FaPlusSquare, href: "/publications/new", group: "Publications" },
  { label: "My Publications", icon: FaBook, href: "/publications/mine", group: "Publications" },
];

const navLinksMain: NavLink[] = [
  { label: "Home", icon: FaHome, href: "/dashboard" },
  { label: "Training & Certifications", icon: FaChalkboardTeacher, href: "/training" },
  { label: "Events", icon: FaCalendarAlt, href: "/member/events" },
  { label: "Forum", icon: FaComments, href: "/forum" },
];

const navLinksSecondary: NavLink[] = [
  { label: "Subscription", icon: FaIdBadge, href: "/subscription" },
  { label: "Payment History", icon: FaCreditCard, href: "/payments" },
];

function getUserInitials(user: User) {
  if (user && user.name) {
    return user.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  if (user && user.email) {
    return user.email[0]?.toUpperCase() ?? "?";
  }
  return "?";
}

// DropdownNavItem visually distinguished
function DropdownNavItem({
  label,
  icon: Icon,
  children,
  isActive,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(isActive);
  return (
    <li className="w-full">
      <button
        type="button"
        className={`${DROPDOWN_BTN} ${isActive ? "bg-[#eaf3fc] text-[#15407c] font-bold" : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon className={DROPDOWN_ICON} />
        <span className="flex-1 text-left tracking-tight">{label}</span>
        <span className={DROPDOWN_ARROW}>
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      <ul className={`pl-5 border-l-[2.5px] border-[#eaf3fc] my-1 ml-2 ${open ? "block" : "hidden"} transition-all duration-150`}>
        {open && children}
      </ul>
    </li>
  );
}

// General Nav Item (as button or link)
type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  asButton?: boolean;
  disabled?: boolean;
};

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
  asButton = false,
  disabled = false,
}: NavItemProps) {
  if (asButton) {
    return (
      <li className="w-full">
        <button
          type="button"
          disabled={disabled}
          className={`${SIGNOUT_BTN} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          onClick={disabled ? undefined : onClick}
        >
          <Icon className="text-[1.14em]" />
          <span>{label}</span>
        </button>
      </li>
    );
  }
  return (
    <li className="w-full">
      <Link
        href={href || "#"}
        className={`${NAV_ITEM_BASE} ${active ? NAV_ITEM_ACTIVE : ""} `}
        aria-current={active ? "page" : undefined}
      >
        <Icon className="text-[1.14em]" />
        <span className="font-medium">{label}</span>
      </Link>
    </li>
  );
}

// Profile in sidebar footer with better layout/visual distinction
function SidebarProfileCard({ user }: { user: User }) {
  if (!user || (!user.name && !user.email)) return null;
  return (
    <div className="flex items-center gap-3 px-3 py-4 bg-[#e8f0fb] rounded-xl shadow-sm min-w-0">
      <div
        className={`w-11 h-11 rounded-full overflow-hidden bg-[#e5edf8] flex justify-center items-center text-[#15407c] text-[20px] font-bold border-2 border-[#c9daf9] ${PROFILE_AVATAR_RING}`}
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || user.email || "User Avatar"}
            width={44}
            height={44}
            className="object-cover w-11 h-11 rounded-full"
          />
        ) : (
          <span>{getUserInitials(user)}</span>
        )}
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <span className={PROFILE_NAME}>{user.name || "Loading..."}</span>
        <span className={PROFILE_EMAIL}>{user.email}</span>
      </div>
    </div>
  );
}

/** --- Responsive Sidebar --- */
export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close sidebar when navigating to a new path (improves UX)
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to sign out?")
    ) {
      toast.promise(
        (async () => {
          await logout();
        })(),
        {
          loading: "Signing out...",
          success: "Signed out successfully.",
          error: (err) =>
            err?.message
              ? `Failed to sign out: ${err.message}`
              : "An error occurred signing out.",
        }
      );
    }
  }, [logout]);

  // Memoized NavItems generation
  const navItemsMain = useMemo(
    () =>
      navLinksMain.map((link, idx) => {
        const isActive = link.href
          ? pathname === link.href ||
          (idx !== 0 && pathname?.startsWith(link.href))
          : false;
        return (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={isActive}
          />
        );
      }),
    [pathname]
  );

  const isNewsPubsDropdownActive = useMemo(() => {
    return newsPublicationsLinks.some(
      (link) => link.href && pathname && pathname === link.href
    );
  }, [pathname]);

  const navItemsNewsPublicationsDropdown = useMemo(
    () =>
      newsPublicationsLinks.map((link) => {
        const isActive = link.href ? pathname === link.href : false;
        return (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={isActive}
          />
        );
      }),
    [pathname]
  );

  const navItemsSecondary = useMemo(
    () =>
      navLinksSecondary.map((link) => {
        const isActive = link.href
          ? pathname === link.href ||
          (link.href !== "/subscription" && pathname?.startsWith(link.href))
          : false;
        return (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={isActive}
          />
        );
      }),
    [pathname]
  );

  // Sidebar inner content for reuse
  const SidebarContent = (
    <>
      {/* Logo / Title */}
      <div className="flex items-center px-8 py-6 border-b border-[#d1e0f3] bg-gradient-to-b from-[#f3f7fa] to-[#e8f0fb] gap-3">
        <Link href="/" aria-label="Home" className="flex items-center mr-1">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={36}
            className="object-contain bg-[#f0f5fc] rounded-md shadow-md"
            priority
          />
        </Link>
        <span className="font-black text-[1.38rem] tracking-wider text-[#15407c] select-none ml-3 drop-shadow-sm uppercase">
          NAAPE
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 px-0" aria-label="Sidebar Navigation">
        <ul className={LIST_RESET + " px-1"}>

          {/* MAIN */}
          <li className={SECTION_TITLE}>Main</li>
          {navItemsMain[0]}
          <li className={SECTION_DIVIDER + " my-3"} />

          {/* NEWS & PUBLICATIONS */}
          <li className={SECTION_LABEL}>News & Publications</li>
          <DropdownNavItem
            label="News & Publications"
            icon={FaNewspaper}
            isActive={isNewsPubsDropdownActive}
          >
            {navItemsNewsPublicationsDropdown}
          </DropdownNavItem>
          <li className={SECTION_DIVIDER} />

          {/* ACTIVITIES */}
          <li className={SECTION_LABEL}>Activities</li>
          <div className="flex flex-col gap-[2.5px] mb-1 mt-1 pl-1.5 border-l-2 border-[#eaf3fc]">
            {navItemsMain.slice(1)}
          </div>
          <li className={SECTION_DIVIDER + " mt-5"} />

          {/* ACCOUNT */}
          <li className={SECTION_LABEL}>Account</li>
          <div className="flex flex-col gap-[2px] mb-2 mt-1 pl-1.5 border-l-2 border-[#eaf3fc]">
            {navItemsSecondary}
            <NavItem
              icon={FaSignOutAlt}
              label="Sign Out"
              onClick={handleSignOut}
              asButton={true}
              disabled={typeof logout !== "function"}
            />
          </div>
        </ul>
      </nav>
      {/* Profile footer */}
      <footer className="w-full border-t border-[#dde7f3] bg-gradient-to-r from-[#f8fbfc] to-[#eaf3fc] px-2.5 py-4 shadow-inner">
        <SidebarProfileCard user={user ?? {}} />
      </footer>
    </>
  );

  // Responsive: Show overlay and sidebar for mobile
  return (
    <>
      {/* -- Mobile Hamburger only visible below sm (sm:hidden) -- */}
      <button
        className="fixed bottom-4 left-4 z-[100] rounded-full p-3 bg-[#fafdff] border border-[#dde7f3] shadow-md flex items-center justify-center sm:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen(v => !v)}
      >
        {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
      </button>

      {/* -- Sidebar for Desktop -- */}
      <aside
        className="hidden sm:flex flex-col z-[50] border-r border-[#dde7f3] bg-[#fafdff] pt-0"
        style={{
          width: SIDEBAR_WIDTH,
          minWidth: 265,
          maxWidth: 370,
          top: 0,
          position: "sticky",
          height: "100vh"
        }}
      >
        {SidebarContent}
      </aside>

      {/* -- Sidebar for Mobile -- */}
      {/* Fullscreen overlay & slide-in sidebar */}
      {mobileOpen && (
        <div>
          <div
            className="fixed inset-0 z-[99] bg-black/40 transition-opacity sm:hidden"
            aria-hidden="true"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="fixed top-0 left-0 z-[100] w-[89vw] max-w-[360px] min-w-[220px] h-screen bg-[#fafdff] border-r border-[#dde7f3] flex flex-col animate-slide-in sm:hidden"
            style={{
              transition: "transform .2s cubic-bezier(.4,0,.2,1)",
            }}
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="flex items-center px-4 py-6 border-b border-[#d1e0f3] bg-gradient-to-b from-[#f3f7fa] to-[#e8f0fb] gap-3">
              <Link href="/" aria-label="Home" className="flex items-center mr-1">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={28}
                  className="object-contain bg-[#f0f5fc] rounded-md shadow-md"
                  priority
                />
              </Link>
              <span className="font-black text-[1.1rem] tracking-wider text-[#15407c] select-none ml-2 drop-shadow-sm uppercase">
                NAAPE
              </span>
              <button
                className="ml-auto p-2 text-[#204a7a] rounded hover:bg-[#eaf3fc] focus:outline-none"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                tabIndex={0}
              >
                <FaTimes size={22} />
              </button>
            </div>
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto py-2 px-0 min-h-0">
              <ul className={LIST_RESET + " px-1"}>

                {/* MAIN */}
                <li className={SECTION_TITLE}>Main</li>
                {navItemsMain[0]}
                <li className={SECTION_DIVIDER + " my-3"} />

                {/* NEWS & PUBLICATIONS */}
                <li className={SECTION_LABEL}>News & Publications</li>
                <DropdownNavItem
                  label="News & Publications"
                  icon={FaNewspaper}
                  isActive={isNewsPubsDropdownActive}
                >
                  {navItemsNewsPublicationsDropdown}
                </DropdownNavItem>
                <li className={SECTION_DIVIDER} />

                {/* ACTIVITIES */}
                <li className={SECTION_LABEL}>Activities</li>
                <div className="flex flex-col gap-[2.5px] mb-1 mt-1 pl-1.5 border-l-2 border-[#eaf3fc]">
                  {navItemsMain.slice(1)}
                </div>
                <li className={SECTION_DIVIDER + " mt-5"} />

                {/* ACCOUNT */}
                <li className={SECTION_LABEL}>Account</li>
                <div className="flex flex-col gap-[2px] mb-2 mt-1 pl-1.5 border-l-2 border-[#eaf3fc]">
                  {navItemsSecondary}
                  <NavItem
                    icon={FaSignOutAlt}
                    label="Sign Out"
                    onClick={handleSignOut}
                    asButton={true}
                    disabled={typeof logout !== "function"}
                  />
                </div>
              </ul>
            </div>
            {/* Profile footer */}
            <footer className="w-full border-t border-[#dde7f3] bg-gradient-to-r from-[#f8fbfc] to-[#eaf3fc] px-2.5 py-4 shadow-inner">
              <SidebarProfileCard user={user ?? {}} />
            </footer>
          </aside>
        </div>
      )}
      {/* Animation (slide-in) for mobile sidebar */}
      <style jsx global>{`
        @media (max-width: 639px) {
          .animate-slide-in {
            animation: sidebar-slide-in 0.19s cubic-bezier(.4,0,.2,1) both;
          }
          @keyframes sidebar-slide-in {
            0% { transform: translateX(-110%); }
            100% { transform: translateX(0); }
          }
        }
      `}</style>
    </>
  );
}