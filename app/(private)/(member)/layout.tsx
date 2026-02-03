import { AppSidebar } from '@/components/navbar/app-siderbar';
import TopNavbar from '@/components/navbar/topnavbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
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
