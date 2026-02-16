"use client";
import React from "react";
import { usePublicationStats } from "@/hooks/useAdminPublications";
import { FaBookOpen, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaEdit } from "react-icons/fa";

export const PublicationStatsSection: React.FC = () => {
    const { data, isLoading, isError } = usePublicationStats();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-20 mb-3"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">Failed to load statistics</p>
            </div>
        );
    }

    const stats = data.data;

    const statCards = [
        {
            label: "Total",
            value: stats.total,
            icon: <FaBookOpen className="text-2xl" />,
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            borderColor: "border-blue-200"
        },
        {
            label: "Pending",
            value: stats.pending,
            icon: <FaHourglassHalf className="text-2xl" />,
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600",
            borderColor: "border-yellow-200"
        },
        {
            label: "Approved",
            value: stats.approved,
            icon: <FaCheckCircle className="text-2xl" />,
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            borderColor: "border-green-200"
        },
        {
            label: "Rejected",
            value: stats.rejected,
            icon: <FaTimesCircle className="text-2xl" />,
            bgColor: "bg-red-50",
            textColor: "text-red-600",
            borderColor: "border-red-200"
        },
        {
            label: "Draft",
            value: stats.draft,
            icon: <FaEdit className="text-2xl" />,
            bgColor: "bg-gray-50",
            textColor: "text-gray-600",
            borderColor: "border-gray-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {statCards.map((stat, index) => (
                <div
                    key={index}
                    className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-6 transition-all hover:shadow-md`}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className={`${stat.textColor} font-medium text-sm`}>{stat.label}</span>
                        <span className={stat.textColor}>{stat.icon}</span>
                    </div>
                    <div className={`${stat.textColor} text-3xl font-bold`}>{stat.value}</div>
                </div>
            ))}
        </div>
    );
};
