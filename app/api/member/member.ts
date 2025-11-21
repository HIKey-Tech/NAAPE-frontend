"use client";

import api from "@/lib/axios";

export async function getAllMembers() {
    const res = await api.get("/users/members");
    return res.data.data; // array of members
}
