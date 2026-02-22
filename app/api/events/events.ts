import api from "@/lib/axios";
import axios from "axios";

// BASE URL for backend API
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api`
    : "http://localhost:5000/api";

// Fetch all events (GET /v1/events)
export const fetchEvents = async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
        const response = await api.get(`/events`, { params });

        let rawEvents = response.data;
        let pagination = null;

        if (response.data && !Array.isArray(response.data) && response.data.data) {
            rawEvents = response.data.data;
            pagination = response.data.pagination;
        }

        // Check if rawEvents is an array
        if (!Array.isArray(rawEvents)) {
            console.error("Events API returned non-array data:", response.data);
            return { events: [], pagination: null };
        }

        // Normalize the data to ensure both _id and id are available
        const events = rawEvents.map((event: any) => ({
            ...event,
            id: event._id || event.id, // Ensure id field exists
        }));

        return { events, pagination };
    } catch (error: any) {
        console.error("Events API error:", error);
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
        // Normalize the data to ensure both _id and id are available
        const event = {
            ...response.data,
            id: response.data._id || response.data.id, // Ensure id field exists
        };
        return event;
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

// Admin-only: Get events summary for attendee management
export const getEventsForAttendeeManagement = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/v1/events/admin/events-summary`, {
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
            "Failed to fetch events summary.";
        throw new Error(message);
    }
};

// Admin-only: Get event attendees
export const getEventAttendees = async (eventId: string) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/v1/events/${eventId}/attendees`, {
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
            "Failed to fetch event attendees.";
        throw new Error(message);
    }
};

// Admin-only: Update attendee attendance status
export const updateAttendeeAttendance = async (eventId: string, userId: string, attendanceStatus: string) => {
    if (!eventId || !userId || !attendanceStatus) {
        throw new Error("Event ID, User ID, and attendance status are required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.put(
            `${BASE_URL}/v1/events/${eventId}/attendees/${userId}/attendance`,
            { attendanceStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update attendance status.";
        throw new Error(message);
    }
};

// Admin-only: Export event attendees
export const exportEventAttendees = async (
    eventId: string,
    format: 'csv' | 'excel' = 'csv',
    filters?: {
        paymentStatus?: string;
        attendanceStatus?: string;
        search?: string;
    }
) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const params: any = { format };
        if (filters?.paymentStatus && filters.paymentStatus !== 'all') {
            params.paymentStatus = filters.paymentStatus;
        }
        if (filters?.attendanceStatus && filters.attendanceStatus !== 'all') {
            params.attendanceStatus = filters.attendanceStatus;
        }
        if (filters?.search) {
            params.search = filters.search;
        }

        const response = await axios.get(
            `${BASE_URL}/v1/events/${eventId}/attendees/export`,
            {
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
                responseType: format === 'csv' ? 'blob' : 'json'
            }
        );

        if (format === 'csv') {
            // Handle CSV download
            const blob = new Blob([response.data], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `attendees_${eventId}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return { success: true, message: 'CSV downloaded successfully' };
        } else {
            // Handle Excel format (return data for frontend processing)
            return response.data;
        }
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to export attendees.";
        throw new Error(message);
    }
};

// Admin-only: Get event settings
export const getEventSettings = async (eventId: string) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.get(`${BASE_URL}/v1/events/${eventId}/settings`, {
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
            "Failed to fetch event settings.";
        throw new Error(message);
    }
};

// Admin-only: Update event settings
export const updateEventSettings = async (eventId: string, settings: any) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.put(
            `${BASE_URL}/v1/events/${eventId}/settings`,
            { settings },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update event settings.";
        throw new Error(message);
    }
};

// Admin-only: Update event
export const updateEvent = async (eventId: string, data: FormData) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.put(
            `${BASE_URL}/v1/events/${eventId}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error: any) {
        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to update event.";
        throw new Error(message);
    }
};

// Admin-only: Delete event
export const deleteEvent = async (eventId: string) => {
    if (!eventId) {
        throw new Error("Event ID is required.");
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined;
    if (!token) {
        throw new Error("Authentication required.");
    }

    try {
        const response = await axios.delete(`${BASE_URL}/v1/events/${eventId}`, {
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
            "Failed to delete event.";
        throw new Error(message);
    }
};