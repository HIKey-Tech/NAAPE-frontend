import {
    payForEvent,
    createEventApi,
    fetchEvents,
    getSingleEvent,
    verifyPayment,
    getStatus,
    getUserEvents
} from "@/app/api/events/events";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all events
export const useEvents = () =>
    useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
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
