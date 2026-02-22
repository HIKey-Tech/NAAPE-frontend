import {
    payForEvent,
    createEventApi,
    fetchEvents,
    getSingleEvent,
    verifyPayment,
    getStatus,
    getUserEvents,
    updateEvent,
    deleteEvent
} from "@/app/api/events/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all events
export const useEvents = (params?: { page?: number; limit?: number; search?: string }) =>
    useQuery({
        queryKey: ["events", params],
        queryFn: () => fetchEvents(params),
    });

// Fetch a single event by id
export const useSingleEvent = (id?: string) =>
    useQuery({
        queryKey: ["event", id],
        queryFn: () => getSingleEvent(id as string),
        enabled: !!id,
    });

// Fetch user's registered events
export const useUserEvents = () =>
    useQuery({
        queryKey: ["user-events"],
        queryFn: getUserEvents,
    });

// Create an event
export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEventApi,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

// Update an event
export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, data }: { eventId: string; data: FormData }) =>
            updateEvent(eventId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

// Delete an event
export const useDeleteEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

/**
 * Pay/register for an event (authenticated users only)
 */
export const usePayForEvent = () => {
    return useMutation({
        mutationFn: payForEvent,
        onSuccess: () => {
            // Refetch events after successful payment
        },
    });
};

// Verify payment for an event by transactionId
export const useVerifyPayment = () => {
    return useMutation({
        mutationFn: verifyPayment,
        onSuccess: () => {
            // Optionally: refetch events or payment status here
        },
    });
};

// Get payment status for an event (authenticated users only)
export const useGetStatus = (eventId?: string) =>
    useQuery({
        queryKey: ["event-payment-status", eventId],
        queryFn: () => getStatus(eventId as string),
        enabled: !!eventId,
    });
