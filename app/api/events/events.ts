import api from "@/lib/axios";
import axios from "axios";

// BASE URL for backend API
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
    : "http://localhost:5000/api";

// Fetch all events (GET /v1/events)
export const fetchEvents = async () => {
    try {
        const response = await api.get(`/events`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Failed to fetch events.");
    }
};

// Create event (POST /v1/events, expects FormData)
export const createEventApi = async (data: FormData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    try {
        const response = await axios.post(`${BASE_URL}/v1/events`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Failed to create event.");
    }
};

// Get single event by ID (GET /v1/events/:id)
export const getSingleEvent = async (id: string) => {
    try {
        const response = await api.get(`/events/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Failed to fetch event.");
    }
};

// Not used in current backend: registering (free) event as a member is done inside payment endpoint

/**
 * Pay/register for event (POST /v1/payments/events/register)
 * Authenticated users only.
 * Returns a payment link for paid events and registers user for free ones.
 */
export const payForEvent = async (eventId: string) => {
    if (!eventId) throw new Error("Event ID is required.");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required. Please log in.");
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/v1/payments/events/register`,
            { eventId },
            { 
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true 
            }
        );
        return response.data;
    } catch (error: any) {
        const msg = error?.response?.data?.message || error?.message || "Failed to initiate event payment";
        throw new Error(msg);
    }
};

/**
 * Verify event payment, given a transaction_id (GET /v1/payments/events/verify?transaction_id=...)
 */
export const verifyPayment = async (transactionId: string) => {
    if (!transactionId) {
        throw new Error("Payment reference is required for verification.");
    }
    try {
        const response = await axios.get(
            `${BASE_URL}/v1/payments/events/verify`,
            { params: { transaction_id: transactionId } }
        );
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error.message ||
            "Failed to verify payment.";
        throw new Error(message);
    }
};

/**
 * Get payment status for an event (GET /v1/payments/events/status?eventId=...)
 * Authenticated users only.
 */
export const getStatus = async (eventId: string) => {
    if (!eventId) {
        throw new Error("Event ID is required to get payment status.");
    }
    
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/v1/payments/events/status`, {
            params: { eventId },
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch payment status.";
        throw new Error(message);
    }
};

/**
 * Get user's registered events (GET /v1/events/my-events)
 * Authenticated users only.
 */
export const getUserEvents = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/v1/events/my-events`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch user events.";
        throw new Error(message);
    }
};
