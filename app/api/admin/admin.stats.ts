import api from "@/lib/axios";

export async function getAdminStats() {
    const res = await api.get("/stats");
    return res.data.data; // returns { users: {...}, publications: {...} }
}
