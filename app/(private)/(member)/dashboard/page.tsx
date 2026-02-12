"use client";

import MemberDashboardHome from "@/components/member/dashboard/home";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();
    const { user, loading, isAuthenticated, loggingOut } = useAuth();

    useEffect(() => {
        // Redirect admin users to admin dashboard
        if (!loading && user?.role === "admin") {
            router.replace("/admin/dashboard");
            return;
        }
        
        // Only redirect if finished loading and NOT authenticated
        if (!loading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [loading, isAuthenticated, user, router]);

    // Don't render anything during logout
    if (loggingOut) {
        return null;
    }

    // Block rendering until auth is resolved to avoid changing hook order
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-[#5161ab] text-lg font-medium">
                <svg
                    className="animate-spin mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
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
                        fill="#5161ab"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
                Loading your dashboard...
            </div>
        );
    }

    if (!isAuthenticated) {
        // Don't render anything - just let the redirect happen
        return null;
    }

    return (
        <main className="">
            <MemberDashboardHome />
        </main>
    );
}
