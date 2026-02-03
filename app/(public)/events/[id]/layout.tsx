"use client";

import { useAuth } from "@/context/authcontext";
import DashboardLayout from "@/app/(private)/(member)/layout";
import AdminDashboardLayout from "@/app/(private)/(admin)/layout";
import TopNavbar from '@/components/ui/landing/home/navbar';
import Footer from '@/components/ui/landing/home/footer';
import WhatsAppFloat from '@/components/ui/custom/whatsapp';
import React, { useEffect, useState } from "react";

/**
 * NOTE:
 * - This component must be a Client Component, since useAuth() is a client hook.
 * - "use client" is at the top to mark it as a client component.
 */
export default function EventsIdLayout({ children }: { children: React.ReactNode }) {
    const session = useAuth();
    const [isReady, setIsReady] = useState(false);

    // Wait for auth to be fully loaded before rendering anything
    useEffect(() => {
        if (!session.loading) {
            setIsReady(true);
        }
    }, [session.loading]);

    // Show loading state until auth is ready
    if (!isReady || session.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Now that auth is loaded, render the appropriate layout ONCE
    // Admin layout
    if (session.user?.role === "admin") {
        return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
    }

    // Member layout
    if (session.user?.role === "member") {
        return <DashboardLayout>{children}</DashboardLayout>;
    }

    // Public layout (for unauthenticated or other roles)
    return (
        <div className="min-h-screen w-full flex flex-col">
            <TopNavbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
