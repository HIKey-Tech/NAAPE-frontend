import axios from "axios";

export const fetchEvents = async () => {
    const res = await axios.get("/events");
    return res.data;
};

export const createEventApi = async (data: any) => {
    const res = await axios.post("/events", data);
    return res.data;
};