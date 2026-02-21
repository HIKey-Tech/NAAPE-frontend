"use client";

import { AdminSidebar } from '@/components/admin/components/sidebar';
import TopNavbar from '@/components/navbar/topnavbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/context/authcontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import React from 'react';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, token, isAuthenticated, loading, loggingOut } = useAuth();
    const router = useRouter();

    // Redirect to login if not authenticated (after loading is complete)
    useEffect(() => {
        if (!loading && !isAuthenticated && !loggingOut) {
            router.replace('/login');
        }
    }, [loading, isAuthenticated, loggingOut, router]);

    // Show loading state during initial load
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#f0f5fc] dark:from-[#0a0d14] to-white dark:to-[#0f121b]">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#B7BDC8"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="#15407c"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-lg font-semibold text-[#15407c]">Loading...</span>
                </div>
            </div>
        );
    }

    // Show logging out state only when actually logging out
    if (loggingOut) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#f0f5fc] dark:from-[#0a0d14] to-white dark:to-[#0f121b]">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#B7BDC8"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="#15407c"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                    </svg>
                    <span className="text-lg font-semibold text-[#15407c]">Logging out...</span>
                </div>
            </div>
        );
    }

    // Don't render dashboard if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full min-h-screen flex flex-col">
                <TopNavbar />
                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
