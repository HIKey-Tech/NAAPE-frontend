import api from "@/lib/axios";
import axios from "axios";

export const fetchEvents = async () => {
    const res = await api.get("/events");
    return res.data;
};

export const createEventApi = async (data: FormData) => {
    const token = localStorage.getItem("token")

    try {
        // const BASE_URL =  "http://localhost:5000/api";
        const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
            : "http://localhost:5000/api";
        
        
        const response = await axios.post(`${BASE_URL}/v1/events`, data, {
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
export const payForEvent = async ({
    eventId,
    user,
    guest,
}: {
    eventId: string;
    user?: { id: string; name: string; email: string } | null; // logged-in
    guest?: { name: string; email: string } | null;             // guest checkout
}) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    // Guest must supply name + email
    if (!user && guest) {
        if (!guest.name || !guest.email) {
            throw new Error("Guest name and email are required.");
        }
    }

    try {
        const payload: any = { eventId };

        // If NOT logged in → send guest details to backend
        if (!user && guest) {
            payload.name = guest.name;
            payload.email = guest.email;
        }

        const res = await api.post(`/payments/events/register`, payload, {
            withCredentials: true,
        });

        return res.data; // { link, tx_ref } OR { message }
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to initiate event payment";
        throw new Error(msg);
    }
};


/**
 * Verify payment for an event using a reference.
 * Throws a descriptive error on failure.
 * @param reference - The payment reference to verify
 * @returns Payment verification result data
 */
export const verifyPayment = async (transactionId: string) => {
    if (!transactionId) {
        throw new Error("Payment reference is required for verification.");
    }
    try {
        const response = await api.get(`/payments/events/verify?transaction_id=${transactionId}`);
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || error.message || "Failed to verify payment.";
        throw new Error(message);
    }
};

// Inserted as requested:
export const getStatus = async (eventId: string, email: string) => {
    if (!eventId || !email) {
        throw new Error("Event ID and email are required to get payment status.");
    }
    try {
        const response = await api.get(
            `/payments/events/status`,
            { params: { eventId, email } }
        );
        // Axios returns data on .data, not .json().
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch payment status.";
        throw new Error(message);
    }
};

