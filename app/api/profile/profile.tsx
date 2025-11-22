import api from "@/lib/axios";

export const getMyProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data.data;
};

export const updateMyProfile = async (data: any) => {
    const response = await api.put("/auth/update-profile", data);
    return response.data;
};

export const updateMyPassword = async (data: any) => {
    const response = await api.put("/auth/update-password", data);
    return response.data;
};
