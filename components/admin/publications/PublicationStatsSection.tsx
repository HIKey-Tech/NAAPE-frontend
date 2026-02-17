"use client";
import React from "react";
import { usePublicationStats } from "@/hooks/useAdminPublications";
import { FaBookOpen, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";

export const PublicationStatsSection: React.FC = () => {
    const { data, isLoading, isError } = usePublicationStats();

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse h-28" />
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-xl border border-red-100 mb-8">
                Failed to load statistics.
            </div>
        );
    }

    const stats = data.data;

    const statCards = [
        { label: "Total", value: stats.total, icon: FaBookOpen, color: "text-primary", bg: "bg-primary/5" },
        { label: "Pending", value: stats.pending, icon: FaHourglassHalf, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Approved", value: stats.approved, icon: FaCheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Rejected", value: stats.rejected, icon: FaTimesCircle, color: "text-red-600", bg: "bg-red-50" },
        { label: "Draft", value: stats.draft, icon: FaEdit, color: "text-slate-600", bg: "bg-slate-100" },
    ];

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={16} />
                        </div>
                    </div>
                    <div className={`text-2xl font-black text-slate-800 tracking-tight mb-0.5`}>{stat.value}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};
