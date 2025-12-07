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
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { toast } from "sonner";

// Enhanced Contrast/Alignment Colors and Style Variables
const PRIMARY_COLOR = "#17447b";
const PRIMARY_COLOR_LIGHT_BG = "#eaf3fb";
const SIDEBAR_CARD_BG = "#fff";
const SIDEBAR_SHADOW = "0 2px 32px 0 rgba(44,70,115,0.07), 0 1px 4px 0 rgba(10,30,60,0.09)";
const TEXT_COLOR = "#1a2337"; // increased contrast
const ICON_INACTIVE = "#889ec2"; // sharper than #afbdd1
const ICON_ACTIVE_BG = "rgba(23,68,123,0.11)";
const ICON_BORDER = "#c7d6ea";
const SECTION_LABEL_BG = "#e6ecf5";
const PROFILE_NAME = "#113163"; // bolder by a shade
const PROFILE_EMAIL = "#7082a1"; // bolder by a shade
const RADIUS = "18px";
const SIDEBAR_SECTION_LABEL = "#394d65";
const ACTIVE_BAR = "#154aa2";
const SIDEBAR_SECTION_BG = "#eaf2fa";

const iconAnimationStyles = `
@keyframes icon-bounce {
  0%,100% { transform: translateY(0);}
  15% { transform: translateY(-5px);}
  30% { transform: translateY(3px);}
  45% { transform: translateY(-2px);}
  60% { transform: translateY(1.5px);}
  75% { transform: translateY(-1px);}
}
.animated-sidebar-icon, .animated-bottomnav-icon, .animated-dropdown-icon {
  transition: color 0.22s, background 0.17s;
}
.sidebar-navitem:hover,
.sidebar-navitem:focus {
  background: ${PRIMARY_COLOR_LIGHT_BG};
}
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon,
.bottomnav-item:hover .animated-bottomnav-icon,
.bottomnav-item:focus .animated-bottomnav-icon {
  animation: icon-bounce 0.45s;
  color: ${PRIMARY_COLOR} !important;
  background: ${ICON_ACTIVE_BG};
}
.sidebar-navitem-active, .bottomnav-item-active {
  background: ${PRIMARY_COLOR_LIGHT_BG};
  font-weight: 700;
  color: ${PRIMARY_COLOR} !important;
  position: relative;
  box-shadow: 0px 2.5px 12px 0 rgba(65,79,119,0.08); /* subtle highlight */
}
.sidebar-navitem-active::before {
  content: "";
  position: absolute;
  left: 0.18rem; top: 0.6rem; bottom: 0.6rem;
  width: 5px;
  background: ${ACTIVE_BAR};
  border-radius: 8px;
}
.sidebar-navitem-active .animated-sidebar-icon,
.bottomnav-item-active .animated-bottomnav-icon {
  animation: icon-bounce 0.7s;
  color: ${PRIMARY_COLOR} !important;
}
.dropdown-navitem:hover,
.dropdown-navitem:focus {
  background: #f0f5fb;
}
.dropdown-navitem:hover .animated-dropdown-icon,
.dropdown-navitem:focus .animated-dropdown-icon {
  animation: icon-bounce 0.5s;
  color: ${PRIMARY_COLOR} !important;
}
.dropdown-active .animated-dropdown-icon {
  animation: icon-bounce 0.7s;
  color: ${PRIMARY_COLOR} !important;
}
.sidebar-section-label {
  color: ${SIDEBAR_SECTION_LABEL};
  font-size: 13.5px;
  font-weight: 730;
  letter-spacing: 0.07em;
  padding-left: 1.6rem;
  padding-top: 0.49rem;
  padding-bottom: 0.17rem;
  text-transform: uppercase;
  background: ${SECTION_LABEL_BG};
  border-radius: 13px 13px 0 0;
  margin-bottom: 0.26rem;
  margin-top: 0.79rem;
  overflow: visible;
  border-left: 4px solid ${ACTIVE_BAR};
  text-shadow: 0 1px 0 #fff, 0 0.5px 0 #e5eefd;
}
.sidebar-section-spacer {
  margin: 9px 0 4px 0;
  height: 0;
  border-bottom: 1.7px solid ${ICON_BORDER};
  width: 90%;
  margin-left: auto; margin-right: auto;
}
.sidebar-card {
  background: ${SIDEBAR_CARD_BG};
  border-radius: ${RADIUS};
  border: 1.9px solid ${ICON_BORDER};
  box-shadow: ${SIDEBAR_SHADOW};
}
.sidebar-card > *:first-child { border-top-left-radius: ${RADIUS}; border-top-right-radius: ${RADIUS}; }
.sidebar-card > *:last-child { border-bottom-left-radius: ${RADIUS}; border-bottom-right-radius: ${RADIUS}; }
::-webkit-scrollbar-thumb { background: #e1eaf2; border-radius: 6px;}
::-webkit-scrollbar { width: 8px; background: transparent;}
@media (max-width: 639px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 60px;
    z-index: 51;
    background: linear-gradient(90deg, #fafdff 0, #e8eef7 100%);
    border-top: 1.5px solid ${ICON_BORDER};
    margin-top: 28px;
    box-shadow: 0px -4px 15px 0 rgba(17,30,65,0.06);
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
    font-size: 13px;
    color: ${TEXT_COLOR};
    gap: 6px;
    text-align: center;
    transition: background 0.18s;
    min-width: 0; min-height: 0;
    height: 60px;
    font-weight: 500;
    border-radius: 18px 18px 0 0;
    margin: 0 0.5px;
    cursor: pointer;
    border: none;
    outline: none;
  }
  .bottomnav-item .animated-bottomnav-icon {
    width: 27px;
    height: 27px;
    display: block;
    margin: 0 auto 1.5px auto;
    color: ${ICON_INACTIVE};
    transition: color 0.17s, background 0.14s;
    background: none;
    border-radius: 50%;
  }
  .bottomnav-item-active {
    background: linear-gradient(92deg, #eaf3fb 0, #e7eafc 100%);
    color: ${PRIMARY_COLOR};
    font-weight: 700;
    box-shadow: 0px -1.5px 7px 0 rgba(22,40,70,0.09);
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: ${PRIMARY_COLOR} !important;
    background: ${ICON_ACTIVE_BG};
    border-radius: 9px;
  }
  .bottomnav-dropdown-panel {
    position: absolute;
    left: 7px; right: 7px;
    bottom: 61px;
    background: #fafdff;
    border-radius: 14px;
    border: 1.8px solid ${ICON_BORDER};
    z-index: 52;
    padding: 8px 0;
    animation: dropdown-fadein 0.18s cubic-bezier(0.42,0,0.58,1);
    box-shadow: 0px 10px 32px 0 rgba(42,80,140,0.08);
    backdrop-filter: blur(2px);
  }
  @keyframes dropdown-fadein {
    0% { transform: translateY(22px); opacity: 0;}
    100% { transform: translateY(0); opacity: 1;}
  }
  .bottomnav-label {
    font-size: 13px;
    font-weight: 700;
    color: ${PRIMARY_COLOR};
    letter-spacing: 0.04em;
    text-shadow: 0 1px 1.2px #fafdff;
  }
  .sidebar-container,
  .mobile-topbar {
    display: none !important;
  }
}
@media (min-width: 640px) {
  .mobile-bottom-nav { display: none !important; }
}
`;

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
  {
    label: "Home",
    icon: FaHome,
    href: "/dashboard",
  },
  {
    label: "Training & Certifications",
    icon: FaChalkboardTeacher,
    href: "/training",
  },
  {
    label: "Events",
    icon: FaCalendarAlt,
    href: "/events",
  },
  {
    label: "Forum",
    icon: FaComments,
    href: "/forum",
  },
  {
    label: "Subscription",
    icon: FaIdBadge,
    href: "/subscription",
    description: "Your membership subscription",
  },
  {
    label: "Payment History",
    icon: FaCreditCard,
    href: "/payments",
    description: "All your payment records",
  },
];

