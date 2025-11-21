"use client";

import { getAllMembers, getMemberDashboardStats } from "@/app/api/member/member";
import { useQuery } from "@tanstack/react-query";

export const useMembers = () => {
    return useQuery({
        queryKey: ["members"],
        queryFn: getAllMembers,
    });
};



export const useMemberStats = () => {
    return useQuery({
        queryKey: ["member-dashboard-stats"],
        queryFn: getMemberDashboardStats,
    });
};
