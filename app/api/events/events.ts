import api from "@/lib/axios";
import axios from "axios";

export const fetchEvents = async () => {
    const res = await api.get("/events");
    return res.data;
};

export const createEventApi = async (data: FormData) => {
    const token = localStorage.getItem("token")

    try {
        const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL!}/api` || "http://localhost:5000/api"
        const response = await axios.post(`${BASE_URL}/events`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`
            }
        })

        return response.data

    } catch (error) {
        throw error
    }


};

export const getSingleEvent = async (id: string) => {
    const res = await api.get(`/events/${id}`);
    return res.data;
};

export const registerEvent = async ({ id }: { id: string }) => {
    if (!id) {
        throw new Error("Event ID is required to register.");
    }
    try {
        const response = await api.post(`/events/${id}/register`);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Failed to register for the event.";
        throw new Error(message);
    }
};

/**
 * Pay for a specific event by event ID.
 * Throws a descriptive error on failure.
 * @param id - The event ID to pay for
 * @returns Payment result data
 */
export const payForEvent = async (id: string) => {
    if (!id) {
        throw new Error("Event ID is required to complete payment.");
    }
    try {
        const response = await api.post(`/events/${id}/pay`);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Failed to process event payment.";
        throw new Error(message);
    }
};
