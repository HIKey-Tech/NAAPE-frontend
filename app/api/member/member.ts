"use client";

import api from "@/lib/axios";


export async function createMember(data: any) {
    try {
        const response = await api.post("/auth/register", data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export async function getAllMembers() {
    const res = await api.get("/users/members");
    return res.data.data; // array of members
}


export const getMemberDashboardStats = async () => {
    const res = await api.get("/member-dashboard");
    return res.data.data;
};
