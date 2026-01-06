import {
    payForEvent,
    createEventApi,
    fetchEvents,
    getSingleEvent,
    verifyPayment,
    getStatus
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

// Create an event
export const useCreateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createEventApi,
        onSuccess: () => {
            // Optionally re-fetch events after a successful creation
            // queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

/**
 * Pay/register for an event.
 * Handles both guest and user-based registration, depending on which args you supply.
 * 
 * Example usage:
 *   payForEvent({ eventId, user }) // for logged-in user
 *   payForEvent({ eventId, guest }) // for guest
 */
export const usePayForEvent = () => {
    return useMutation({
        mutationFn: payForEvent,
        onSuccess: () => {
            // You may want to refetch payment or event status after success
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

// Get payment status for an event and email (query)
export const useGetStatus = (eventId?: string, email?: string) =>
    useQuery({
        queryKey: ["event-payment-status", eventId, email],
        queryFn: () => getStatus(eventId as string, email as string),
        enabled: !!eventId && !!email,
    });
