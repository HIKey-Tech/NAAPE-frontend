"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, LogOut, User2, LayoutDashboard, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { NaapButton } from "@/components/ui/custom/button.naap";
import { useAuth } from "@/context/authcontext";
import { LogoutDialog } from "@/components/ui/logout-dialog";
import { motion, AnimatePresence } from "framer-motion";

export default function TopNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menu Items Definition
  const menuItems = [
    {
      label: "About",
      href: "/about/about-us",
      submenu: [
        { label: "About Us", href: "/about/about-us", desc: "Our history and mission" },
        { label: "NAC Members", href: "/about/nac-members", desc: "Leadership team" },
        { label: "Organs of Association", href: "/about/organs-of-association", desc: "Organizational structure" },
        { label: "Rights & Responsibilities", href: "/about/rights-and-responsibilites", desc: "Member guidelines" },
      ]
    },
    { label: "Membership", href: "/membership" },
    {
      label: "News & Events",
      href: "/news",
      submenu: [
        { label: "News", href: "/news", desc: "Latest news updates" },
        { label: "Events", href: "/events", desc: "Upcoming NAAPE events" },
        { label: "Trainings", href: "/trainings", desc: "Professional trainings & certifications" },
      ]
    },
    {
      label: "Publications",
      href: "/publications",
      submenu: [
        { label: "From Members", href: "/publication/members", desc: "Member contributions" },
        { label: "From NAAPE", href: "/publication/naape", desc: "Official releases" },
      ]
    },
    { label: "Advertisement", href: "/advertisement" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  // Styles
  const baseMenuLink = "px-3 py-2 text-[14px] font-bold transition-all duration-300 rounded-full flex items-center justify-center h-full text-center tracking-tight min-w-0 truncate";

  // Handlers
  const handleLoginClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!loginLoading) {
      setLoginLoading(true);
      router.push("/login");
    }
  };

  const handleLogoutClick = () => setShowLogoutDialog(true);
  const confirmLogout = () => {
    setShowLogoutDialog(false);
    setMobileOpen(false);
    logout();
  };

  const handleMouseEnter = (label: string) => setActiveDropdown(label);
  const handleMouseLeave = () => setActiveDropdown(null);

  function getInitials(name?: string) {
    if (!name) return "U";
    const names = name.trim().split(" ");
    const initials = (names[0]?.[0] ?? "") + (names[1]?.[0] ?? "");
    return initials.toUpperCase();
  }

  const isNavbarSolid = isScrolled || pathname !== "/";

  return (
    <nav className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${isNavbarSolid ? "bg-white/95 backdrop-blur-md shadow-md py-2 min-h-[64px] sm:min-h-[72px]" : "bg-transparent py-4 min-h-[80px] sm:min-h-[90px]"}`}>
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between relative">

        {/* Logo Section - Left Aligned */}
        <Link href="/" className="flex items-center gap-3 group relative z-50 outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-primary/50" aria-label="NAAPE Home">
          <div className={`relative transition-all duration-500 ease-out-back ${isNavbarSolid ? "scale-100" : "scale-110"}`}>
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-full bg-primary/20 blur-xl transition-opacity duration-500 ${isNavbarSolid ? "opacity-0" : "opacity-40 group-hover:opacity-60"}`} />

            <Image
              src="/logo.png"
              alt="NAAPE Logo"
              width={60}
              height={60}
              className="object-contain w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] relative z-10 drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Desktop Menu - Right Aligned */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Main Navigation Items */}
          <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10 mr-4">
            {menuItems.map((item) => {
              const isActive = activeDropdown === item.label;

              // Determine color classes
              let colorClasses = "";
              const isNavbarSolid = isScrolled || pathname !== "/";

              if (isActive) {
                // Active/Open state - Always dark text (on white pill)
                colorClasses = "text-primary";
              } else if (isNavbarSolid) {
                // Inactive + Scrolled (White Navbar)
                colorClasses = "text-slate-600 hover:text-primary hover:bg-primary/10";
              } else {
                // Inactive + unscrolled (Transparent Header)
                colorClasses = "text-white/90 hover:text-white hover:bg-white/10";
              }

              return (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`${baseMenuLink} ${colorClasses}`}
                    onClick={() => { if (item.href) router.push(item.href); }}
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      {item.label}
                      {item.submenu && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-300 ${isActive ? "rotate-180" : "rotate-0 text-primary/40 group-hover:text-primary/70"}`}
                          strokeWidth={3}
                        />
                      )}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-full bg-white shadow-sm"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isActive && item.submenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-3 w-64 bg-white rounded-2xl shadow-xl shadow-indigo-900/10 border border-slate-100 overflow-hidden z-50 ring-1 ring-black/5"
                        style={{ transformOrigin: "top left" }}
                      >
                        <div className="p-2 flex flex-col gap-1">
                          {item.submenu.map((sub, idx) => (
                            <Link
                              key={idx}
                              href={sub.href}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                            >
                              <div>
                                <p className="text-sm font-bold text-slate-800 leading-none mb-1 group-hover/item:text-primary transition-colors">{sub.label}</p>
                                {sub.desc && <p className="text-[11px] text-slate-500 line-clamp-1">{sub.desc}</p>}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* User Auth Section */}
          <div className="pl-4 border-l border-white/20 ml-2">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/login" className={`hidden xl:block text-sm font-bold transition-colors ${isNavbarSolid ? "text-slate-600 hover:text-primary" : "text-white/80 hover:text-white"}`}>
                  Log In
                </Link>
                <NaapButton
                  className={`py-2 px-6 rounded-full border border-slate-200 bg-white text-slate-700 hover:text-primary hover:border-primary hover:bg-primary/5 text-[14px] font-bold min-w-[100px] transition-all duration-300 shadow-sm hover:shadow-md ${!isNavbarSolid ? "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white" : ""}`}
                  onClick={() => router.push("/register")}
                >
                  Join Now
                </NaapButton>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-3 p-1 pr-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all group">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                      {getInitials(user?.name)}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className={`text-xs font-bold leading-none ${isNavbarSolid ? "text-slate-800" : "text-white"}`}>{user?.name?.split(' ')[0] || "Member"}</p>
                      <p className={`text-[10px] uppercase tracking-wider ${isNavbarSolid ? "text-slate-500" : "text-white/60"}`}>{user?.role || "Member"}</p>
                    </div>
                    <ChevronDown size={14} className={`ml-1 transition-transform group-data-[state=open]:rotate-180 ${isNavbarSolid ? "text-slate-400" : "text-white/60"}`} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-slate-100 shadow-xl bg-white/95 backdrop-blur-md">
                  <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group" onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard size={16} className="text-slate-400 group-hover:text-primary mr-3" />
                    <span className="font-medium text-slate-700 group-hover:text-primary">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-primary/5 focus:bg-primary/5 group" onClick={() => router.push("/profile")}>
                    <User size={16} className="text-slate-400 group-hover:text-primary mr-3" />
                    <span className="font-medium text-slate-700 group-hover:text-primary">My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-slate-100" />
                  <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-red-50 focus:bg-red-50 group text-red-600" onClick={() => setShowLogoutDialog(true)}>
                    <LogOut size={16} className="mr-3 opacity-70 group-hover:opacity-100" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Menu Button - Right Aligned */}
        <button
          className={`lg:hidden p-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 ${isNavbarSolid ? "text-primary bg-white/90 backdrop-blur-sm" : "text-white bg-black/20 backdrop-blur-sm hover:bg-black/30"}`}
          onClick={() => setMobileOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={26} strokeWidth={2.5} />
        </button>

      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 absolute top-full left-0 w-full shadow-xl overflow-hidden"
          >
            <div className="flex justify-end p-4 pb-0">
              <button onClick={() => setMobileOpen(false)} className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-full transition-colors" aria-label="Close Menu">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2 overflow-y-auto max-h-[80vh] scrollbar-hide">
              {menuItems.map((item) => (
                <div key={item.label} className="w-full">
                  <Button variant="ghost" className="w-full justify-start font-bold text-slate-700" onClick={() => {
                    if (item.href) router.push(item.href);
                    setMobileOpen(false);
                  }}>
                    {item.label}
                  </Button>
                  {item.submenu && (
                    <div className="pl-4 flex flex-col gap-1 border-l-2 border-slate-100 ml-4 mt-1">
                      {item.submenu.map(sub => (
                        <Link key={sub.label} href={sub.href} className="text-sm text-slate-500 py-1 hover:text-primary" onClick={() => setMobileOpen(false)}>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {!isAuthenticated ? (
                <div className="mt-4 flex flex-col gap-2">
                  <Button className="w-full justify-center" variant="outline" onClick={() => router.push("/login")}>Log In</Button>
                  <Button className="w-full justify-center bg-primary text-white" onClick={() => router.push("/register")}>Join Now</Button>
                </div>
              ) : (
                <Button className="w-full justify-center text-red-600 hover:bg-red-50" variant="ghost" onClick={() => { setMobileOpen(false); setShowLogoutDialog(true); }}>Log Out</Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LogoutDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog} onConfirm={confirmLogout} />
    </nav>
  );
}
