import api from "@/lib/axios";

// -------------------- EVENTS --------------------

export const fetchEvents = async () => {
    const { data } = await api.get("/events");
    return data;
};

export const getSingleEvent = async (id: string) => {
    if (!id) throw new Error("Event ID is required");
    const { data } = await api.get(`/events/${id}`);
    return data;
};

export const createEventApi = async (formData: FormData) => {
    const { data } = await api.post("/v1/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

// -------------------- PAYMENTS --------------------

export const payForEvent = async ({
    eventId,
    guest,
}: {
    eventId: string;
    guest?: { name: string; email: string };
}) => {
    if (!eventId) throw new Error("Event ID is required");

    const payload: any = { eventId };

    if (guest) {
        if (!guest.name || !guest.email) {
            throw new Error("Guest name and email are required");
        }
        payload.name = guest.name;
        payload.email = guest.email;
    }

    const { data } = await api.post("/v1/payments/events/register", payload);
    return data; // { link } OR { message }
};

export const verifyEventPayment = async (transactionId: string) => {
    if (!transactionId) {
        throw new Error("transaction_id is required");
    }

    const { data } = await api.get("/v1/payments/events/verify", {
        params: { transaction_id: transactionId },
    });

    return data; // { status, reason? }
};
