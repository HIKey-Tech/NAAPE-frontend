"use client";

import {
  FaHome,
  FaNewspaper,
  FaBook,
  FaPlusSquare,
  FaCalendarAlt,
  FaComments,
  FaSignOutAlt,
  FaCreditCard,
  FaIdBadge,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaTimes,
  FaCrown,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import React, { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authcontext";
import { useSubscriptionStatus } from "@/hooks/useSubscription";
import { LogoutDialog } from "@/components/ui/logout-dialog";

// --- Types ---
type User = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: "admin" | "editor" | "member";
};

type NavLink = {
  label: string;
  icon: React.ElementType;
  href?: string;
  group?: string;
};

// --- Config ---
const newsPublicationsLinks: NavLink[] = [
  { label: "All News", icon: FaNewspaper, href: "/news", group: "News" },
  { label: "Browse Publications", icon: FaBook, href: "/publications/browse", group: "Publications" },
  { label: "My Publications", icon: FaBook, href: "/publications", group: "Publications" },
  { label: "Create Publication", icon: FaPlusSquare, href: "/publications/new", group: "Publications" },
];

const navLinksMain: NavLink[] = [
  { label: "Home", icon: FaHome, href: "/dashboard" },
  { label: "Events", icon: FaCalendarAlt, href: "/member/events" },
  { label: "Forum", icon: FaComments, href: "/forum" },
];

const navLinksSecondary: NavLink[] = [
  { label: "Subscription", icon: FaIdBadge, href: "/subscription" },
  { label: "Payment History", icon: FaCreditCard, href: "/payments" },
];

// --- Components ---

function GroupLabel({ label }: { label: string }) {
  return (
    <div className="px-4 mt-6 mb-2 text-[10px] uppercase tracking-widest font-bold text-slate-400">
      {label}
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active,
  onClick,
  asButton,
  disabled
}: {
  icon: React.ElementType,
  label: string,
  href?: string,
  active?: boolean,
  onClick?: () => void,
  asButton?: boolean,
  disabled?: boolean
}) {
  const baseClass = `
    flex items-center w-full px-4 py-2.5 rounded-xl text-sm font-medium gap-3 transition-all duration-200 group relative
    ${active
      ? "text-primary bg-primary/5 font-bold shadow-sm ring-1 ring-black/5"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  const content = (
    <>
      <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${active ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
      <span className="truncate">{label}</span>
      {active && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary" />}
    </>
  );

  if (asButton) {
    return (
      <button
        type="button"
        className={baseClass}
        onClick={onClick}
        disabled={disabled}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={href || "#"} className={baseClass}>
      {content}
    </Link>
  );
}

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
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center w-full px-4 py-2.5 rounded-xl text-sm font-medium gap-3 transition-all duration-200 group
          ${isActive ? "text-primary bg-primary/5 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-primary" : "text-slate-400 group-hover:text-primary"}`} />
        <span className="flex-1 text-left truncate">{label}</span>
        <span className="text-slate-400">
          {open ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </span>
      </button>
      {open && (
        <div className="pl-4 mt-1 space-y-0.5 border-l-2 border-slate-100 ml-6 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

function SidebarProfileCard({ user }: { user: User }) {
  const { data: subscriptionStatus } = useSubscriptionStatus();

  if (!user || (!user.name && !user.email)) return null;

  const showPremiumBadge = user.role === "admin" ||
    user.role === "editor" ||
    (subscriptionStatus?.hasSubscription && subscriptionStatus?.status === "active");

  const premiumText = subscriptionStatus?.tier === "premium" ? "Premium" :
    user.role === "admin" ? "Admin" :
      user.role === "editor" ? "Editor" : "Subscribed";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="flex items-center gap-3 px-3 py-3 border-t border-slate-100 mt-2 bg-slate-50/50 rounded-xl mx-2">
      <div className="relative">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full border border-slate-200 object-cover bg-white"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center shadow-sm text-white font-bold text-xs">
            {getInitials(user.name)}
          </div>
        )}
        {showPremiumBadge && (
          <div className="absolute -bottom-1 -right-1 bg-amber-100 text-amber-600 p-0.5 rounded-full border border-white shadow-sm">
            <FaCrown size={10} />
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 truncate max-w-[120px]">{user.name || "User"}</span>
          {showPremiumBadge && (
            <span className="text-[9px] uppercase font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-100">
              {premiumText}
            </span>
          )}
        </div>
        <span className="text-[10px] text-slate-500 truncate max-w-[140px]">{user.email}</span>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, user: authUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const user: User = {
    name: authUser?.name,
    email: authUser?.email,
    avatarUrl: authUser?.profile?.image?.url,
    role: authUser?.role as any,
  };

  // Close mobile menu on path change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const isNewsPubsDropdownActive = newsPublicationsLinks.some(l => pathname === l.href || pathname?.startsWith(l.href || ""));

  const SidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-center sm:justify-start">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <Image src="/logo.png" alt="NAAPE" width={40} height={40} className="relative z-10 object-contain w-10 h-10" priority />
          </div>
          <span className="hidden sm:block text-lg font-black text-slate-800 tracking-tight ml-2">NAAPE</span>
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
        <GroupLabel label="Overview" />
        {navLinksMain.map(link => (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={pathname === link.href}
          />
        ))}

        <GroupLabel label="Content" />
        <DropdownNavItem
          label="News & Publications"
          icon={FaNewspaper}
          isActive={isNewsPubsDropdownActive}
        >
          {newsPublicationsLinks.map(link => (
            <Link
              key={link.label}
              href={link.href ?? "#"}
              className={`
                        block px-3 py-2 rounded-lg text-sm transition-colors mb-0.5
                        ${pathname === link.href ? "text-primary font-bold bg-primary/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}
                    `}
            >
              {link.label}
            </Link>
          ))}
        </DropdownNavItem>

        <GroupLabel label="Account" />
        {navLinksSecondary.map(link => (
          <NavItem
            key={link.label}
            icon={link.icon}
            label={link.label}
            href={link.href}
            active={pathname === link.href}
          />
        ))}
        <NavItem
          icon={FaSignOutAlt}
          label="Sign Out"
          asButton
          onClick={handleSignOut}
          active={false}
          disabled={!logout}
        />
      </div>

      {/* Footer */}
      <div className="pb-4">
        <SidebarProfileCard user={user} />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden sm:block w-[260px] h-screen sticky top-0 z-30 font-sans border-r border-slate-100 shadow-[2px_0_24px_-12px_rgba(0,0,0,0.1)]">
        {SidebarContent}
      </aside>

      {/* Mobile Trigger - if not handled by TopNavbar */}
      <div className="sm:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-4 bg-primary text-white rounded-full shadow-xl shadow-primary/30 hover:scale-110 transition-transform active:scale-90"
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] sm:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[80vw] max-w-[300px] bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarContent}
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-2 text-slate-400">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default AppSidebar;