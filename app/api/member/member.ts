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


/**
 * Fetches statistics for the member dashboard.
 * Returns structured data or throws a relevant error.
 */
export async function getMemberDashboardStats() {
    try {
        const response = await api.get("/member-dashboard");
        return response.data?.data ?? {};
    } catch (error: any) {
        throw error.response?.data || error.message || error;
    }
}
