"use client"

import React from "react";
import DashboardCard from "@/components/member/component/dashboardcard";
import { PublicationTable } from "../components/table";
import { useAuth } from "@/context/authcontext";
import { usePublications } from "@/hooks/usePublications";
import { useAdminStats } from "@/hooks/useAdminStats";

// Stats interfaces based on new structure from the provided JSON
interface UsersStats {
    total: number;
    members: number;
    admins: number;
}

interface PublicationsStats {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
}

interface ApiAdminStats {
    users: UsersStats;
    publications: PublicationsStats;
}

// Initial dashboard stats
const DEFAULT_STATS: ApiAdminStats = {
    users: {
        total: 0,
        members: 0,
        admins: 0
    },
    publications: {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    }
};

const dashboardIconMap = [
    // 0: Pending Publications
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={10} strokeWidth={2.2} />
            <path d="M8 12.5l3 3 4.5-6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    // 1: Approved Publications
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 6v6l4 2" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={12} cy={12} r={10} strokeWidth={2.2} />
        </svg>
    ),
    // 2: Rejected Publications
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x={3} y={7} width={18} height={13} rx={2} strokeWidth={2.2} />
            <path d="M16 3v4M8 3v4M3 11h18" strokeWidth={2.2} />
        </svg>
    ),
    // 3: Total Publications (Document icon)
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x={7} y={2} width={10} height={20} rx={2} strokeWidth={2.2} />
            <path d="M7 8h10" strokeWidth={2.2} />
        </svg>
    ),
    // 4: Total Users (Person Group icon)
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="7" cy="10" r="3" strokeWidth="2.2"/>
            <circle cx="17" cy="10" r="3" strokeWidth="2.2"/>
            <path d="M7 13c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3zM17 13c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3z" strokeWidth="2.2"/>
        </svg>
    ),
    // 5: Members (User icon)
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" strokeWidth="2.2"/>
            <path d="M4 20v-1a7 7 0 0114 0v1" strokeWidth="2.2"/>
        </svg>
    ),
    // 6: Admins (Shield with Check icon)
    (
        <svg className="w-7 h-7 text-[#4267E7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 3l7 4v5c0 5.25-3.75 9-7 9s-7-3.75-7-9V7l7-4z" strokeWidth="2.2"/>
            <path d="M9.5 12.5l2 2 3-3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
];

const AdminOverview: React.FC = () => {
    const { user } = useAuth();
    const { data: publications, isPending: pubLoading } = usePublications();
    const { data: statsRaw, isLoading: statsLoading, isError: statsError } = useAdminStats();

    // "stats" always uses the new ApiAdminStats shape, with fallback to empty/default
    let stats: ApiAdminStats = { ...DEFAULT_STATS };

    if (statsRaw && typeof statsRaw === "object") {
        // Safely fill from API
        stats = {
            users: {
                total: statsRaw.users?.total ?? 0,
                members: statsRaw.users?.members ?? 0,
                admins: statsRaw.users?.admins ?? 0,
            },
            publications: {
                total:
                    statsRaw.publications?.total ??
                    (Array.isArray(publications) ? publications.length : 0),
                pending: statsRaw.publications?.pending ?? 0,
                approved: statsRaw.publications?.approved ?? 0,
                rejected: statsRaw.publications?.rejected ?? 0,
            },
        };
    } else if (statsLoading) {
        stats = { ...DEFAULT_STATS };
    } else if (statsError) {
        // fallback (could also show error UI)
        stats = {
            ...DEFAULT_STATS,
            publications: {
                ...DEFAULT_STATS.publications,
                total: (Array.isArray(publications) ? publications.length : 0),
            },
        };
    }

    // Prepare dashboard stats for cards (order matches icons and structure!)
    const cards = [
        {
            icon: dashboardIconMap[0],
            value: statsLoading ? "..." : stats.publications.pending,
            label: "Pending Publications"
        },
        {
            icon: dashboardIconMap[1],
            value: statsLoading ? "..." : stats.publications.approved,
            label: "Approved Publications"
        },
        {
            icon: dashboardIconMap[2],
            value: statsLoading ? "..." : stats.publications.rejected,
            label: "Rejected Publications"
        },
        {
            icon: dashboardIconMap[3],
            value: statsLoading ? "..." : stats.publications.total,
            label: "Total Publications"
        },
        {
            icon: dashboardIconMap[4],
            value: statsLoading ? "..." : stats.users.total,
            label: "Total Users"
        },
        {
            icon: dashboardIconMap[5],
            value: statsLoading ? "..." : stats.users.members,
            label: "Total Members"
        },
        {
            icon: dashboardIconMap[6],
            value: statsLoading ? "..." : stats.users.admins,
            label: "Total Admins"
        },
    ];

    return (
        <section className="w-full max-w-full px-2 sm:px-4 py-8">
            {/* Welcome Header */}
            <div className="text-[16px] font-medium text-[#212B36] mb-6">
                Good to see you,{user?.name}!
                <div className="text-[13px] text-[#919EAB] mt-0.5 font-normal">
                    Here's what's new today.
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
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
