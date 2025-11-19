"use client";

import MemberDashboardHome from "@/components/member/dashboard/home";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const router = useRouter();
    const { user, loading, isAuthenticated } = useAuth();

    // 1️⃣ Still loading auth state...
    if (loading) {
        return <p>Loading...</p>;
    }

    // 2️⃣ No user → Redirect or block page
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [loading, isAuthenticated, router]);

    if (!isAuthenticated) {
        // Optionally, you can show a message while redirecting
        return <p>Not authenticated</p>;
    }

    return (
        <main className="">
            <MemberDashboardHome />
        </main>
    );
}
