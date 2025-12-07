"use client";

import React from "react";
import { PublicationTable } from "../components/table";
import { useAuth } from "@/context/authcontext";
import { usePublications } from "@/hooks/usePublications";
import { useAdminStats } from "@/hooks/useAdminStats";
import Link from "next/link";

// --- Types and Defaults ---
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

// --- Dashboard Icon SVGs (Micro Animations included on hover/focus) ---
const dashboardIconMap = [
  // Checkmark
  <svg
    className="w-8 h-8 text-primary transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110 group-focus:-rotate-6 group-focus:scale-110"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle
      cx={12}
      cy={12}
      r={10}
      strokeWidth={2.2}
      className="transition-colors duration-200 group-hover:stroke-primary/60"
    />
    <path d="M8 12.5l3 3 4.5-6" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
  // Clock
  <svg
    className="w-8 h-8 text-[#059669] transition-all duration-200 group-hover:scale-110 group-hover:rotate-6 group-focus:scale-110 group-focus:rotate-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 6v6l4 2" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={12} cy={12} r={10} strokeWidth={2.2} />
  </svg>,
  // Rejected
  <svg
    className="w-8 h-8 text-[#DC2626] transition-all duration-200 group-hover:scale-110 group-focus:scale-110"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x={3} y={7} width={18} height={13} rx={2} strokeWidth={2.2} />
    <path
      d="M16 3v4M8 3v4M3 11h18"
      strokeWidth={2.2}
      className="transition-all group-hover:stroke-red-400"
    />
  </svg>,
  // Book
  <svg
    className="w-8 h-8 text-[#7C3AED] transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-12 group-focus:scale-110 group-focus:-rotate-12"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x={7} y={2} width={10} height={20} rx={2} strokeWidth={2.2} />
    <path d="M7 8h10" strokeWidth={2.2} />
  </svg>,
  // Users
  <svg
    className="w-8 h-8 text-[#172554] transition-transform duration-200 group-hover:scale-105 group-focus:scale-105"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="7" cy="10" r="3" strokeWidth="2.2" />
    <circle cx="17" cy="10" r="3" strokeWidth="2.2" />
    <path d="M7 13c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3zM17 13c-2 0-4 1-4 3v2h8v-2c0-2-2-3-4-3z" strokeWidth="2.2" />
  </svg>,
  // Members
  <svg
    className="w-8 h-8 text-[#FDBA00] transition-all duration-200 group-hover:-translate-y-1 group-focus:-translate-y-1 group-hover:scale-105 group-focus:scale-105"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="8" r="4" strokeWidth={2.2} />
    <path d="M4 20v-1a7 7 0 0114 0v1" strokeWidth={2.2} />
  </svg>,
  // Admins (Shield)
  <svg
    className="w-8 h-8 text-[#6B21A8] transition-all duration-200 group-hover:rotate-2 group-focus:rotate-2 group-hover:scale-110 group-focus:scale-110"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 3l7 4v5c0 5.25-3.75 9-7 9s-7-3.75-7-9V7l7-4z" strokeWidth="2.2" />
    <path d="M9.5 12.5l2 2 3-3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>,
];

// --- Card labels and organization ---
const cardDefs = [
  { iconIdx: 0, label: "Pending Publications", accent: "bg-primary/10" },
  { iconIdx: 1, label: "Approved Publications", accent: "bg-green-100" },
  { iconIdx: 2, label: "Rejected Publications", accent: "bg-red-50" },
  { iconIdx: 3, label: "Total Publications", accent: "bg-violet-50" },
  { iconIdx: 4, label: "Total Users", accent: "bg-sky-50" },
  { iconIdx: 5, label: "Total Members", accent: "bg-yellow-50" },
  { iconIdx: 6, label: "Total Admins", accent: "bg-purple-50" },
];

const AdminOverview: React.FC = () => {
  const { user } = useAuth();
  const { data: publications, isPending: pubLoading } = usePublications();
  const { data: statsRaw, isLoading: statsLoading, isError: statsError } = useAdminStats();

  // --- Clean stats processing, fallback handling ---
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

  const cardValues = [
    stats.publications.pending,
    stats.publications.approved,
    stats.publications.rejected,
    stats.publications.total,
    stats.users.total,
    stats.users.members,
    stats.users.admins,
  ];

  return (
    <section className="w-full px-2 sm:px-5 py-8 bg-[#F5F7FA] min-h-screen flex flex-col gap-12">

      {/* Dashboard Cards */}
      <section
        className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6
          gap-x-5 gap-y-4 sm:gap-x-7 sm:gap-y-5
          rounded-2xl p-3 sm:p-6 border border-[#DAE2EF] bg-white shadow-sm
          transition-colors
        "
        aria-label="Dashboard Statistics"
      >
        {cardDefs.map((def, idx) => (
          <div
            key={def.label}
            className={`
              group flex flex-col items-center justify-center px-2 py-7
              rounded-xl border border-[#E3EAF5] shadow-sm bg-white relative overflow-hidden
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1
              cursor-pointer outline-none min-h-[130px]
              focus:ring focus:ring-primary/30
            `}
            tabIndex={0}
            aria-label={def.label}
          >
            {/* Accent Glow */}
            <div
              className={`
                absolute top-2 right-2 z-0 w-8 h-8 rounded-full ${def.accent}
                animate-pulse group-hover:animate-none group-focus:animate-none
              `}
              aria-hidden="true"
            ></div>
            {/* Icon with micro animation */}
            <div className="mb-3 flex items-center justify-center z-10 relative">
              {dashboardIconMap[def.iconIdx]}
            </div>
            {/* Value */}
            <span
              className="
                block font-extrabold text-xl sm:text-2xl text-[#10172A] tracking-wide mb-0.5 z-10
                group-hover:text-primary group-focus:text-primary transition-colors duration-150
                transition-transform
                group-hover:scale-105 group-focus:scale-105
              "
            >
              {statsLoading ? (
                <span className="opacity-80 animate-pulse">...</span>
              ) : (
                <span className="transition-transform duration-200 group-hover:scale-110 group-focus:scale-110">
                  {cardValues[idx]}
                </span>
              )}
            </span>
            {/* Label */}
            <span className="block text-xs sm:text-sm font-semibold text-[#475569] text-center mt-0.5 z-10">
              {def.label}
            </span>
          </div>
        ))}
      </section>

      {/* Recent Publications Table Section */}
      <section
        className="w-full bg-white rounded-2xl px-2 sm:px-7 py-7 border border-[#DAE2EF] shadow-sm focus-within:ring-2 focus-within:ring-primary"
        aria-labelledby="recent-publications-heading"
      >
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-6">
          <h2
            id="recent-publications-heading"
            className="text-xl sm:text-2xl font-bold text-primary tracking-tight leading-tight"
          >
            Recent Publications
          </h2>
          <Link
            href="/admin/publications/all-publications"
            className="text-primary text-sm font-semibold underline underline-offset-2 hover:text-blue-700 focus:outline-none focus:text-blue-700 transition-colors"
          >
            View All
          </Link>
        </header>
        <div className="mt-2">
          {pubLoading ? (
            <div className="py-20 text-center text-[#8794b3] text-base font-semibold animate-pulse">
              Loading...
            </div>
          ) : (
            <PublicationTable publications={publications ?? []} />
          )}
        </div>
      </section>
    </section>
  );
};

export default AdminOverview;
