"use client";

import { useAuth } from "@/context/authcontext";
import DashboardLayout from "@/app/(private)/(member)/layout";
import AdminDashboardLayout from "@/app/(private)/(admin)/layout";
import TopNavbar from '@/components/ui/landing/home/navbar';
import Footer from '@/components/ui/landing/home/footer';
import WhatsAppFloat from '@/components/ui/custom/whatsapp';
import React, { useEffect, useState, useMemo } from "react";

/**
 * NOTE:
 * - This component must be a Client Component, since useAuth() is a client hook.
 * - "use client" is at the top to mark it as a client component.
 */
export default function EventsIdLayout({ children }: { children: React.ReactNode }) {
    const session = useAuth();
    const [mounted, setMounted] = useState(false);
    const [layoutType, setLayoutType] = useState<'admin' | 'member' | 'public'>('public');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Determine layout type once mounted and auth is loaded
    useEffect(() => {
        if (!mounted || session.loading) return;
        
        if (session.user?.role === "admin") {
            setLayoutType('admin');
        } else if (session.user?.role === "member") {
            setLayoutType('member');
        } else {
            setLayoutType('public');
        }
    }, [mounted, session.loading, session.user?.role]);

    // Prevent flash by waiting for mount and auth
    if (!mounted || session.loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Render based on stable layout type
    if (layoutType === 'admin') {
        return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
    }

    if (layoutType === 'member') {
        return <DashboardLayout>{children}</DashboardLayout>;
    }

    // Public layout
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
