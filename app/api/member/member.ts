"use client";

import api from "@/lib/axios";

export async function getAllMembers() {
    const res = await api.get("/users/members");
    return res.data.data; // array of members
}


export const getMemberDashboardStats = async () => {
    const res = await api.get("/member-dashboard");
    return res.data.data;
};
