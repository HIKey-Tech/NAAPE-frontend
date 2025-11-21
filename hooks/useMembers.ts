"use client";

import { getAllMembers } from "@/app/api/member/member";
import { useQuery } from "@tanstack/react-query";

export const useMembers = () => {
    return useQuery({
        queryKey: ["members"],
        queryFn: getAllMembers,
    });
};
