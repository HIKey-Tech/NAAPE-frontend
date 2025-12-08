"use client";

import {
  FaHome,
  FaSearch,
  FaNewspaper,
  FaBook,
  FaPlusSquare,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaBriefcase,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaCreditCard,
  FaMoneyCheckAlt,
  FaIdBadge,
  FaBars
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";

// Improved Contrast/Visual Hierarchy Theme
const PRIMARY_COLOR = "#12306a";
const SIDEBAR_CARD_BG = "#ffffff";
const SIDEBAR_SHADOW = "none";
const TEXT_COLOR = "#122244";
const ICON_INACTIVE = "#60749a";
const ICON_ACTIVE_BG = "rgba(18,48,106,0.13)";
const ICON_BORDER = "#98b2ce";
const SECTION_LABEL_BG = "#e1eafd";
const PROFILE_NAME = "#072048";
const PROFILE_EMAIL = "#4b5a76";
const RADIUS = "18px";
const SIDEBAR_SECTION_LABEL = "#214879";
const ACTIVE_BAR = "#1c5be5";
const SIDEBAR_SECTION_BG = "#e7f0ff";
const PRIMARY_COLOR_LIGHT_BG = "#dbeaff";

const MOBILE_SIDENAV_OVERLAY_BG = "rgba(18,48,106,0.16)";
const iconAnimationStyles = `
@keyframes icon-bounce {
  0%,100% { transform: translateY(0);}
  15% { transform: translateY(-7px);}
  30% { transform: translateY(3px);}
  45% { transform: translateY(-2px);}
  60% { transform: translateY(1.5px);}
  75% { transform: translateY(-1px);}
}
.animated-sidebar-icon, .animated-bottomnav-icon, .animated-dropdown-icon {
  transition: color 0.16s, background 0.14s;
}
.sidebar-navitem, .sidebar-navitem:focus { background: transparent; }
.sidebar-navitem:hover, .sidebar-navitem:focus-visible { background: ${PRIMARY_COLOR_LIGHT_BG}; }
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon,
.bottomnav-item:hover .animated-bottomnav-icon,
.bottomnav-item:focus .animated-bottomnav-icon {
  animation: icon-bounce 0.4s;
  color: ${PRIMARY_COLOR} !important;
  background: ${ICON_ACTIVE_BG};
}
.sidebar-navitem-active, .bottomnav-item-active {
  background: ${PRIMARY_COLOR_LIGHT_BG};
  font-weight: 810;
  color: ${PRIMARY_COLOR} !important;
  position: relative;
}
.sidebar-navitem-active::before {
  content: "";
  position: absolute;
  left: 0.18rem; top: 0.7rem; bottom: 0.73rem;
  width: 5px;
  background: ${ACTIVE_BAR};
  border-radius: 9px;
  box-shadow: 0 1px 4px 0 rgba(28,91,229,0.03);
}
.sidebar-navitem-active .animated-sidebar-icon,
.bottomnav-item-active .animated-bottomnav-icon {
  animation: icon-bounce 0.64s;
  color: ${PRIMARY_COLOR} !important;
  background: ${ICON_ACTIVE_BG};
}
.dropdown-navitem:hover, .dropdown-navitem:focus { background: #e8f2ff !important; }
.dropdown-navitem:hover .animated-dropdown-icon, .dropdown-navitem:focus .animated-dropdown-icon {
  animation: icon-bounce 0.36s;
  color: ${PRIMARY_COLOR} !important;
}
.dropdown-active .animated-dropdown-icon {
  animation: icon-bounce 0.64s;
  color: ${PRIMARY_COLOR} !important;
}
.sidebar-section-label {
  color: ${SIDEBAR_SECTION_LABEL};
  font-size: 13.5px;
  font-weight: 900;
  letter-spacing: 0.095em;
  padding-left: 1.4rem;
  padding-top: 0.32rem;
  padding-bottom: 0.11rem;
  text-transform: uppercase;
  background: ${SECTION_LABEL_BG};
  border-radius: 13px 13px 0 0;
  margin-bottom: 0.17rem;
  margin-top: 1.04rem;
  overflow: visible;
  border-left: 4.8px solid ${ACTIVE_BAR};
  text-shadow: 0 1px 0 #fff, 0 1.1px 0 #e4edff;
}
.sidebar-section-spacer {
  margin: 10px 0 6px 0;
  height: 0;
  border-bottom: 2.3px solid ${ICON_BORDER};
  width: 89%;
  margin-left: auto; margin-right: auto;
}
.sidebar-card {
  background: ${SIDEBAR_CARD_BG};
  border-radius: ${RADIUS};
  border: 2.2px solid ${ICON_BORDER};
  box-shadow: none;
}
.sidebar-card > *:first-child { border-top-left-radius: ${RADIUS}; border-top-right-radius: ${RADIUS}; }
.sidebar-card > *:last-child { border-bottom-left-radius: ${RADIUS}; border-bottom-right-radius: ${RADIUS}; }
::-webkit-scrollbar-thumb { background: #cbd8f2; border-radius: 6px; border:1px solid #b3c5e2;}
::-webkit-scrollbar { width: 8px; background: transparent;}
@media (max-width: 639px) {
  .mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    padding: 0 1.1rem 0 1.2rem;
    width: 100vw;
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    background: #fafdff;
    border-bottom: 1.7px solid ${ICON_BORDER};
    box-shadow: none;
  }
  .mobile-topbar-logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .mobile-topbar-avatar {
    width: 35px; height: 35px;
    border-radius: 50%;
    background: #e2eefd;
    border: 2px solid #b8cce6;
    display: flex;
    align-items: center; justify-content: center;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 18px;
    color: ${PRIMARY_COLOR};
    object-fit: cover;
    overflow: hidden;
  }
  .mobile-topbar-title {
    color: ${PRIMARY_COLOR};
    font-weight: 900;
    letter-spacing: .038em;
    font-size: 15.7px;
    text-shadow: none;
    text-transform: uppercase;
    line-height: 1.09;
    margin-left: 5px;
  }
  .mobile-sidenav-overlay {
    content: "";
    display: block;
    background: ${MOBILE_SIDENAV_OVERLAY_BG};
    position: fixed;
    left: 0; top: 0; right: 0; bottom: 0;
    z-index: 101;
    animation: overlay-fadein 0.18s cubic-bezier(0.32,0,0.68,1);
  }
  @keyframes overlay-fadein {
    0% { opacity: 0;}
    100% { opacity: 1;}
  }
  .mobile-sidenav {
    position: fixed;
    top: 0; bottom: 0; left: 0;
    width: 100vw;
    max-width: 100vw;
    min-width: 0;
    background: #fafdff;
    z-index: 110;
    padding: 0;
    border-right: none;
    transform: translateX(-100%);
    transition: transform 0.18s cubic-bezier(0.47,0,0.74,1);
    box-shadow: 0 8px 18px 0 rgba(41, 62, 104, 0.04), 0 1.3px 0 #dbeaff;
    display: block;
  }
  .mobile-sidenav.open {
    transform: translateX(0);
  }
  .mobile-sidenav-header {
    padding: 20px 24px 7px 20px;
    border-bottom: 1.7px solid ${ICON_BORDER};
    background: #fafdff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 58px;
  }
  .mobile-sidenav-inner {
    padding: 0 0 24px 0;
    height: calc(100% - 58px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
  }
  .mobile-sidenav-profile {
    margin-bottom: 2px;
    padding: 14px 18px 14px 24px;
    background: #f5f8ff;
    border-top: 2px solid #cbdbef;
    border-bottom: 2px solid #cbdbef;
    border-radius: 0 0 ${RADIUS} ${RADIUS};
    display: flex; gap: 13px; align-items: center;
  }
  .mobile-sidenav-section-label {
    font-size: 13px;
    font-weight: 900;
    color: ${SIDEBAR_SECTION_LABEL};
    background: ${SECTION_LABEL_BG};
    padding: 7px 15px 5px 23px;
    border-radius: 13px 13px 0 0;
    letter-spacing: 0.09em;
    margin: 16px 0 4px 0;
    text-transform: uppercase;
    border-left: 4.4px solid ${ACTIVE_BAR};
  }
  .mobile-sidenav-link {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 11px 19px 11px 32px;
    font-size: 16.3px;
    font-weight: 700;
    border-left: 4px solid transparent;
    color: ${TEXT_COLOR};
    background: transparent;
    border-radius: 0 17px 17px 0;
    text-decoration: none;
    letter-spacing: .012em;
    cursor: pointer;
    transition: background .12s, color .12s;
  }
  .mobile-sidenav-link.active {
    color: ${PRIMARY_COLOR} !important;
    background: ${PRIMARY_COLOR_LIGHT_BG};
    border-left: 4px solid ${ACTIVE_BAR};
    font-weight: 900;
  }
  .mobile-sidenav-link .mobile-sidenav-link-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: inherit;
  }
  .mobile-sidenav-link-description {
    color: ${ICON_INACTIVE};
    font-size: 12px;
    line-height: 1.22;
    font-weight: 500;
    margin-top: 3px;
  }
  .mobile-sidenav-bottom {
    margin-top: auto;
    background: #fafdff;
    border-top: 2.2px solid ${ICON_BORDER};
    padding: 0.6em 0 1em 0;
    width: 100%;
  }
  .mobile-sidenav-signout {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 19px 13px 32px;
    color: #c73741;
    font-weight: 860;
    background: none;
    border: none;
    border-radius: 0 17px 17px 0;
    cursor: pointer;
    font-size: 15.2px;
    transition: background .12s;
  }
  .mobile-sidenav-signout:active,
  .mobile-sidenav-signout:focus {
    background: #ffecec;
  }
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 62px;
    z-index: 51;
    background: #fafdff;
    border-top: 2.3px solid ${ICON_BORDER};
    margin-top: 30px;
    box-shadow: none;
  }
  .mobile-bottom-nav ul {
    flex: 1 1 0;
    display: flex; width: 100%; height: 100%;
    padding: 0; margin: 0;
    align-items: stretch; justify-content: space-around;
    list-style: none;
  }
  .bottomnav-item {
    flex: 1 1 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    font-size: 13.5px;
    color: ${TEXT_COLOR};
    gap: 6.5px;
    text-align: center;
    transition: background 0.14s;
    min-width: 0; min-height: 0;
    height: 62px;
    font-weight: 600;
    border-radius: 18px 18px 0 0;
    margin: 0 1px;
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
  }
  .bottomnav-item .animated-bottomnav-icon {
    width: 28px;
    height: 28px;
    display: block;
    margin: 0 auto 2px auto;
    color: ${ICON_INACTIVE};
    transition: color 0.13s, background 0.13s;
    background: none;
    border-radius: 50%;
  }
  .bottomnav-item-active {
    background: ${PRIMARY_COLOR_LIGHT_BG};
    color: ${PRIMARY_COLOR};
    font-weight: 810;
    box-shadow: none;
    border-top: 2px solid ${ACTIVE_BAR};
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: ${PRIMARY_COLOR} !important;
    background: ${ICON_ACTIVE_BG};
    border-radius: 12px;
  }
  .sidebar-container {
    display: none !important;
  }
}
@media (min-width: 640px) {
  .mobile-bottom-nav, .mobile-topbar, .mobile-sidenav, .mobile-sidenav-overlay { display: none !important; }
}
`;

// Type and nav data as in original code
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
  description?: string;
};
const navLinksMain: NavLink[] = [
  { label: "Home", icon: FaHome, href: "/dashboard" },
  { label: "Training & Certifications", icon: FaChalkboardTeacher, href: "/training" },
  { label: "Events", icon: FaCalendarAlt, href: "/member/events" },
  { label: "Forum", icon: FaComments, href: "/forum" },
  { label: "Subscription", icon: FaIdBadge, href: "/subscription", description: "Your membership subscription" },
  { label: "Payment History", icon: FaCreditCard, href: "/payments", description: "All your payment records" },
];
const publicationsDropdownLinks: NavLink[] = [
  { label: "All Publications", icon: FaBook, href: "/publications", group: "Publications", description: "Browse all publications" },
  { label: "Create Publication", icon: FaPlusSquare, href: "/publications/new", group: "Publications", description: "Add a new publication" },
  { label: "News", icon: FaNewspaper, href: "/news", group: "News", description: "Latest news updates" },
];
const navLinksSecondary: NavLink[] = [
  { label: "Subscription", icon: FaIdBadge, href: "/subscription", description: "Your membership subscription" },
  { label: "Payment History", icon: FaCreditCard, href: "/payments", description: "All your payment records" }
];
const organizePublicationTabsForMobile = (list: NavLink[]) => [
  ...list.filter(l => l.group === "Publications"),
  ...list.filter(l => l.group === "News")
];
const publicationsDropdownLinksMobile: NavLink[] = organizePublicationTabsForMobile(publicationsDropdownLinks);

