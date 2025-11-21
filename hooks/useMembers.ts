"use client";

import { createMember, getAllMembers, getMemberDashboardStats } from "@/app/api/member/member";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useCreateMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createMember,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
        },
    });
};


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
