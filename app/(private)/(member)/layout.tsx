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
            <main className="w-full h-full flex-row ">
                <TopNavbar />

                {children}
            </main>

        </SidebarProvider>


    );
}
