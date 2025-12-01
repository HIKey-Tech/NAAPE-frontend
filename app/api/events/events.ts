import axios from "axios";

export const fetchEvents = async () => {
    const res = await axios.get("/events");
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
    const res = await axios.get(`/events/${id}`);
    return res.data;
};

export const registerEvent = async ({ id }: { id: string }) => {
    if (!id) {
        throw new Error("Event ID is required to register.");
    }
    try {
        const response = await axios.post(`/events/${id}/register`);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Failed to register for the event.";
        throw new Error(message);
    }
};