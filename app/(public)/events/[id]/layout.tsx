"use client";

import { useAuth } from "@/context/authcontext";
import DashboardLayout from "@/app/(private)/(member)/layout";
import AdminDashboardLayout from "@/app/(private)/(admin)/layout";
import TopNavbar from '@/components/ui/landing/home/navbar';
import Footer from '@/components/ui/landing/home/footer';
import WhatsAppFloat from '@/components/ui/custom/whatsapp';
import React from "react";

export default function EventsIdLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    // Show loading while auth is being determined
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Admin users get admin layout
    if (user?.role === "admin") {
        return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
    }

    // Member users get member layout
    if (user?.role === "member") {
        return <DashboardLayout>{children}</DashboardLayout>;
    }

    // Public/unauthenticated users get public layout
    return (
        <>
            <TopNavbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
}
