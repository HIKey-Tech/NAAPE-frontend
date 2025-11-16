"use client";

import MemberDashboardHome from "@/components/member/dashboard/home";
import { useAuth } from "@/context/authcontext";
import { useRouter } from "next/navigation";

export default function Dashboard() {
    const router = useRouter();
    const { user } = useAuth();


    console.log("user details:", user?.name.toString())

    return (
        <main className="">
            <MemberDashboardHome/>
        </main>
    );
}
