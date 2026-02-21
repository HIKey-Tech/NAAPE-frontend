"use client";

import React from "react";
import { PublicationTable } from "../components/table";
import { useAuth } from "@/context/authcontext";
import { usePublications } from "@/hooks/usePublications";
import { useAdminStats } from "@/hooks/useAdminStats";
import Link from "next/link";
import {
  FaBookOpen,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
  FaUsers,
  FaUserShield,
  FaUserTie
} from "react-icons/fa";

// --- Types ---
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

const DEFAULT_STATS: ApiAdminStats = {
  users: { total: 0, members: 0, admins: 0 },
  publications: { total: 0, pending: 0, approved: 0, rejected: 0 },
};

function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass
}: {
  label: string,
  value: number | string,
  icon: React.ElementType,
  colorClass: string,
  bgClass: string
}) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl p-6 border border-slate-100 dark:border-border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} />
        </div>
        {/* Optional trend indicator could go here */}
      </div>
      <div>
        <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">{value}</h3>
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  );
}

const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const { data: publications, isPending: pubLoading } = usePublications();
  const { data: statsRaw, isLoading: statsLoading, isError: statsError } = useAdminStats();

  // Process stats
  let stats: ApiAdminStats = { ...DEFAULT_STATS };
  if (statsRaw && typeof statsRaw === "object") {
    stats = {
      users: {
        total: statsRaw.users?.total ?? 0,
        members: statsRaw.users?.members ?? 0,
        admins: statsRaw.users?.admins ?? 0,
      },
      publications: {
        total: statsRaw.publications?.total ?? (Array.isArray(publications) ? publications.length : 0),
        pending: statsRaw.publications?.pending ?? 0,
        approved: statsRaw.publications?.approved ?? 0,
        rejected: statsRaw.publications?.rejected ?? 0,
      },
    };
  } else if (statsLoading) {
    stats = { ...DEFAULT_STATS };
  } else if (statsError) {
    stats = {
      ...DEFAULT_STATS,
      publications: {
        ...DEFAULT_STATS.publications,
        total: Array.isArray(publications) ? publications.length : 0,
      },
    };
  }

  const isLoading = statsLoading; // Simplified loading state for cards

  const statItems = [
    {
      label: "Pending Pubs",
      value: stats.publications.pending,
      icon: FaLayerGroup,
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      label: "Approved",
      value: stats.publications.approved,
      icon: FaCheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Rejected",
      value: stats.publications.rejected,
      icon: FaTimesCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      label: "Total Pubs",
      value: stats.publications.total,
      icon: FaBookOpen,
      color: "text-primary",
      bg: "bg-primary/5"
    },
    {
      label: "Total Users",
      value: stats.users.total,
      icon: FaUsers,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      label: "Members",
      value: stats.users.members,
      icon: FaUserTie,
      color: "text-sky-600",
      bg: "bg-sky-50"
    },
    {
      label: "Admins",
      value: stats.users.admins,
      icon: FaUserShield,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  return (
    <div className="p-6 sm:p-10 space-y-10 min-h-screen bg-slate-50 dark:bg-transparent">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Welcome back, {user?.name || "Admin"}. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <StatCard
            key={idx}
            label={item.label}
            value={isLoading ? "-" : item.value}
            icon={item.icon}
            colorClass={item.color}
            bgClass={item.bg}
          />
        ))}
      </div>

      {/* Recent Publications */}
      <div className="bg-white dark:bg-card rounded-3xl p-8 border border-slate-100 dark:border-border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Publications</h2>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium mt-1">Review the latest submissions</p>
          </div>
          <Link
            href="/admin/publications/all-publications"
            className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-colors text-sm"
          >
            View All
          </Link>
        </div>

        {pubLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
            <span className="font-medium animate-pulse">Loading data...</span>
          </div>
        ) : (
          <div className="overflow-hidden">
            <PublicationTable publications={publications ?? []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
