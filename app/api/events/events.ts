import axios from "axios";

export const fetchEvents = async () => {
    const res = await axios.get("/events");
    return res.data;
};

export const createEventApi = async (data: any) => {
    const res = await axios.post("/events", data);
    return res.data;

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