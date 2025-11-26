import { 
    createEventApi, 
    fetchEvents, 
    getSingleEvent,
    registerEvent
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