const publicationsDropdownLinks: NavLink[] = [
  {
    label: "All Publications",
    icon: FaBook,
    href: "/publications",
    group: "Publications",
    description: "Browse all publications",
  },
  {
    label: "Create Publication",
    icon: FaPlusSquare,
    href: "/publications/new",
    group: "Publications",
    description: "Add a new publication",
  },
  {
    label: "News",
    icon: FaNewspaper,
    href: "/news",
    group: "News",
    description: "Latest news updates",
  },
];

const navLinksSecondary: NavLink[] = [
  {
    label: "Subscription",
    icon: FaIdBadge,
    href: "/subscription",
    description: "Your membership subscription"
  },
  {
    label: "Payment History",
    icon: FaCreditCard,
    href: "/payments",
    description: "All your payment records"
  },
];

const organizePublicationTabsForMobile = (list: NavLink[]) => {
  return [
    ...list.filter(l => l.group === "Publications"),
    ...list.filter(l => l.group === "News"),
  ];
};
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

function SidebarProfileCard({ user }: { user: User }) {
  if (!user || (!user.name && !user.email)) return null;
  return (
    <div className="flex items-center gap-4 px-5 py-3 min-w-0" style={{ paddingTop: 22, paddingBottom: 22 }}>
      <div className="relative flex-shrink-0">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name || user.email || "User Avatar"}
            width={48}
            height={48}
            className="rounded-full border-2 border-[#c8def7] object-cover select-none"
            style={{
              width: 48,
              height: 48,
              background: "#e3eef9",
              boxShadow: "0px 2px 12px #e9f2fc"
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full border-2 border-[#c8def7] object-cover select-none"
            style={{
              width: 48,
              height: 48,
              background: "#e3eef9",
              fontSize: 22,
              fontWeight: 800,
              color: "#17447b",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              userSelect: "none",
              boxShadow: "0px 2px 13px #ddeafb"
            }}
            aria-label={user.name || user.email}
          >
            {getUserInitials(user)}
          </div>
        )}
        <span
          style={{
            position: "absolute",
            right: -1.5,
            bottom: -2,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#10c554",
            border: "2.6px solid #fafdff",
            boxShadow: "0 1px 3px 0 #c9e3d6"
          }}
          aria-label="online"
        />
      </div>
      <div className="flex flex-col min-w-0" style={{ lineHeight: "1.15", alignItems: "flex-start" }}>
        <span className="truncate text-[15.7px] font-bold" style={{ color: PROFILE_NAME, letterSpacing: ".015em" }}>
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

// NavItem - robust for all combinations, label and accessibility edge cases
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
    `sidebar-navitem group relative flex items-center w-full px-6 py-2.5 rounded-lg text-base gap-4 font-semibold transition-all duration-100 whitespace-nowrap focus:outline-none focus:ring-2 border-l-4 border-transparent`;
  const focusRing = `focus:ring-[${PRIMARY_COLOR}]`;
  const activeClass = `sidebar-navitem-active bg-[${PRIMARY_COLOR_LIGHT_BG}] text-[${PRIMARY_COLOR}] border-l-4 border-[${ACTIVE_BAR}]`;
  const hoverInactive = `hover:bg-[#f2f7fa] text-[${TEXT_COLOR}] transition-all duration-100`;
  const iconActive = `animated-sidebar-icon text-[${PRIMARY_COLOR}] scale-110 bg-[${ICON_ACTIVE_BG}] rounded-[9px]`;
  const iconInactive = `animated-sidebar-icon text-[${ICON_INACTIVE}]`;
  const buttonRippleStyle = {};

  const tabIndexVal = disabled ? -1 : tabIndex;

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
          <Icon className={`w-6 h-6 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
          <span className={`flex-1 ml-1 text-left ${labelClass}`} style={{ fontWeight: active ? 730 : 510, fontSize: 15.3, letterSpacing: ".012em" }}>
            {label}
          </span>
          {children ? (
            <svg
              className={`ml-auto h-3.5 w-3.5 transition-transform ${ariaExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 20 20"
              aria-hidden="true"
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
      <div className="flex items-center min-w-0 gap-2">
        <Icon className={`w-6 h-6 flex-shrink-0 ${active ? iconActive : iconInactive}`} />
        <span
          className={`${labelClass} tracking-wide whitespace-nowrap truncate`}
          style={{ fontWeight: active ? 720 : 510, fontSize: 15.3, letterSpacing: ".012em" }}
        >
          {safeLabel}
        </span>
      </div>
      {description && (
        <span
          className="text-xs mt-0.5 pl-[31px] pr-1 break-words hidden sm:block text-left"
          style={{
            color: ICON_INACTIVE,
            lineHeight: 1.23,
            fontWeight: 420,
            whiteSpace: "normal",
            paddingTop: 1
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

function PublicationsDropdown({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const isChildActive = publicationsDropdownLinks.some(
    (link) =>
      (pathname === link.href) ||
      (link.href && pathname?.startsWith(link.href))
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement | HTMLUListElement>) => {
    if (
      dropdownRef.current &&
      e.relatedTarget &&
      !dropdownRef.current.contains(e.relatedTarget as Node)
    ) {
      setOpen(false);
    }
  };

  const publicationTabs = [
    ...publicationsDropdownLinks.filter(l => l.group === "Publications" && l.label !== "Create Publication"),
    ...publicationsDropdownLinks.filter(l => l.group === "News"),
    ...publicationsDropdownLinks.filter(l => l.label === "Create Publication"),
  ];

  return (
    <NavItem
      icon={FaSearch}
      label="News & Publications"
      active={isChildActive}
      asButton
      ariaExpanded={open}
      onClick={() => setOpen(v => !v)}
      disabled={false}
    >
      <ul
        ref={dropdownRef}
        onBlur={handleBlur}
        className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-50 bg-[#fafdff] border border-[${ICON_BORDER}] rounded-xl mt-2 py-2 sm:min-w-[235px] max-w-xs transition-all duration-100 shadow-xl`}
        tabIndex={-1}
        role="menu"
        aria-label="News & Publications submenu"
        style={{
          borderRadius: "14px",
          minWidth: 210,
          background: "#fafdff",
          boxShadow: "0 12px 36px 0 rgba(12,50,110,0.13), 0 2px 8px 0 rgba(22,40,77,0.06)"
        }}
      >
        <li className="px-5 py-1 mb-1">
          <span
            style={{
              fontSize: 13.4,
              fontWeight: 800,
              color: SIDEBAR_SECTION_LABEL,
              textTransform: "uppercase",
              letterSpacing: ".06em",
              borderLeft: `3.5px solid ${ACTIVE_BAR}`,
              paddingLeft: 6,
              background: `${SECTION_LABEL_BG}`,
              borderRadius: "7px",
              display: "inline-block"
            }}
            className="sidebar-section-label"
          >
            Publications & News
          </span>
        </li>
        {publicationTabs.length === 0 && (
          <li className="px-4 py-3 text-sm text-gray-400" aria-disabled="true">
            No publications available.
          </li>
        )}
        {publicationTabs.map((sublink, idx) => {
          if (!sublink || !sublink.label) return null;
          const isActive = pathname === sublink.href;
          const isCreate = sublink.label === "Create Publication";
          const subIcon = sublink.icon || FaBook;
          return (
            <li
              key={sublink.label}
              className={`dropdown-navitem${isActive ? " dropdown-active" : ""} group`}
              style={{ marginTop: isCreate ? 4 : 0 }}
            >
              {isCreate && (
                <div
                  className="border-t border-[${ICON_BORDER}] my-2"
                  role="separator"
                  aria-hidden="true"
                  style={{ width: "85%", marginLeft: "auto", marginRight: "auto", borderBottomStyle: "dashed" }}
                />
              )}
              <Link
                href={sublink.href ?? "#"}
                className={`
                  flex flex-col items-start gap-0 px-5 py-2.5 rounded-lg text-[15.3px] font-semibold
                  transition-all duration-100 hover:bg-[#f0f7fb]
                  ${isActive
                    ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                    : `text-[${TEXT_COLOR}]`
                  }
                `}
                role="menuitem"
                tabIndex={0}
                aria-current={isActive ? "page" : undefined}
                style={{
                  fontWeight: isActive ? 800 : 520,
                  borderLeft: isActive ? `3px solid ${ACTIVE_BAR}` : "3px solid transparent",
                  width: "100%",
                  alignItems: "flex-start"
                }}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center w-full min-w-0 gap-2">
                  {React.createElement(
                    subIcon,
                    {
                      className: `w-5 h-5 flex-shrink-0 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-md` : `text-[${ICON_INACTIVE}]`} group-hover:text-[${PRIMARY_COLOR}]`,
                      "aria-hidden": "true"
                    }
                  )}
                  <span className="ml-1 text-[15.3px] font-semibold truncate" style={{ letterSpacing: ".009em" }}>{sublink.label}</span>
                </div>
                {sublink.description && (
                  <span
                    className="text-xs mt-0.5 pl-[30px] pr-0 hidden sm:block text-left w-full break-words"
                    style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 400, whiteSpace: "normal" }}
                  >
                    {sublink.description}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </NavItem>
  );
}

function BottomNavDropdown({
  open,
  onClose,
  items,
  activeHref
}: {
  open: boolean;
  onClose: () => void;
  items: NavLink[];
  activeHref: string | null;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function listener(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    function keyHandler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [open, onClose]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHref]);

  if (!open) return null;
  if (!Array.isArray(items) || items.length === 0)
    return (
      <div
        ref={dropdownRef}
        className="bottomnav-dropdown-panel"
        tabIndex={-1}
        aria-label="News & Publications submenu"
        style={{
          minWidth: '205px',
          maxWidth: '95vw',
          borderRadius: "14px",
          boxShadow: "0 6px 38px 0 rgba(28,42,65,.14)"
        }}
      >
        <div className="px-5 py-3 text-sm text-gray-500 font-semibold">No items.</div>
      </div>
    );

  const createTab = items.find(link => link.label === "Create Publication");
  const nonCreateTabs = items.filter(link => link.label !== "Create Publication");

  return (
    <div
      ref={dropdownRef}
      className="bottomnav-dropdown-panel"
      tabIndex={-1}
      aria-label="News & Publications submenu"
      style={{
        minWidth: '205px',
        maxWidth: '95vw',
        borderRadius: "14px",
        boxShadow: "0 6px 34px 0 rgba(26,42,86,.14)"
      }}
    >
      {nonCreateTabs.map(link => {
        if (!link || !link.label) return null;
        const Icon = link.icon || FaBook;
        const isActive = activeHref === link.href || (!!link.href && !!activeHref && activeHref.startsWith(link.href));
        return (
          <Link
            key={link.label}
            href={link.href ?? "#"}
            onClick={onClose}
            className={
              `flex flex-col items-start gap-0 px-5 py-3 rounded-lg text-[15.2px] font-semibold transition-all duration-90 hover:bg-[#f7fafe] 
              ${isActive
                ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                : `text-[${TEXT_COLOR}]`
              }`
            }
            tabIndex={0}
            aria-current={isActive ? "page" : undefined}
            style={{
              fontWeight: isActive ? 800 : 520,
              borderLeft: isActive ? `3px solid ${ACTIVE_BAR}` : "3px solid transparent",
              width: "100%",
              alignItems: "flex-start"
            }}
          >
            <div className="flex items-center w-full min-w-0 gap-2">
              <Icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-md` : `text-[${ICON_INACTIVE}]`} hover:text-[${PRIMARY_COLOR}]`} aria-hidden="true" />
              <span className="bottomnav-label truncate" style={{ letterSpacing: ".009em" }}>{link.label}</span>
            </div>
            {link.description && (
              <span
                className="text-xs text-left mt-0.5 pl-[30px] pr-0 hidden sm:block w-full break-words"
                style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 400, whiteSpace: "normal" }}
              >
                {link.description}
              </span>
            )}
          </Link>
        );
      })}
      {createTab && (
        <>
          <div className="border-t" style={{ borderColor: ICON_BORDER, margin: '0.55rem 0', width: "88%", marginLeft: "auto", marginRight: "auto" }} />
          <Link
            key={createTab.label}
            href={createTab.href ?? "#"}
            onClick={onClose}
            className={
              `flex flex-col items-start gap-0 px-5 py-3 rounded-lg text-[15.2px] font-semibold transition-all duration-90 hover:bg-[#f7fafe] 
              ${activeHref === createTab.href
                ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                : `text-[${TEXT_COLOR}]`
              }`
            }
            tabIndex={0}
            aria-current={activeHref === createTab.href ? "page" : undefined}
            style={{
              fontWeight: activeHref === createTab.href ? 800 : 520,
              borderLeft: activeHref === createTab.href ? `3px solid ${ACTIVE_BAR}` : "3px solid transparent",
              width: "100%",
              alignItems: "flex-start"
            }}
          >
            <div className="flex items-center w-full min-w-0 gap-2">
              {createTab.icon ? (
                <createTab.icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${activeHref === createTab.href ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-md` : `text-[${ICON_INACTIVE}]`}`} aria-hidden="true" />
              ) : (
                <FaPlusSquare className={`w-6 h-6 mr-2 animated-dropdown-icon ${activeHref === createTab.href ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-md` : `text-[${ICON_INACTIVE}]`}`} aria-hidden="true" />
              )}
              <span className="bottomnav-label truncate" style={{ letterSpacing: ".009em" }}>{createTab.label}</span>
            </div>
            {createTab.description && (
              <span
                className="text-xs text-left mt-0.5 pl-[30px] pr-0 hidden sm:block w-full break-words"
                style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 400, whiteSpace: "normal" }}
              >
                {createTab.description}
              </span>
            )}
          </Link>
        </>
      )}
    </div>
  );
}

function SidebarContainer({
  SidebarContent
}: { SidebarContent: React.ReactNode }) {
  return (
    <div className="hidden sm:block sidebar-container sticky bg-gradient-to-b from-[#fafdff] to-[#e8eef7] pt-2 h-full min-h-0 ">
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
  onSignOut
}: {
  pathname: string | null;
  onSignOut: () => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const bottomTabs = [
    {
      key: "home",
      icon: FaHome,
      label: "Home",
      href: "/dashboard"
    },
    {
      key: "publications",
      icon: FaBook,
      label: "Publications",
      dropdown: publicationsDropdownLinksMobile,
      iconDropdown: FaSearch
    },
    {
      key: "training",
      icon: FaChalkboardTeacher,
      label: "Training",
      href: "/training"
    },
    {
      key: "events",
      icon: FaCalendarAlt,
      label: "Events",
      href: "/events"
    },
    {
      key: "forum",
      icon: FaComments,
      label: "Forum",
      href: "/forum"
    },
    {
      key: "subscription",
      icon: FaIdBadge,
      label: "Subscription",
      href: "/subscription"
    },
    {
      key: "payments",
      icon: FaCreditCard,
      label: "Payments",
      href: "/payments"
    }
  ];

  const isPubActive = publicationsDropdownLinksMobile.some(l =>
    l.href && (pathname === l.href || pathname?.startsWith(l.href))
  );

  const visibleTabKeys = ["home", "publications", "events", "forum", "training", "subscription", "payments"];
  const filteredTabs = bottomTabs.filter(tab => visibleTabKeys.includes(tab.key));

  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [dropdownOpen]);

  return (
    <div ref={navRef}>
      <nav
        className="mobile-bottom-nav sticky"
        style={{ marginTop: 28 }}
        role="navigation"
        aria-label="Mobile bottom navigation"
      >
        <ul>
          {filteredTabs.map((tab) => {
            if (tab.dropdown && Array.isArray(tab.dropdown)) {
              // News & Publications dropdown
              return (
                <li key={tab.key} style={{ position: "relative", zIndex: dropdownOpen ? 100 : undefined }}>
                  <button
                    type="button"
                    className={`bottomnav-item ${isPubActive ? "bottomnav-item-active" : ""}`}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                    aria-label="News & Publications"
                    onClick={() => setDropdownOpen((v) => !v)}
                    tabIndex={0}
                    style={{
                      zIndex: dropdownOpen ? 100 : undefined,
                      fontWeight: isPubActive ? 700 : 510,
                      color: isPubActive ? PRIMARY_COLOR : TEXT_COLOR,
                      letterSpacing: ".02em"
                    }}
                  >
                    {tab.iconDropdown ? (
                      <tab.iconDropdown className="animated-bottomnav-icon" aria-hidden="true" />
                    ) : (
                      <FaBook className="animated-bottomnav-icon" aria-hidden="true" />
                    )}
                    <span className="bottomnav-label">{tab.label}</span>
                  </button>
                  <BottomNavDropdown
                    open={dropdownOpen}
                    onClose={() => setDropdownOpen(false)}
                    items={tab.dropdown}
                    activeHref={pathname}
                  />
                </li>
              );
            }
            const isActive = tab.href ? (
              pathname === tab.href ||
              (pathname?.startsWith(tab.href) && tab.href !== "/dashboard")
            ) : false;
            const TabIcon = tab.icon || FaHome;
            return (
              <li key={tab.key}>
                <Link
                  href={tab.href ?? "#"}
                  className={`bottomnav-item p-2 ${isActive ? "bottomnav-item-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  tabIndex={0}
                  aria-label={tab.label}
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    fontWeight: isActive ? 700 : 510,
                    color: isActive ? PRIMARY_COLOR : TEXT_COLOR,
                    letterSpacing: ".02em"
                  }}
                >
                  <TabIcon className="animated-bottomnav-icon" aria-hidden="true" />
                  <span className="bottomnav-label">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

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

  const SidebarContent = (
    <>
      <style>{iconAnimationStyles}</style>
      <nav
        className={`
          sidebar-card
          w-[90px] sticky sm:w-[270px] max-w-[270px]
          min-w-0 sm:min-w-[215px]
          border-none h-screen
          flex flex-col justify-between z-50
          px-1.5 pb-2 pt-0
          sidebar-mobile sm:sticky sm:top-0 sidebar-container
        `}
        aria-label="Sidebar Navigation"
        role="navigation"
        style={{
          background: "linear-gradient(172deg,#fafdff 74%,#e8eef7 100%)",
          borderRadius: 0,  // removed rounded border here!!
          border: `1.8px solid ${ICON_BORDER}`,
          minHeight: "99vh",
          minWidth: 0,
          boxShadow: SIDEBAR_SHADOW
        }}
      >
        {/* Logo & Brand area */}
        <header className="flex flex-col py-2 px-3" style={{ borderBottom: `1.8px solid ${ICON_BORDER}` }}>
          <div className="flex justify-between items-center gap-2 w-full">
            <div className="flex items-center gap-3 min-w-full">
              <Link
                href="/"
                aria-label="Home"
                className="block bg-white shrink-0 focus:outline-none focus:ring-2 focus:ring-[#2259ae] rounded-lg"
                tabIndex={0}
                style={{
                  border: `2px solid #e2ebf8`, // higher contrast
                  boxShadow: "0 1.5px 10px #e7f1fc"
                }}
              >
                <div
                  style={{
                    background: ``,
                    borderRadius: "12px",
                    border: "none",
                    padding: 4,
                    alignItems: "center",
                    display: "flex"
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={63}
                    height={41}
                    className="h-9 w-auto object-contain"
                    priority
                  />
                </div>
              </Link>
              <div className="min-w-full flex items-center">
                <span
                  className="hidden sm:inline-block ml-2 text-[13.5px] font-extrabold leading-tight truncate max-w-[176px]"
                  style={{
                    color: PROFILE_NAME,
                    letterSpacing: ".022em",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    textShadow: "0 1px 1.2px #fafdff"
                  }}
                >
                  NAAPE,<br/> Nigeria association<br />of aircraft pilots <br/> & engineers
                </span>
              </div>
            </div>
            {/* Desktop: collapse/expand sidebar - not implemented */}
            <button
              type="button"
              aria-label="Collapse sidebar (not yet implemented)"
              className="ml-1 sm:flex hidden items-center justify-center rounded-md transition-colors p-[5px] focus:outline-none focus:ring-2"
              tabIndex={-1}
              disabled={true}
              style={{
                border: "1.5px solid #d7e2ed",
                background: "none",
                color: ICON_INACTIVE,
                opacity: 0.55,
                cursor: "not-allowed"
              }}
              aria-disabled="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#768EA6]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#AEBFD3" strokeWidth="1.5" fill="#fff" />
                <path d="M13.5 9l-3 3 3 3" stroke="#768EA6" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </header>
        {/* Navigation */}
        <ul className="flex-1 w-full flex flex-col py-[20px] px-0 gap-0.5 overflow-y-auto" style={{ minHeight: 0 }}>
          <SectionLabel>MAIN</SectionLabel>
          {/* Home tab always */}
          {Array.isArray(navItemsMain) && navItemsMain.length > 0 ? navItemsMain[0] : null}
          {/* News & Publications dropdown */}
          <PublicationsDropdown pathname={pathname} />
          <SectionSpacer />
          <SectionLabel>ACTIVITIES</SectionLabel>
          {Array.isArray(navItemsMain) && navItemsMain.length > 1 && navItemsMain.slice(1)}
        </ul>
        <div style={{
          background: "linear-gradient(90deg,#fafdff 0,#e8eef7 100%)",
          borderTop: `1.9px solid ${ICON_BORDER}`,
          marginTop: "2px"
        }}>
          <ul className="flex flex-col py-2 px-0">
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
            borderTop: `1.8px solid ${ICON_BORDER}`,
            background: "#fafdff",
            borderBottomLeftRadius: RADIUS,
            borderBottomRightRadius: RADIUS,
            marginTop: 13
          }}
        >
          <SidebarProfileCard user={user ?? {}} />
        </footer>
      </nav>
    </>
  );

  return (
    <div className="sticky">
      <style>{iconAnimationStyles}</style>
      <SidebarContainer SidebarContent={SidebarContent} />
      <MobileBottomNavBar pathname={pathname} onSignOut={handleSignOut} />
    </div>
  );
}