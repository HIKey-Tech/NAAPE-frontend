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
            {/* <AppSidebar /> */}
            <AdminSidebar/>
            <main className="w-full h-full flex-row ">
                <TopNavbar />

                {children}
            </main>

        </SidebarProvider>


    );
}
