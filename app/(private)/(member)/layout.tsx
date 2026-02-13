"use client";

import { AppSidebar } from '@/components/navbar/app-siderbar';
import TopNavbar from '@/components/navbar/topnavbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/context/authcontext';
import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { loggingOut } = useAuth();
    
    // Show loading state during logout
    if (loggingOut) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-[#f0f5fc] to-white">
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
    
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full min-h-screen flex flex-col">
                <TopNavbar />
                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
