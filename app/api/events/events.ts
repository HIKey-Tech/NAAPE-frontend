import api from "@/lib/axios";
import axios from "axios";

// const BASE_URL = "http://localhost:5000/api";
const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
        : "http://localhost:5000/api";

/* ---------------- EVENTS ---------------- */

export const fetchEvents = async () => {
    const { data } = await api.get("/events");
    return data;
};

export const createEventApi = async (formData: FormData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const { data } = await axios.post(`${BASE_URL}/v1/events`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });

    return data;
};

export const getSingleEvent = async (id: string) => {
    const { data } = await api.get(`/events/${id}`);
    return data;
};

/* ---------------- PAYMENTS ---------------- */

export const payForEvent = async ({
    eventId,
    user,
    guest,
}: {
    eventId: string;
    user?: { id: string; name: string; email: string } | null;
    guest?: { name: string; email: string } | null;
}) => {
    if (!eventId) throw new Error("Event ID is required");

    const payload: any = { eventId };

    if (user) {
        payload.name = user.name;
        payload.email = user.email;
    } else if (guest) {
        payload.name = guest.name;
        payload.email = guest.email;
    }

    const { data } = await axios.post(
        `${BASE_URL}/v1/payments/events/register`,
        payload,
        { withCredentials: true }
    );

    return data;
};

export const verifyPayment = async (transactionId: string) => {
    if (!transactionId) {
        throw new Error("transaction_id is required");
    }

    const { data } = await axios.get(
        `${BASE_URL}/v1/payments/events/verify`,
        { params: { transaction_id: transactionId } }
    );

    return data; // { status: success | failed | pending }
};

export const getStatus = async (eventId: string, email: string) => {
    const { data } = await axios.get(
        `${BASE_URL}/v1/payments/events/status`,
        { params: { eventId, email } }
    );

    return data;
};
