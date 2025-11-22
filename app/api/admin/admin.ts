import api from "@/lib/axios";

export async function getAdminStats() {
    const res = await api.get("/stats");
    return res.data.data; // returns { users: {...}, publications: {...} }
}



export async function makeAdmin(id: string) {
    try {
        const response = await api.patch(`/users/${id}/role`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}
