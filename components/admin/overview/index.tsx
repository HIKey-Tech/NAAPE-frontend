"use client"

import React, { useEffect, useState } from "react";
import DashboardCard from "@/components/member/component/dashboardcard";
import { PublicationTable } from "../components/table";
import { useAuth } from "@/context/authcontext";
import { usePublications } from "@/hooks/usePublications";

// Dashboard stats API shape (example, adjust as needed)
interface DashboardStats {
    pendingPublications: number;
    activeMembers: number | string;
    upcomingEvents: number;
    jobListings: number;
}

// Initial dashboard stats (optional: loading skeletons, or 0 as fallback)
const DEFAULT_STATS: DashboardStats = {
    pendingPublications: 0,
    activeMembers: 0,
    upcomingEvents: 0,
    jobListings: 0,
};

const dashboardIconMap = [
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={10} strokeWidth={2.2} />
            <path d="M8 12.5l3 3 4.5-6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6l4 2" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={12} cy={12} r={10} strokeWidth={2.2} />
        </svg>
    ),
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x={3} y={7} width={18} height={13} rx={2} strokeWidth={2.2} />
            <path d="M16 3v4M8 3v4M3 11h18" strokeWidth={2.2} />
        </svg>
    ),
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x={7} y={2} width={10} height={20} rx={2} strokeWidth={2.2} />
            <path d="M7 8h10" strokeWidth={2.2} />
        </svg>
    )
];

const AdminOverview: React.FC = () => {
    const { user, loading: authLoading } = useAuth();

    // State for API data
    const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
    const [statsLoading, setStatsLoading] = useState<boolean>(true);

    const { data: publications, isPending: pubLoading } = usePublications()


    // Fetch Dashboard Stats
    useEffect(() => {
        async function fetchStats() {
            try {
                setStatsLoading(true);
                // Replace with your real API endpoint
                const res = await fetch("/api/admin/dashboard-stats");
                if (!res.ok) throw new Error("Failed to fetch dashboard stats");
                const data = await res.json();
                // Match expected shape or adapt as needed
                setStats({
                    pendingPublications: data.pendingPublications ?? 0,
                    activeMembers: data.activeMembers ?? 0,
                    upcomingEvents: data.upcomingEvents ?? 0,
                    jobListings: data.jobListings ?? 0,
                });
            } catch (err) {
                // Optionally handle error: set fallback or show toast
                setStats(DEFAULT_STATS);
            } finally {
                setStatsLoading(false);
            }
        }
        fetchStats();
    }, []);

   

    // Prepare dashboard stats for cards (order must match icons)
    const cards = [
        {
            icon: dashboardIconMap[0],
            value: statsLoading ? "..." : stats.pendingPublications,
            label: "Pending Publications"
        },
        {
            icon: dashboardIconMap[1],
            value: statsLoading ? "..." : stats.activeMembers,
            label: "Active Members"
        },
        {
            icon: dashboardIconMap[2],
            value: statsLoading ? "..." : stats.upcomingEvents,
            label: "Upcoming Events"
        },
        {
            icon: dashboardIconMap[3],
            value: statsLoading ? "..." : stats.jobListings,
            label: "Job Listings"
        }
    ];

    return (
        <section className="w-full max-w-full px-2 sm:px-4 py-8">
            {/* Welcome Header */}
            <div className="text-[16px] font-medium text-[#212B36] mb-6">
                Good Morning, Admin. {user?.name}!
                <div className="text-[13px] text-[#919EAB] mt-0.5 font-normal">
                    Here's what's new today.
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {cards.map((stat, idx) => (
                    <DashboardCard
                        key={idx}
                        icon={stat.icon}
                        value={stat.value}
                        label={stat.label}
                    />
                ))}
            </div>

            {/* Recent Publications Table */}
            <div>
                <div className="flex justify-between items-center mb-2 mt-7">
                    <h2 className="text-[17px] sm:text-lg font-semibold text-[#222F43] tracking-tight">
                        Recent Publications
                    </h2>
                    <a
                        href="#"
                        className="text-[#4267E7] text-[13px] font-medium hover:underline focus:outline-none focus:text-[#2143B7] transition-colors"
                    >
                        View All
                    </a>
                </div>
                {pubLoading ? (
                    <div className="py-16 text-center text-gray-400 text-base font-semibold">Loading...</div>
                ) : (
                    <PublicationTable publications={publications ?? []} />
                )}
            </div>
        </section>
    );
};

export default AdminOverview;

