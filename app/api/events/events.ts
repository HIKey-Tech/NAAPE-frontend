import axios from "axios";

// BASE URL for backend API
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
    : "http://localhost:5000/api";

// Fetch all events (GET /v1/events)
export const fetchEvents = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/v1/events`);
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
        const response = await axios.get(`${BASE_URL}/v1/events/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || error.message || "Failed to fetch event.");
    }
};

// Not used in current backend: registering (free) event as a member is done inside payment endpoint

/**
 * Pay/register for event (POST /v1/payments/events/register)
 * Will handle both logged-in users and guests.
 * Returns a payment link for paid events and registers user for free ones.
 * 
 * @param eventId - string
 * @param user - {id, name, email} (optional, logged-in)
 * @param guest - {name, email} (optional, non-logged-in)
 */
export const payForEvent = async ({
    eventId,
    user,
    guest,
}: {
    eventId: string;
    user?: { id: string; name: string; email: string } | null;
    guest?: { name: string; email: string } | null;
}) => {
    if (!eventId) throw new Error("Event ID is required.");
    let body: any = { eventId };

    if (user) {
        // Authenticated user -- backend will get req.user, but pass id for meta
        body.userId = user.id;
        body.name = user.name;
        body.email = user.email;
    } else if (guest) {
        if (!guest.name || !guest.email) throw new Error("Guest name and email are required.");
        body.name = guest.name;
        body.email = guest.email;
    }

    try {
        const response = await axios.post(
            `${BASE_URL}/v1/payments/events/register`,
            body,
            { withCredentials: true }
        );
        return response.data; // {link, tx_ref} for paid, {message} for free
    } catch (error: any) {
        const msg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to initiate event payment";
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
 * Get payment status for event + userEmail (GET /v1/payments/events/status?eventId=...&email=...)
 * @param eventId string
 * @param email string
 */
export const getStatus = async (eventId: string, email: string) => {
    if (!eventId || !email) {
        throw new Error("Event ID and email are required to get payment status.");
    }
    try {
        const response = await axios.get(`${BASE_URL}/v1/payments/events/status`, {
            params: { eventId, email },
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