function getUserInitials(user: User) {
  if (user && user.name) {
    return user.name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0] || '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  if (user && user.email) {
    return user.email[0]?.toUpperCase() ?? "?";
  }
  return "?";
}
// --- Hamburger Mobile TopBar ---
function MobileTopBar({ onHamburger, user }: { onHamburger: () => void, user: User | undefined }) {
  return (
    <div className="mobile-topbar mt-12 " role="banner" aria-label="Header">
      <div className="mobile-topbar-logo">
        <button
          type="button"
          aria-label="Open main menu"
          tabIndex={0}
          style={{
            background: "none",
            padding: 0,
            marginRight: 10,
            border: "none",
            lineHeight: 0,
            color: PRIMARY_COLOR,
            display: "flex",
            alignItems: "center",
            fontSize: "23px",
            cursor: "pointer"
          }}
          onClick={onHamburger}
        >
          <FaBars size={28} />
        </button>
        <Link href="/" aria-label="Home" tabIndex={0} style={{ lineHeight: 0, display: "flex", alignItems: "center" }}>
          <Image src="/logo.png" alt="NAAPE Logo" width={44} height={35} style={{ height: 35, width: 44, objectFit: "contain" }} priority />
        </Link>
        <span className="mobile-topbar-title">NAAPE</span>
      </div>
      <div>
        {user?.avatarUrl ? (
          <Image src={user.avatarUrl} alt={user.name || user.email || "User"} width={35} height={35} className="mobile-topbar-avatar" />
        ) : (
          <span className="mobile-topbar-avatar">
            {getUserInitials(user ?? {})}
          </span>
        )}
      </div>
    </div>
  );
}
function MobileSidenav({
  open,
  onClose,
  pathname,
  navMain,
  navSecondary,
  pubLinks,
  onSignOut,
  user
}: {
  open: boolean;
  onClose: () => void;
  pathname: string | null;
  navMain: NavLink[];
  navSecondary: NavLink[];
  pubLinks: NavLink[];
  onSignOut: () => void;
  user: User | undefined;
}) {
  const sideNavRef = useRef<HTMLDivElement>(null);

  // Focus trap & close on ESC/click outside
  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (sideNavRef.current && !sideNavRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    function escHandler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", escHandler);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", escHandler);
    };
  }, [open, onClose]);

  // Overlay style: fullscreen overlay covers whole viewport when open
  // If open, render nav as overlay (mobile)
  if (!open) return null;

  return (
    <>
      <div className="mobile-sidenav-overlay z-50" onClick={onClose} aria-label="Close menu" />
      <nav
        ref={sideNavRef}
        className={`mobile-sidenav open`}
        aria-label="Mobile Side Navigation"
        tabIndex={-1}
        style={{
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          maxWidth: "100vw",
          minWidth: 0,
          zIndex: 110,
        }}
      >
        <div className="mobile-sidenav-header">
          <span className="mobile-topbar-title" style={{ fontSize: 16, fontWeight: 900, letterSpacing: ".021em" }}>Menu</span>
          <button type="button" aria-label="Close menu" onClick={onClose} style={{ background: "none", border: "none", fontSize: 28, color: ICON_INACTIVE, cursor: "pointer", padding: 0 }}>
            <svg viewBox="0 0 28 28" width={26} height={26}>
              <line x1="6" y1="6" x2="22" y2="22" stroke={ICON_INACTIVE} strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="6" x2="6" y2="22" stroke={ICON_INACTIVE} strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="mobile-sidenav-inner">
          <div className="mobile-sidenav-profile">
            {user?.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.name || user.email || "User"} width={40} height={40} style={{ borderRadius: "50%", width: 40, height: 40, objectFit: "cover", border: "2px solid #b8cce6", background: "#e3f1fd" }} />
            ) : (
              <span style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#e3f1fd",
                fontSize: 18,
                fontWeight: 800,
                color: PRIMARY_COLOR,
                letterSpacing: ".04em",
                ...(user?.name || user?.email ? {} : { opacity: 0.7 }),
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              } as React.CSSProperties }>
                {getUserInitials(user ?? {})}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ color: PROFILE_NAME, fontWeight: 900, fontSize: 15.7 }}>{user?.name ?? "User"}</div>
              <div style={{ color: PROFILE_EMAIL, fontSize: 12.4, fontWeight: 500 }}>{user?.email ?? ""}</div>
            </div>
          </div>
          <div>
            <div className="mobile-sidenav-section-label">Main</div>
            {navMain.filter(l => ["Home"].includes(l.label)).map(link => {
              const isActive = link.href && (pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/dashboard"));
              return (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  className={`mobile-sidenav-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  onClick={onClose}
                >
                  <link.icon className="mobile-sidenav-link-icon" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {/* Section: Publications & News */}
            <div className="mobile-sidenav-section-label" style={{marginTop:18}}>News & Publications</div>
            {pubLinks.map(link => {
              const isActive = link.href && (pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/dashboard"));
              return (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  className={`mobile-sidenav-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  onClick={onClose}
                  style={link.label === "Create Publication" ? { marginBottom: 7, marginTop: 6, borderTop: "1px solid #cae2fd" } : undefined}
                >
                  <link.icon className="mobile-sidenav-link-icon" />
                  <span>{link.label}</span>
                  {link.description && (
                    <span className="mobile-sidenav-link-description">{link.description}</span>
                  )}
                </Link>
              );
            })}
            <div className="mobile-sidenav-section-label" style={{marginTop:18}}>Activities</div>
            {navMain.filter(l => !["Home"].includes(l.label)).map(link => {
              const isActive = link.href && (pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/dashboard"));
              return (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  className={`mobile-sidenav-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  onClick={onClose}
                >
                  <link.icon className="mobile-sidenav-link-icon" />
                  <span>{link.label}</span>
                  {link.description && (
                    <span className="mobile-sidenav-link-description">{link.description}</span>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="mobile-sidenav-bottom">
            <div className="mobile-sidenav-section-label" style={{marginTop: 0}}>Account</div>
            {navSecondary.map(link => {
              const isActive = link.href && (pathname === link.href || (pathname?.startsWith(link.href) && link.href !== "/subscription"));
              return (
                <Link
                  key={link.label}
                  href={link.href ?? "#"}
                  className={`mobile-sidenav-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  onClick={onClose}
                >
                  <link.icon className="mobile-sidenav-link-icon" />
                  <span>{link.label}</span>
                  {link.description && (
                    <span className="mobile-sidenav-link-description">{link.description}</span>
                  )}
                </Link>
              );
            })}
            <button className="mobile-sidenav-signout" onClick={onSignOut} aria-label="Sign out">
              <FaSignOutAlt style={{ width: 22, height: 22 }} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
// ----- End Mobile Sidenav Area -----

function SidebarContainer({
  SidebarContent
}: { SidebarContent: React.ReactNode }) {
  return (
    <div className="hidden sm:block sidebar-container sticky pt-2 h-full min-h-0 " style={{ background: "#fafdff" }}>
      <aside className="sticky top-0 h-screen">{SidebarContent}</aside>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <li aria-hidden="true">
      <span className="sidebar-section-label">{children}</span>
    </li>
  );
}
function SectionSpacer() {
  return <li className="sidebar-section-spacer" aria-hidden="true"></li>;
}

function MobileBottomNavBar({
  pathname,
  onHamburger
}: {
  pathname: string | null;
  onHamburger: () => void;
}) {
  return (
    <nav
      className="mobile-bottom-nav bg-black"
      style={{
        background: "#fff",
        borderTop: "1px solid #e5e7eb",
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        padding: "0.2rem 0",
      }}
      role="navigation"
      aria-label="Mobile bottom navigation"
    >
      <ul style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        margin: 0,
        padding: 0,
        listStyle: "none"
      }}>
        <li>
          <Link
            href="/dashboard"
            aria-current={pathname === "/dashboard" ? "page" : undefined}
            tabIndex={0}
            aria-label="Home"
            style={{
              background: "none",
              border: "none",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "6px 10px",
              color: pathname === "/dashboard" ? PRIMARY_COLOR : "#667085",
              fontWeight: pathname === "/dashboard" ? 700 : 500,
              fontSize: "15px",
              textDecoration: "none"
            }}
          >
            <FaHome size={21} style={{ display: "block", marginBottom: 2 }} />
            <span style={{ fontSize: 12 }}>Home</span>
          </Link>
        </li>
        <li>
          <button
            type="button"
            aria-label="Open main menu"
            tabIndex={0}
            onClick={onHamburger}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              color: PRIMARY_COLOR,
              fontWeight: 700,
              fontSize: "15px",
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            <FaBars size={21} style={{ display: "block", marginBottom: 2 }} />
            <span style={{ fontSize: 12 }}>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSignOut = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to sign out?")) {
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

  const navItemsMain = useMemo(() =>
    navLinksMain
      .filter(link => !["Subscription", "Payment History"].includes(link.label))
      .map((link, idx) => {
        const isActive = link.href
          ? pathname === link.href ||
            (idx !== 0 && pathname?.startsWith(link.href) && link.href !== "/dashboard")
          : false;
        return (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={isActive}
            description={link.description}
            tabIndex={0}
          />
        );
      }), [pathname]
  );

  const navItemsSecondary = useMemo(() =>
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
          description={link.description}
          tabIndex={0}
        />
      );
    }), [pathname]
  );

  // Desktop sidebar content (with gradients removed)
  const SidebarContent = (
    <>
      <style>{iconAnimationStyles}</style>
      <nav
        className={`
          sidebar-card
          w-[95px] sticky sm:w-[280px] max-w-[285px]
          min-w-0 sm:min-w-[225px]
          border-none h-screen
          flex flex-col justify-between z-50
          px-2.5 pb-3 pt-1.5
          sidebar-mobile sm:sticky sm:top-0 sidebar-container
        `}
        aria-label="Sidebar Navigation"
        role="navigation"
        style={{
          background: "#fafdff",
          borderRadius: 0,
          border: `2.2px solid ${ICON_BORDER}`,
          minHeight: "99vh",
          minWidth: 0,
          boxShadow: "none"
        }}
      >
        {/* Logo & Brand Area */}
        <header className="flex flex-col py-3 px-4 bg-white rounded-t-[18px] border-b-[2px] border-[#cbdbef]" style={{
          position: "sticky",
          zIndex: 2,
          boxShadow: "none"
        }}>
          <div className="flex justify-between items-center gap-2 w-full">
            <div className="flex items-center gap-3 min-w-full">
              <Link
                href="/"
                aria-label="Home"
                className="block bg-white shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2259ae] rounded-lg"
                tabIndex={0}
                style={{
                  border: `2.5px solid #cadcf3`,
                  boxShadow: "none"
                }}
              >
                <div
                  style={{
                    background: ``,
                    borderRadius: "13px",
                    border: "none",
                    padding: 5,
                    alignItems: "center",
                    display: "flex"
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={68}
                    height={44}
                    className="h-11 w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
              <div className="min-w-full flex items-center">
                <span
                  className="hidden sm:inline-block ml-2 text-[14.2px] font-black leading-tight truncate max-w-[184px]"
                  style={{
                    color: PRIMARY_COLOR,
                    letterSpacing: ".03em",
                    textTransform: "uppercase",
                    textShadow: "none"
                  }}
                >
                  NAAPE,<br />
                  <span style={{ color: SIDEBAR_SECTION_LABEL, fontWeight: 600 }}>Nigeria association</span><br />
                  <span style={{ letterSpacing: ".05em", fontSize: 13.2, color: PROFILE_NAME, fontWeight: 800 }}>
                    of aircraft pilots<br /> & engineers
                  </span>
                </span>
              </div>
            </div>
            {/* Desktop: collapse/expand sidebar - not implemented */}
            <button
              type="button"
              aria-label="Collapse sidebar (not yet implemented)"
              className="ml-1 sm:flex hidden items-center justify-center rounded-md transition-colors p-[6px] focus:outline-none focus:ring-2"
              tabIndex={-1}
              disabled={true}
              style={{
                border: "1.7px solid #b2c6e0",
                background: "none",
                color: ICON_INACTIVE,
                opacity: 0.45,
                cursor: "not-allowed"
              }}
              aria-disabled="true"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" className="text-[#60749a]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="#AEBFD3" strokeWidth="1.5" fill="#fff" />
                <path d="M13.5 9l-3 3 3 3" stroke="#60749a" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </header>
        {/* Navigation */}
        <ul className="flex-1 w-full flex flex-col py-[18px] px-0 gap-0.5 overflow-y-auto" style={{ minHeight: 0 }}>
          <SectionLabel>MAIN</SectionLabel>
          {Array.isArray(navItemsMain) && navItemsMain.length > 0 ? navItemsMain[0] : null}
          {/* PublicationsDropdown is desktop-only, not in mobile */}
          <SectionSpacer />
          <SectionLabel>ACTIVITIES</SectionLabel>
          {Array.isArray(navItemsMain) && navItemsMain.length > 1 && navItemsMain.slice(1)}
        </ul>
        <div style={{
          background: "#fafdff",
          borderTop: `2.2px solid ${ICON_BORDER}`,
          marginTop: "2px"
        }}>
          <ul className="flex flex-col py-2 px-0 pb-1.5">
            <SectionLabel>Account</SectionLabel>
            {Array.isArray(navItemsSecondary) && navItemsSecondary}
            <NavItem
              icon={FaSignOutAlt}
              label="Sign Out"
              onClick={handleSignOut}
              aria-label="Sign out of your account"
              asButton={true}
              tabIndex={0}
              disabled={typeof logout !== "function"}
            />
          </ul>
        </div>
        {/* User Profile Footer */}
        <footer className="w-full"
          style={{
            background: "#f5f8ff",
            borderBottomLeftRadius: RADIUS,
            borderBottomRightRadius: RADIUS
          }}
        >
          {/* Desktop-profile footer only, mobile has in menu */}
          <SidebarProfileCard user={user ?? {}} />
        </footer>
      </nav>
    </>
  );

  return (
    <div className="sticky py-10 z-50">
      <style>{iconAnimationStyles}</style>
      {/* Desktop: Sidebar and nav */}
      <SidebarContainer SidebarContent={SidebarContent} />
      {/* MOBILE: Hamburger topbar */}
      <MobileTopBar onHamburger={() => setMobileNavOpen(true)} user={user ?? undefined} />
      {/* MOBILE: Hamburger Sidenav Overlay */}
      <MobileSidenav
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        pathname={pathname}
        navMain={navLinksMain}
        navSecondary={navLinksSecondary}
        pubLinks={publicationsDropdownLinksMobile}
        onSignOut={handleSignOut}
        user={user ?? undefined}
      />
      {/* MOBILE: Only Home and Hamburger at bottom */}
      {/* <MobileBottomNavBar pathname={pathname} onHamburger={() => setMobileNavOpen(true)} /> */}
    </div>
  );
}
// --- SidebarProfileCard and NavItem unchanged ---
function SidebarProfileCard({ user }: { user: User }) {
  if (!user || (!user.name && !user.email)) return null;
  return (
    <div className="flex items-center gap-4 px-6 py-2 min-w-0 bg-[#f5f8ff] border-t-[2px] border-[#cbdbef]" style={{
      borderRadius: `0 0 ${RADIUS} ${RADIUS}`,
      paddingTop: 19,
      paddingBottom: 19,
      boxShadow: "none"
    }}>
      <div className="relative flex-shrink-0">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || user.email || "User Avatar"}
            width={52}
            height={52}
            className="rounded-full border-2 border-[#b8cce6] object-cover select-none"
            style={{
              width: 52,
              height: 52,
              background: "#e2eefd",
              boxShadow: "none"
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full border-2 border-[#b8cce6] object-cover select-none"
            style={{
              width: 52,
              height: 52,
              background: "#e3f1fd",
              fontSize: 22,
              fontWeight: 800,
              color: PRIMARY_COLOR,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              userSelect: "none",
              boxShadow: "none"
            }}
            aria-label={user.name || user.email}
          >
            {getUserInitials(user)}
          </div>
        )}
        <span
          style={{
            position: "absolute",
            right: -4,
            bottom: -6,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#25e36a",
            border: "3px solid #fafdff",
            boxShadow: "none"
          }}
          aria-label="online"
        />
      </div>
      <div className="flex flex-col min-w-0" style={{
        lineHeight: "1.12",
        alignItems: "flex-start"
      }}>
        <span className="truncate text-[16.6px] font-bold" style={{
          color: PROFILE_NAME,
          letterSpacing: ".03em",
          fontWeight: 900,
          textShadow: "none"
        }}>
          {user.name ?? user.email ?? "User"}
        </span>
        {user.email && (
          <span className="truncate text-xs" style={{ color: PROFILE_EMAIL, fontWeight: 500 }}>
            {user.email}
          </span>
        )}
      </div>
    </div>
  );
}
type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  ariaExpanded?: boolean;
  asButton?: boolean;
  hideLabelOnMobile?: boolean;
  description?: string;
  disabled?: boolean;
  tabIndex?: number;
};

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
  children,
  ariaExpanded,
  asButton = false,
  hideLabelOnMobile = false,
  description,
  disabled = false,
  tabIndex = 0
}: NavItemProps) {
  const labelClass = hideLabelOnMobile
    ? "hidden sm:inline"
    : "inline";
  const baseClass =
    `sidebar-navitem group relative flex items-center w-full px-5 py-2.5 rounded-xl text-base gap-3 font-semibold transition-all duration-100 whitespace-nowrap focus:outline-none focus:ring-2 border-l-[5px] border-transparent`;
  const focusRing = `focus:ring-[${PRIMARY_COLOR}]`;
  const activeClass = `sidebar-navitem-active bg-[${PRIMARY_COLOR_LIGHT_BG}] text-[${PRIMARY_COLOR}] border-l-[5px] border-[${ACTIVE_BAR}]`;
  const hoverInactive = `hover:bg-[#e1ecff] text-[${TEXT_COLOR}] transition-all duration-100`;
  const iconActive = `animated-sidebar-icon text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-[13px] w-7 h-7`;
  const iconInactive = `animated-sidebar-icon text-[${ICON_INACTIVE}] w-7 h-7`;
  const buttonRippleStyle = {};

  const tabIndexVal = disabled ? -1 : tabIndex;

  // Proper alignment: space between icon and label, smaller left margin, remove excessive gap
  if (asButton) {
    return (
      <li className="relative">
        <button
          type="button"
          className={`${baseClass} ${focusRing} ${hoverInactive} ${active ? activeClass : ""} ${disabled ? "opacity-60 cursor-not-allowed grayscale" : ""}`}
          tabIndex={tabIndexVal}
          aria-haspopup={children ? "menu" : undefined}
          aria-expanded={ariaExpanded}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
          aria-disabled={disabled}
          style={buttonRippleStyle}
        >
          <Icon className={`${active ? iconActive : iconInactive} flex-shrink-0`} />
          <span className={`flex-1 ml-2 text-left ${labelClass}`} style={{
            fontWeight: active ? 900 : 510,
            fontSize: 17,
            letterSpacing: ".016em",
            color: active ? PRIMARY_COLOR : TEXT_COLOR,
            paddingLeft: "0px"
          }}>
            {label}
          </span>
          {children ? (
            <svg
              className={`ml-auto h-3.5 w-3.5 transition-transform ${ariaExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 20 20"
              aria-hidden="true"
              style={{ color: ICON_INACTIVE }}
            >
              <polyline points="6 8 10 12 14 8" />
            </svg>
          ) : null}
        </button>
        {children}
      </li>
    );
  }

  const safeLabel = label || "Navigation Item";
  const content = (
    <div className="flex flex-col flex-1 min-w-0 items-start">
      <div className="flex items-center min-w-0 gap-3">
        <Icon className={`${active ? iconActive : iconInactive} flex-shrink-0`} />
        <span
          className={`${labelClass} tracking-wide whitespace-nowrap truncate`}
          style={{
            fontWeight: active ? 900 : 510,
            fontSize: 17,
            letterSpacing: ".016em",
            color: active ? PRIMARY_COLOR : TEXT_COLOR,
            paddingLeft: "0px"
          }}
        >
          {safeLabel}
        </span>
      </div>
      {description && (
        <span
          className="text-xs mt-1.5 pl-[33px] pr-2 break-words hidden sm:block text-left"
          style={{
            color: iconInactive.includes(PRIMARY_COLOR.replace("#", "")) ? PRIMARY_COLOR : ICON_INACTIVE,
            lineHeight: 1.27,
            fontWeight: 500,
            whiteSpace: "normal",
            opacity: 0.98,
          }}
        >
          {description}
        </span>
      )}
    </div>
  );

  if (href) {
    const linkHref = href || "#";
    return (
      <li>
        <Link
          href={linkHref}
          aria-current={active ? "page" : undefined}
          className={`${baseClass} ${focusRing} ${active ? activeClass : hoverInactive} ${disabled ? "opacity-60 pointer-events-none grayscale" : ""}`}
          tabIndex={tabIndexVal}
          style={buttonRippleStyle}
          aria-disabled={disabled}
        >
          {content}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <button
        type="button"
        className={`${baseClass} ${focusRing} ${hoverInactive} ${active ? activeClass : ""} ${disabled ? "opacity-60 cursor-not-allowed grayscale" : ""}`}
        onClick={disabled ? undefined : onClick}
        tabIndex={tabIndexVal}
        disabled={disabled}
        aria-disabled={disabled}
        style={buttonRippleStyle}
      >
        {content}
      </button>
    </li>
  );
}