import {
    fetchEvents,
    createEventApi,
    getSingleEvent,
    payForEvent,
    verifyPayment,
    getStatus,
} from "@/app/api/events/events";

import { useQuery, useMutation } from "@tanstack/react-query";

/* EVENTS */

export const useEvents = () =>
    useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents,
    });

export const useSingleEvent = (id?: string) =>
    useQuery({
        queryKey: ["event", id],
        queryFn: () => getSingleEvent(id!),
        enabled: !!id,
    });

export const useCreateEvent = () =>
    useMutation({
        mutationFn: createEventApi,
    });

/* PAYMENTS */

export const usePayForEvent = () =>
    useMutation({
        mutationFn: payForEvent,
    });

export const useVerifyPayment = () =>
    useMutation({
        mutationFn: verifyPayment,
    });

export const useGetStatus = (eventId?: string, email?: string) =>
    useQuery({
        queryKey: ["event-payment-status", eventId, email],
        queryFn: () => getStatus(eventId!, email!),
        enabled: !!eventId && !!email,
    });
