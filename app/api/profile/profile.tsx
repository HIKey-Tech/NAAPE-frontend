import { ProfileData } from "@/components/ui/custom/profile";
import api from "@/lib/axios";
import axios from "axios";

export interface UpdateProfilePayload {
    name?: string;
    specialization?: string;
    experience?: number;
    organization?: string;
    licenseNumber?: string;
    image?: File; 
}

export const getMyProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data.data;
}

export const updateMyProfile = async (data: Partial<ProfileData>) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, String(value));
        }
    });

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1`
        : "http://localhost:5000/api/v1";

    const response = await axios.put(
        `${BASE_URL}/users/profile`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`, // 👈 no Content-Type here
            },
        }
    );

    return response.data;
};

export const updateMyPassword = async (data: any) => {
    try {
        const response = await api.put("/users/change-password", data);
        const { message } = response.data;

        // Custom messages based on backend response
        if (message === "current password incorrect") {
            throw new Error("Current password is incorrect");
        }
        if (message === "new passwords do not match") {
            throw new Error("New passwords do not match");
        }
        if (message === "new password must be different") {
            throw new Error("New password must be different");
        }
        if (message === "password updated successfully") {
            return { message: "Password updated successfully" };
        }

        // Fallback
        return response.data?.data ?? response.data;
    } catch (error: any) {
        let message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error.message ||
            "Failed to change password. Please try again.";

        // Map backend error messages to friendly messages
        if (
            message === "current password incorrect" ||
            message.toLowerCase() === "incorrect current password"
        ) {
            message = "Current password is incorrect";
        } else if (message === "new passwords do not match") {
            message = "New passwords do not match";
        } else if (message === "new password must be different") {
            message = "New password must be different";
        }
        throw new Error(message);
    }
};
