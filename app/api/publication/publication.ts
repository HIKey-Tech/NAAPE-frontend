import api from "@/lib/axios";


export async function fetchAllPublications(status?: string) {
    try {
        const url = status ? `/publications?status=${status}` : "/publications";
        const res = await api.get(url);
        return res.data.data; //
    } catch (error: any) {
        throw error;
    }

}

export const getMyPublications = async (status?: string) => {
    const params: any = {};
    if (status) params.status = status;

    const res = await api.get("/publications/my", { params });
    return res.data.data;
};

export async function getSinglePublication(id: string) {
    try {
        const response = await api.get(`/publications/${id}`)
        return response.data;

    } catch (error) {
        throw error;

    }
}

export async function createPublication(data: any) {
    try {
        const response = await api.post("/publications", data)
        return response

    } catch (error) {
        throw error

    }
}

// Accept publication
export const approvePublication = async (id: string) => {
    const { data } = await api.patch(`/publications/${id}/approve`);
    return data;
};

// Reject publication
export const rejectPublication = async (id: string) => {
    const { data } = await api.patch(`/publications/${id}/reject`);
    return data;
};

