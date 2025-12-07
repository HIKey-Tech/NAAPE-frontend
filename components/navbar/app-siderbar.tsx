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

// Improved Contrast/Visual Hierarchy Theme
const PRIMARY_COLOR = "#12306a";
const SIDEBAR_CARD_BG = "#ffffff";
// ---- Remove shadow ----
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
.sidebar-navitem,
.sidebar-navitem:focus {
  background: transparent;
}
.sidebar-navitem:hover, .sidebar-navitem:focus-visible {
  background: ${PRIMARY_COLOR_LIGHT_BG};
}
.sidebar-navitem:hover .animated-sidebar-icon,
.sidebar-navitem:focus .animated-sidebar-icon,
.bottomnav-item:hover .animated-bottomnav-icon,
.bottomnav-item:focus .animated-bottomnav-icon {
  animation: icon-bounce 0.4s;
  color: ${PRIMARY_COLOR} !important;
  background: ${ICON_ACTIVE_BG};
}
/* ---- Remove navitem box-shadow ---- */
.sidebar-navitem-active, .bottomnav-item-active {
  background: linear-gradient(90deg, ${PRIMARY_COLOR_LIGHT_BG} 90%, #fafdff 100%);
  font-weight: 810;
  color: ${PRIMARY_COLOR} !important;
  position: relative;
  /* box-shadow removed for consistency and flat look */
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
.dropdown-navitem:hover,
.dropdown-navitem:focus {
  background: #e8f2ff !important;
}
.dropdown-navitem:hover .animated-dropdown-icon,
.dropdown-navitem:focus .animated-dropdown-icon {
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
  /* Remove shadow from label */
}
.sidebar-section-spacer {
  margin: 10px 0 6px 0;
  height: 0;
  border-bottom: 2.3px solid ${ICON_BORDER};
  width: 89%;
  margin-left: auto; margin-right: auto;
}
/* Remove sidebar-card box-shadow for flat look */
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
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 62px;
    z-index: 51;
    background: linear-gradient(90deg, #fafdff 0, #dbeaff 100%);
    border-top: 2.3px solid ${ICON_BORDER};
    margin-top: 30px;
    /* flatter, remove boxShadow */
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
    background: linear-gradient(92deg, #dbeaff 0, #c4ddfd 100%);
    color: ${PRIMARY_COLOR};
    font-weight: 810;
    /* Remove box-shadow */
    box-shadow: none;
    border-top: 2px solid ${ACTIVE_BAR};
  }
  .bottomnav-item-active .animated-bottomnav-icon {
    color: ${PRIMARY_COLOR} !important;
    background: ${ICON_ACTIVE_BG};
    border-radius: 12px;
  }
  .bottomnav-dropdown-panel {
    position: absolute;
    left: 7px; right: 7px;
    bottom: 63px;
    background: #fafdff;
    border-radius: 14px;
    border: 2px solid ${ICON_BORDER};
    z-index: 52;
    padding: 8px 0;
    animation: dropdown-fadein 0.14s cubic-bezier(0.42,0,0.58,1);
    /* Remove drop shadow for panel as well */
    box-shadow: none;
    backdrop-filter: blur(2px);
  }
  @keyframes dropdown-fadein {
    0% { transform: translateY(24px); opacity: 0;}
    100% { transform: translateY(0); opacity: 1;}
  }
  .bottomnav-label {
    font-size: 13.4px;
    font-weight: 810;
    color: ${PRIMARY_COLOR};
    letter-spacing: 0.045em;
    text-shadow: none;
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
    <div className="flex items-center gap-4 px-6 py-2 min-w-0 bg-[#f5f8ff] border-t-[2px] border-[#cbdbef]" style={{
      borderRadius: `0 0 ${RADIUS} ${RADIUS}`,
      paddingTop: 19,
      paddingBottom: 19,
      /* Remove boxShadow for flat look */
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

// NavItem with improved alignment and no shadow
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
            color: iconInactive.includes(primaryColorClass()) ? PRIMARY_COLOR : ICON_INACTIVE,
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

  function primaryColorClass() {
    return PRIMARY_COLOR.replace("#", "");
  }

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
        className={`${open ? "block" : "hidden"} absolute left-0 right-0 top-full z-50 bg-[#fcfcff] border border-[${ICON_BORDER}] rounded-xl mt-2 py-2 sm:min-w-[250px] max-w-xs transition-all duration-100`}
        tabIndex={-1}
        role="menu"
        aria-label="News & Publications submenu"
        style={{
          borderRadius: "15px",
          minWidth: 224,
          background: "#fcfcff",
          /* Remove dropdown shadow */
          boxShadow: "none"
        }}
      >
        <li className="px-6 py-1 mb-1 pb-2">
          <span
            style={{
              fontSize: 13.66,
              fontWeight: 900,
              color: PRIMARY_COLOR,
              textTransform: "uppercase",
              letterSpacing: ".085em",
              borderLeft: `4.5px solid ${ACTIVE_BAR}`,
              paddingLeft: 8,
              background: `${SECTION_LABEL_BG}`,
              borderRadius: "8px",
              display: "inline-block",
              /* Remove label shadow */
              boxShadow: "none"
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
              style={{ marginTop: isCreate ? 10 : 0 }}
            >
              {isCreate && (
                <div
                  className="border-t border-[${ICON_BORDER}] my-2"
                  role="separator"
                  aria-hidden="true"
                  style={{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    borderBottomStyle: "dashed",
                    opacity: 0.9,
                  }}
                />
              )}
              <Link
                href={sublink.href ?? "#"}
                className={`
                  flex flex-col items-start gap-0 px-6 py-3 rounded-lg text-[16px] font-semibold
                  transition-all duration-150 hover:bg-[#eaf1fe]
                  ${isActive
                    ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                    : `text-[${TEXT_COLOR}]`
                  }
                `}
                role="menuitem"
                tabIndex={0}
                aria-current={isActive ? "page" : undefined}
                style={{
                  fontWeight: isActive ? 910 : 500,
                  borderLeft: isActive ? `4px solid ${ACTIVE_BAR}` : "4px solid transparent",
                  width: "100%",
                  alignItems: "flex-start",
                  /* Remove menuitem shadow */
                  boxShadow: "none"
                }}
                onClick={() => setOpen(false)}
              >
                <div className="flex items-center w-full min-w-0 gap-3">
                  {React.createElement(
                    subIcon,
                    {
                      className: `w-6 h-6 flex-shrink-0 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-lg` : `text-[${ICON_INACTIVE}]`} group-hover:text-[${PRIMARY_COLOR}]`,
                      "aria-hidden": "true"
                    }
                  )}
                  <span className="ml-1 text-[16px] font-extrabold truncate" style={{ letterSpacing: ".013em" }}>{sublink.label}</span>
                </div>
                {sublink.description && (
                  <span
                    className="text-xs mt-1.5 pl-[34px] pr-0 hidden sm:block text-left w-full break-words"
                    style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 500, whiteSpace: "normal" }}
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
          minWidth: '215px',
          maxWidth: '96vw',
          borderRadius: "15px",
          /* Remove dropdown panel shadow */
          boxShadow: "none"
        }}
      >
        <div className="px-6 py-3 text-[15px] text-gray-500 font-semibold">No items.</div>
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
        minWidth: '215px',
        maxWidth: '96vw',
        borderRadius: "15px",
        /* Remove dropdown panel shadow */
        boxShadow: "none"
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
              `flex flex-col items-start gap-0 px-6 py-3 rounded-lg text-[15.7px] font-semibold transition-all duration-110 hover:bg-[#eaf1fe]
              ${isActive
                ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                : `text-[${TEXT_COLOR}]`
              }`
            }
            tabIndex={0}
            aria-current={isActive ? "page" : undefined}
            style={{
              fontWeight: isActive ? 900 : 520,
              borderLeft: isActive ? `4px solid ${ACTIVE_BAR}` : "4px solid transparent",
              width: "100%",
              alignItems: "flex-start"
            }}
          >
            <div className="flex items-center w-full min-w-0 gap-3">
              <Icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${isActive ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-lg` : `text-[${ICON_INACTIVE}]`} hover:text-[${PRIMARY_COLOR}]`} aria-hidden="true" />
              <span className="bottomnav-label truncate" style={{ letterSpacing: ".011em", fontWeight: 900 }}>{link.label}</span>
            </div>
            {link.description && (
              <span
                className="text-xs text-left mt-1.5 pl-[34px] pr-0 hidden sm:block w-full break-words"
                style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 500, whiteSpace: "normal" }}
              >
                {link.description}
              </span>
            )}
          </Link>
        );
      })}
      {createTab && (
        <>
          <div className="border-t" style={{ borderColor: ICON_BORDER, margin: '0.75rem 0', width: "92%", marginLeft: "auto", marginRight: "auto", opacity: 0.9 }} />
          <Link
            key={createTab.label}
            href={createTab.href ?? "#"}
            onClick={onClose}
            className={
              `flex flex-col items-start gap-0 px-6 py-3 rounded-lg text-[15.7px] font-semibold transition-all duration-110 hover:bg-[#eaf1fe]
              ${activeHref === createTab.href
                ? `text-[${PRIMARY_COLOR}] font-extrabold bg-[${PRIMARY_COLOR_LIGHT_BG}]`
                : `text-[${TEXT_COLOR}]`
              }`
            }
            tabIndex={0}
            aria-current={activeHref === createTab.href ? "page" : undefined}
            style={{
              fontWeight: activeHref === createTab.href ? 900 : 520,
              borderLeft: activeHref === createTab.href ? `4px solid ${ACTIVE_BAR}` : "4px solid transparent",
              width: "100%",
              alignItems: "flex-start"
            }}
          >
            <div className="flex items-center w-full min-w-0 gap-3">
              {createTab.icon ? (
                <createTab.icon className={`w-6 h-6 mr-2 animated-dropdown-icon ${activeHref === createTab.href ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-lg` : `text-[${ICON_INACTIVE}]`}`} aria-hidden="true" />
              ) : (
                <FaPlusSquare className={`w-6 h-6 mr-2 animated-dropdown-icon ${activeHref === createTab.href ? `text-[${PRIMARY_COLOR}] bg-[${ICON_ACTIVE_BG}] rounded-lg` : `text-[${ICON_INACTIVE}]`}`} aria-hidden="true" />
              )}
              <span className="bottomnav-label truncate" style={{ letterSpacing: ".011em", fontWeight: 900 }}>{createTab.label}</span>
            </div>
            {createTab.description && (
              <span
                className="text-xs text-left mt-1.5 pl-[34px] pr-0 hidden sm:block w-full break-words"
                style={{ color: ICON_INACTIVE, lineHeight: 1.21, fontWeight: 500, whiteSpace: "normal" }}
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
    <div className="hidden sm:block sidebar-container sticky bg-gradient-to-b from-[#fafdff] to-[#dbeaff] pt-2 h-full min-h-0 ">
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
        style={{
          marginTop: 32,
          /* Remove box-shadow for flat look */
          boxShadow: "none"
        }}
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
                      fontWeight: isPubActive ? 900 : 610,
                      color: isPubActive ? PRIMARY_COLOR : TEXT_COLOR,
                      letterSpacing: ".025em",
                      /* Remove shadow from icon label */
                      textShadow: "none"
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
                    fontWeight: isActive ? 900 : 600,
                    color: isActive ? PRIMARY_COLOR : TEXT_COLOR,
                    letterSpacing: ".025em",
                    textShadow: "none"
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

// Main Improved Sidebar Component
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
          background: "linear-gradient(178deg,#fafdff 70%,#dbeaff 100%)",
          borderRadius: 0,
          border: `2.2px solid ${ICON_BORDER}`,
          minHeight: "99vh",
          minWidth: 0,
          // Remove sidebar nav shadow
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
          <PublicationsDropdown pathname={pathname} />
          <SectionSpacer />
          <SectionLabel>ACTIVITIES</SectionLabel>
          {Array.isArray(navItemsMain) && navItemsMain.length > 1 && navItemsMain.slice(1)}
        </ul>
        <div style={{
          background: "linear-gradient(90deg,#fafdff 0,#eaf3ff 100%)",
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