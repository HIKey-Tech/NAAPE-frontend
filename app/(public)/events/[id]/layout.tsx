"use client";

import { useAuth } from "@/context/authcontext";
import DashboardLayout from "@/app/(private)/(member)/layout";
import PublicLayout from "../../layout";
import AdminDashboardLayout from "@/app/(private)/(admin)/layout";
import React from "react";

/**
 * NOTE:
 * - This component must be a Client Component, since useAuth() is a client hook.
 * - "use client" is at the top to mark it as a client component.
 */
export default function EventsIdLayout({ children }: { children: React.ReactNode }) {
    const session = useAuth();

    // Explicitly check for admin
    if (session && session.user?.role === "admin") {
        return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
    }

    // If logged in as a member, use member layout
    if (session && session.user?.role === "member") {
        return <DashboardLayout>{children}</DashboardLayout>;
    }

    // For all others (public, unauthenticated, or unknown role), use public layout
    return <div className="h-screen w-full">
        {children}
    </div>
}
