import { 
    payForEvent,
    createEventApi, 
    fetchEvents, 
    getSingleEvent,
    registerEvent,
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
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};

// Register for an event
export const useRegisterEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: registerEvent,
        // Optionally: refetch the events or event after registration
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};



// Pay for an event
export const usePayForEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: payForEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
};


// Verify payment for an event (mutation)
export const useVerifyPayment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: verifyPayment,
        onSuccess: () => {
            // You may invalidate or refetch related event/payment data here
            queryClient.invalidateQueries({ queryKey: ["events"] });
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
