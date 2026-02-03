import { AdminSidebar } from '@/components/admin/components/sidebar';
import TopNavbar from '@/components/navbar/topnavbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <AdminSidebar/>
            <main className="w-full min-h-screen flex flex-col">
                <TopNavbar />
                <div className="flex-1 w-full">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}
